import json, os, time
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types
from fallback import PLAN, QUIZ, REPLAN

load_dotenv(Path(__file__).parent / ".env")
API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY) if API_KEY else None

MODELS = ["gemini-3.5-flash", "gemini-3-flash-preview",
          "gemini-3.1-flash-lite", "gemini-flash-latest"]

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])


def ask(system, user, fallback=None):
    last_error = None
    if client is not None:
        for attempt in range(2):
            for model in MODELS:
                try:
                    r = client.models.generate_content(
                        model=model,
                        contents=user,
                        config=types.GenerateContentConfig(
                            system_instruction=system,
                            response_mime_type="application/json",
                        ),
                    )
                    text = r.text.replace("```json", "").replace("```", "").strip()
                    return json.loads(text)
                except Exception as e:
                    print("MODEL FAILED:", model, str(e)[:150])
                    last_error = e
            time.sleep(2)
    if fallback is not None:
        print("USING FALLBACK DATA")
        return fallback
    raise HTTPException(status_code=503,
                        detail="AI is busy, please try again. " + str(last_error)[:200])


# ---------- PLAN ----------
class PlanRequest(BaseModel):
    goal: str
    level: str
    hours_per_day: float
    months: int

SYSTEM = """You are a learning-path coach. Return ONLY valid JSON.
Schema:
{"summary": str, "skill_gaps": [str], "readiness": int,
 "weeks": [{"week": int, "theme": str,
   "days": [{"day": int, "tasks":
     [{"topic": str, "minutes": int, "why": str}]}]}]}
Rules: daily minutes must not exceed the user's limit.
Generate only the first 2 weeks in detail, to keep it fast."""

@app.post("/generate-plan")
def generate_plan(req: PlanRequest):
    prompt = (f"Goal: {req.goal}\nCurrent level: {req.level}\n"
              f"Study time: {req.hours_per_day} hrs/day\n"
              f"Timeline: {req.months} months")
    return ask(SYSTEM, prompt, PLAN)


# ---------- QUIZ ----------
class QuizRequest(BaseModel):
    topic: str
    level: str

QUIZ_SYSTEM = """Return ONLY valid JSON:
{"questions": [{"q": str, "options": [str, str, str, str],
 "answer_index": int, "explanation": str}]}
Create exactly 5 multiple-choice questions."""

@app.post("/quiz")
def quiz(req: QuizRequest):
    return ask(QUIZ_SYSTEM, f"Topic: {req.topic}\nLevel: {req.level}", QUIZ)


# ---------- RE-PLAN ----------
class ReplanRequest(BaseModel):
    goal: str
    hours_per_day: float
    current_week: int
    days_missed: int
    quiz_score: int
    weak_topics: list[str] = []

REPLAN_SYSTEM = """You are an adaptive learning coach. Return ONLY valid JSON:
{"changes_explained": str, "readiness": int,
 "week": {"week": int, "theme": str, "days": [{"day": int, "tasks":
   [{"topic": str, "minutes": int, "why": str}]}]}}
Rules: rebuild ONLY the next week. If days were missed, lighten the load
and recover key topics. If the score is low, revisit weak topics first.
Daily minutes must not exceed the user's limit."""

@app.post("/replan")
def replan(req: ReplanRequest):
    prompt = (f"Goal: {req.goal}\nStudy time: {req.hours_per_day} hrs/day\n"
              f"Current week: {req.current_week}\n"
              f"Days missed: {req.days_missed}\n"
              f"Last quiz score: {req.quiz_score}%\n"
              f"Weak topics: {', '.join(req.weak_topics)}")
    return ask(REPLAN_SYSTEM, prompt, REPLAN)
