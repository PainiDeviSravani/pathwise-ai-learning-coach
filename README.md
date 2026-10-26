# PathWise AI

**A study planner that doesn't give up on you when you fall behind.**

Live demo: https://pathwise-ai-ju9o.onrender.com

API docs: https://pathwise-backend-vzny.onrender.com/docs

*Heads up: the backend runs on a free server, so the very first click can take up to a minute while it wakes up.*

---

## Why we built this

All of us have started a study plan with big energy and quit two weeks later. It wasn't laziness. Life got busy, we missed a few days, and the plan was now wrong. Every planner we tried just stayed the same, and falling behind felt like failing.

So we asked: what if the plan changed with you?

## What PathWise AI does

You tell it something like:

> "I want to become a Java backend developer in 6 months. I know basic Java and can study 1.5 hours a day."

And it gives you:

- A roadmap broken into weeks and days, with tasks that fit your time
- The skills you're missing for your goal
- A short reason behind every task, so you know why you're doing it
- A quiz on what you just studied
- A **re-plan** when you miss days or score low. It rebuilds your next week around your weak topics, takes a lighter load if you're stretched, and explains what it changed

That last part is what we're proudest of. The plan responds to how your week actually went.

## How it works

1. You enter your goal, level, daily time, and timeline.
2. The backend asks the Gemini AI for a structured plan and sends it to the app.
3. You tick off tasks and take quizzes as you go.
4. If you miss days or score low, the app sends your days missed, quiz score, and weak topics back to the AI, which rebuilds the next week.

## Screenshots

| Start | Your plan |
<img width="1533" height="576" alt="image" src="https://github.com/user-attachments/assets/8b14e7e4-d52d-41eb-8bc9-dfda1ce71580" />


|---|---|
| 

![Home](<img width="1527" height="722" alt="image" src="https://github.com/user-attachments/assets/4fc93c32-517a-40db-bbdb-a4d93cee3ad3" />


 | 

![Plan](<img width="1511" height="723" alt="image" src="https://github.com/user-attachments/assets/85759d52-8350-47ad-89b5-020728617ee0" />)


 |

| Quiz |
|---|---|
| 

![Quiz](<img width="1512" height="727" alt="image" src="https://github.com/user-attachments/assets/9aa67742-ecd7-4bd1-9eba-40d52ece92bb" />)
(<img width="1518" height="735" alt="image" src="https://github.com/user-attachments/assets/afbc379a-e738-44e0-a2d3-ada165f3d36a" />)


 |

| Re-plan after a rough week |
|---|
| 

![Replan](<img width="1513" height="726" alt="image" src="https://github.com/user-attachments/assets/b201c017-32e9-4113-990d-512c2252af4c" />)

 |

## Try it in 2 minutes

1. Open the live demo and click **Generate my plan** (the form is pre-filled with the Java example).
2. Tick off a few tasks and watch the progress ring.
3. Take the quiz and get a few answers wrong on purpose.
4. Set "days missed" to 3 or 4 and click **Re-plan my next week**.
5. Read what the AI changed and why.

## What's under the hood

- **Frontend:** React (Vite) with custom CSS
- **Backend:** Python and FastAPI
- **AI:** Google Gemini API, prompted to return strict JSON so the app can display it reliably
- **Hosting:** Render, with the code on GitHub

A few things we did to make it dependable:

- The AI is told to keep each day within your time limit.
- If the AI is busy, the backend retries and switches models.
- If everything fails, it shows a sample plan so the app never ends on a blank error.

## API

| Endpoint | What it does |
|---|---|
| `POST /generate-plan` | Builds a personalized roadmap |
| `POST /quiz` | Creates a 5-question quiz on a topic |
| `POST /replan` | Rebuilds next week from your progress |

Interactive docs are at `/docs`.

## Run it on your own machine

You'll need Python 3.10+, Node.js 18+, and a free Gemini API key from Google AI Studio.

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```
Copy `.env.example` to `.env` and add your key, then:
```bash
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Honest limitations

We'd rather you hear these from us:

- Progress isn't saved yet. Refreshing the page starts over.
- The "job readiness" number is the AI's rough estimate, meant as encouragement, not a real assessment.
- The AI can occasionally suggest a topic order you'd tweak, so treat the plan as a strong first draft.

## Where we'd take it next

- Accounts, so progress is saved across devices
- Links to good learning resources for each task
- Coding exercises that get checked automatically
- Reminders and streaks to help you stay consistent

## The team

|Team Vision | |Ai learning path and practice path
|---|---|
| [Paini Devi Sravani] | [backend and AI prompts] |
|[T.R.S.S.Moukthika] | [Deploying the app] |
| [D.chandana] | [frontend and design] |

Built for [], 2026.
