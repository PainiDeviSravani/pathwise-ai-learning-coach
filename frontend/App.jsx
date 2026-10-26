import { useState } from "react";
import "./App.css";
const API = "https://pathwise-backend-vzny.onrender.com";
async function post(path, body) {
  const r = await fetch(API + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error("API error");
  return r.json();
}

function Ring({ value, label }) {
  const r = 38, c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="ring">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#334155" strokeWidth="9" />
        <circle cx="48" cy="48" r={r} fill="none" stroke="#22c55e" strokeWidth="9"
          strokeLinecap="round" strokeDasharray={c}
          strokeDashoffset={c - (c * v) / 100}
          transform="rotate(-90 48 48)"
          style={{ transition: "stroke-dashoffset .6s" }} />
        <text x="48" y="54" textAnchor="middle" fill="#e2e8f0"
          fontSize="20" fontWeight="700">{v}%</text>
      </svg>
      <div className="ring-label">{label}</div>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({
    goal: "Java backend developer", level: "basic Java",
    hours_per_day: 1.5, months: 6,
  });
  const [plan, setPlan] = useState(null);
  const [done, setDone] = useState({});
  const [quiz, setQuiz] = useState(null);
  const [topic, setTopic] = useState("");
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [missed, setMissed] = useState(3);
  const [replan, setReplan] = useState(null);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const run = async (label, fn) => {
    setLoading(label); setError("");
    try { await fn(); } catch { setError("Failed. Is the backend running? Try again."); }
    setLoading("");
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const total = plan ? plan.weeks.reduce((a, w) =>
    a + w.days.reduce((b, d) => b + d.tasks.length, 0), 0) : 0;
  const finished = Object.values(done).filter(Boolean).length;
  const progress = total ? Math.round((finished / total) * 100) : 0;

  const generate = () => run("plan", async () => {
    const data = await post("/generate-plan", {
      ...form, hours_per_day: +form.hours_per_day, months: +form.months });
    setPlan(data); setDone({}); setQuiz(null); setReplan(null); setScore(null);
  });

  const getQuiz = () => run("quiz", async () => {
    const t = plan.weeks[0].days[0].tasks[0].topic;
    setTopic(t); setAnswers({}); setScore(null);
    setQuiz(await post("/quiz", { topic: t, level: form.level }));
  });

  const submitQuiz = () => {
    const right = quiz.questions.filter((q, i) => answers[i] === q.answer_index).length;
    setScore(Math.round((right / quiz.questions.length) * 100));
  };

  const doReplan = () => run("replan", async () => {
    setReplan(await post("/replan", {
      goal: form.goal, hours_per_day: +form.hours_per_day, current_week: 1,
      days_missed: +missed, quiz_score: score ?? 50,
      weak_topics: score !== null && score < 70 ? [topic] : [],
    }));
  });

  return (
    <div className="wrap">
      <h1>🧭 PathWise AI</h1>
      <div className="sub">Your adaptive learning path & practice coach</div>

      <div className="card">
        <input value={form.goal} onChange={set("goal")} placeholder="Goal" />
        <input value={form.level} onChange={set("level")} placeholder="Current level" />
        <input type="number" step="0.5" value={form.hours_per_day} onChange={set("hours_per_day")} style={{width:80}} /> hrs/day
        <input type="number" value={form.months} onChange={set("months")} style={{width:70}} /> months
        <br />
        <button onClick={generate} disabled={!!loading}>
          {loading === "plan" ? "Generating..." : "Generate my plan"}
        </button>
        {error && <div className="bad">{error}</div>}
      </div>

      {plan && (<>
        <div className="card">
          <b>{plan.summary}</b>
        <div className="rings">
          <Ring value={plan.readiness} label="Job readiness" />
          <Ring value={progress} label="Plan progress" />
        </div>
          <div style={{marginTop:10}}>
            {plan.skill_gaps.map((g) => <span className="tag" key={g}>{g}</span>)}
          </div>
        </div>

        {plan.weeks.map((w) => (
          <div className="card" key={w.week}>
            <h3>Week {w.week}: {w.theme}</h3>
            {w.days.map((d) => (
              <div key={d.day}>
                <b>Day {d.day}</b>
                {d.tasks.map((t, i) => {
                  const id = `${w.week}-${d.day}-${i}`;
                  return (
                    <div className="task" key={id}>
                      <label>
                        <input type="checkbox" checked={!!done[id]}
                          onChange={() => setDone({ ...done, [id]: !done[id] })} />
                        {t.topic} ({t.minutes} min)
                      </label>
                      <div className="why">💡 {t.why}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}

        <div className="card">
          <h3>Practice coach</h3>
          <button onClick={getQuiz} disabled={!!loading}>
            {loading === "quiz" ? "Loading..." : "Take a quiz on today's topic"}
          </button>
          {quiz && (<>
            <p>Topic: <b>{topic}</b></p>
            {quiz.questions.map((q, i) => (
              <div key={i} style={{marginBottom:12}}>
                <b>{i + 1}. {q.q}</b>
                {q.options.map((o, j) => (
                  <button key={j} className={"opt" + (answers[i] === j ? " sel" : "")}
                    onClick={() => setAnswers({ ...answers, [i]: j })}>{o}</button>
                ))}
                {score !== null && (
                  <div className={answers[i] === q.answer_index ? "ok" : "bad"}>
                    {answers[i] === q.answer_index ? "✔ Correct" : "✘ Wrong"} — {q.explanation}
                  </div>
                )}
              </div>
            ))}
            <button onClick={submitQuiz}>Submit quiz</button>
            {score !== null && <h3>Score: {score}%</h3>}
          </>)}
        </div>

        <div className="card">
          <h3>Adaptive re-plan</h3>
          Days missed: <input type="number" value={missed}
            onChange={(e) => setMissed(e.target.value)} style={{width:70}} />
          <button onClick={doReplan} disabled={!!loading}>
            {loading === "replan" ? "Re-planning..." : "Re-plan my next week"}
          </button>
          {replan && (
            <div style={{marginTop:12}}>
              <p>🔄 <b>{replan.changes_explained}</b></p>
              <Ring value={replan.readiness} label="Readiness after re-plan" />
              <h4>Week {replan.week.week}: {replan.week.theme}</h4>
              {replan.week.days.map((d) => (
                <div key={d.day}><b>Day {d.day}</b>
                  {d.tasks.map((t, i) => (
                    <div className="task" key={i}>{t.topic} ({t.minutes} min)
                      <div className="why">💡 {t.why}</div></div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </>)}
    </div>
  );
}
