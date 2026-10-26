PLAN = {
  "summary": "6-month path to Java backend developer",
  "skill_gaps": ["Collections", "Spring Boot", "SQL & JPA", "REST APIs"],
  "readiness": 25,
  "weeks": [{
    "week": 1, "theme": "Core Java strengthening",
    "days": [
      {"day": 1, "tasks": [
        {"topic": "OOP: interfaces & inheritance", "minutes": 60,
         "why": "Spring is built on these concepts"},
        {"topic": "5 small OOP exercises", "minutes": 30,
         "why": "Practice locks in the theory"}]},
      {"day": 2, "tasks": [
        {"topic": "Collections: List, Set, Map", "minutes": 60,
         "why": "Used in every backend project"},
        {"topic": "Collections practice problems", "minutes": 30,
         "why": "Builds speed and confidence"}]}
    ]}]
}

QUIZ = {"questions": [
  {"q": "Which collection does not allow duplicate elements?",
   "options": ["List", "Set", "ArrayList", "LinkedList"],
   "answer_index": 1, "explanation": "A Set stores only unique elements."},
  {"q": "Which keyword is used to inherit a class in Java?",
   "options": ["implements", "inherits", "extends", "super"],
   "answer_index": 2, "explanation": "extends creates a subclass."},
  {"q": "What does a Map store?",
   "options": ["Single values", "Key-value pairs", "Only keys", "Only indexes"],
   "answer_index": 1, "explanation": "A Map links each key to a value."}
]}

REPLAN = {
  "changes_explained": "You missed days and scored low on collections, so next week revisits collections first with a lighter daily load.",
  "readiness": 22,
  "week": {"week": 2, "theme": "Collections recovery", "days": [
    {"day": 1, "tasks": [
      {"topic": "Collections: Map and HashMap", "minutes": 45,
       "why": "Your weak topic, so it comes first"}]},
    {"day": 2, "tasks": [
      {"topic": "Collections practice quiz", "minutes": 45,
       "why": "Checks that the gap is closed"}]}
  ]}
}