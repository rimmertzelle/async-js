# Lesson: Async JavaScript — Promises

**Target audience:** HBO-ICT year 1–2, mixed intake (HAVO, MBO-4, non-traditional). Assumes familiarity with JavaScript functions, callbacks, and basic async concepts (e.g., `setTimeout`).
**Duration:** 90 minutes
**Learning objectives (as questions):**
- Why do callbacks fall short for complex async code — and what problem do Promises solve?
- How does a Promise move through its states, and how do you consume one?
- How can you chain Promises to sequence async operations without nesting?
- How do you handle errors in a Promise chain in a way that is predictable and maintainable?

---

## 1. Opening — Challenging Problem or Question

**The scenario (show live, or on slide):**

You are building a small news reader. When the page loads, it should:

1. Fetch the list of available articles from the API
2. Take the first article from that list and fetch its full details
3. Display a message like: *"First article: The Rise of Electric Vehicles by Jane Doe"*

Show this broken version first (do not explain it — let students react):

```javascript
fetch("https://articles-zxjs.onrender.com/articles")
  .then(function(response) {
    response.json().then(function(list) {
      fetch("https://articles-zxjs.onrender.com" + list.data[0])
        .then(function(r) {
          r.json().then(function(article) {
            console.log("First article: " + article.data.title + " by " + article.data.author);
          });
        });
    });
  });
```

**Opening question (on screen, 3 minutes think-pair):**

> "This code works — but what happens if the first request fails? Or if the second fetch never resolves? Where would you even put the error handling?"

Do not answer yet. Let the discomfort land.

<!-- Persona note:
- Fatima: The scenario is immediately recognisable — she has seen "it works but it's a mess" code before. She will likely identify the nested structure as the problem.
- Lars: The context (news app, two sequential requests) gives a concrete anchor. Show the expected output first so he knows what "working" looks like before analysing what could break.
- Daan: Will probably jump to "there must be a better abstraction." Channel this — he is right, and that is exactly where the lesson goes.
-->

---

## 2. Prior Knowledge Check

**Quick poll / show of hands (5 minutes):**

Present three statements. Students vote: *True / False / Not sure*.

1. "JavaScript executes code line by line, so async functions always wait for each other."
2. "A callback function is passed as an argument and called later — that's the only way to handle async."
3. "If an async operation fails inside a `setTimeout`, the error will crash the page."

Discuss the statements briefly — surface the misconceptions before resolving them.

<!-- Persona note:
- Lars: May believe statement 1 is true (linear mental model of execution). This is the core misconception to address.
- Fatima: May believe statement 2 is true because callbacks have always worked for her. Acknowledge this: "Callbacks do work — the question is how well they scale."
- Daan: May already know all three are false. Ask him to hold back and see if the discussion reveals what he *assumed* others understood.
-->

---

## 3. Core Concepts

**Timing: ~35 minutes (explain → demo → check → explain → demo → check)**

### 3.1 — What is a Promise?

A Promise represents the eventual result of an async operation. It is an object with two things:
- A **state**: `pending` → `fulfilled` or `rejected`
- A **result**: `undefined` → the resolved value or the error

```javascript
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve("done!"), 1000);
});

promise.then(result => console.log(result)); // "done!" after 1 second
```

**Analogy:** A Promise is like a receipt from an online order. You don't have the package yet, but you have a confirmed reference to it. You can already decide what to do *when* it arrives — or *if* it doesn't.

<!-- Persona note:
- Lars: The receipt analogy gives a concrete mental model. Walk through the states visually (pending → fulfilled → rejected) before showing code.
- Fatima: Will appreciate seeing the pattern she has seen in `fetch()` named and explained. "You have already used this — now we are looking under the hood."
- Daan: Ask: "Why can you only settle a Promise once? What would happen if you could?" This surfaces the invariant and rewards conceptual curiosity.
-->

### 3.2 — Consuming a Promise: `.then`, `.catch`, `.finally`

```javascript
fetch("https://articles-zxjs.onrender.com/articles/1")
  .then(response => response.json())
  .then(data => console.log(data.data.title + " by " + data.data.author))
  .catch(error => console.log("Something went wrong:", error))
  .finally(() => console.log("Request finished."));
```

Key points:
- `.then()` handles success, `.catch()` handles failure
- `.finally()` runs either way — good for cleanup (hiding a spinner, closing a loader)
- `.catch()` catches errors from *anywhere* above it in the chain

### 3.3 — Promise Chaining

Each `.then()` returns a *new* Promise. That means you can chain them to sequence async steps — flat, readable, no nesting.

```javascript
function getArticle(id) {
  return fetch(`https://articles-zxjs.onrender.com/articles/${id}`)
    .then(response => response.json())
    .then(data => data.data);
}

getArticle(1)
  .then(article => console.log(article.title + " by " + article.author))
  .catch(err => console.log("Error:", err));
```

**Common misconception to address explicitly:**

> Adding multiple `.then()` to the same Promise is *not* chaining — each one receives the *original* result. Chaining means each `.then()` is attached to the *previous* `.then()`'s return value.

Show both versions side by side and ask students to predict the difference in output.

<!-- Persona note:
- Lars: Worked examples with predictable output first, then ask him to modify one parameter. Reduces cognitive load while building confidence.
- Fatima: Invite her to refactor the nested callback version from the opening into a chain. This validates her experience while introducing the new pattern.
- Daan: Ask: "What happens if one `.then()` in the middle throws an error? Which `.catch()` catches it?" This probes the underlying mechanism and rewards depth.
-->

---

## 4. Application

**Timing: ~25 minutes**

### Task: Build the news reader (in pairs or individually)

> Using the articles API and Promises, build a small script that:
>
> 1. Fetches the list of all articles from `https://articles-zxjs.onrender.com/articles`
> 2. Takes the URL of the first article from `data.data[0]` and fetches that article's details
> 3. Logs a message like: *"First article: The Rise of Electric Vehicles by Jane Doe"*
> 4. Handles any errors and logs a clear message if something goes wrong

**Starter code** (give this to students):

```javascript
const baseUrl = "https://articles-zxjs.onrender.com";

fetch(baseUrl + "/articles")
  .then(/* parse the response as JSON */)
  .then(/* take data.data[0] and fetch that article */)
  .then(/* parse the article response as JSON */)
  .then(/* log the title and author */)
  .catch(/* log a clear error message */);
```

**Extension challenge (for Daan / early finishers):**

> Modify your code to fetch the *first three articles in parallel* using `Promise.all()`. Display all three titles when all requests have completed. What happens if one request fails?

<!-- Persona note:
- Low floor: The starter code and single base URL reduce setup friction. Lars can focus on the Promise chain without getting stuck on API structure.
- High floor: The extension challenge introduces `Promise.all()` — a natural next concept that rewards initiative without being required.
- Fatima: Encourage her to think about how this chained fetch pattern would apply in a real app she has worked with (e.g., a product listing page that loads details on click).
- Daan: The `Promise.all()` extension is deliberately open-ended — what happens on partial failure is not a simple answer and rewards experimentation.
- Teacher note: Circulate and look for students who are nesting `.then()` inside `.then()` — this is the callback-mindset anti-pattern and worth pausing the room to address if common.
-->

---

## 5. Reflection

**Timing: ~10 minutes**

End the lesson with these questions — ask students to write briefly (exit ticket), then share one answer per table:

1. "At the start of the lesson, I showed you a nested callback. What specifically makes the Promise chain version better — or is it just personal preference?"
2. "Where could a `.catch()` be placed in a chain — and does it matter where?"
3. "What is one thing from today that connects to something you have seen before — in this course, a project, or your own experience?"
4. "What is one thing you are still uncertain about? Write it down — we will start next lesson with your questions."

<!-- Persona note:
- Q3 explicitly invites Fatima's practical reference points and Daan's self-directed background, while giving Lars permission to connect to course content rather than professional experience.
- Q4 normalises uncertainty and sets up the next lesson's opening.
-->

---

## Sources Used

- [javascript.info — Promise Basics](https://javascript.info/promise-basics)
- [javascript.info — Promise Chaining](https://javascript.info/promise-chaining)
- [javascript.info — Promise Error Handling](https://javascript.info/promise-error-handling)
- [Articles API](https://articles-zxjs.onrender.com/articles) — used for live fetch examples (no API key required; source on [GitHub](https://github.com/HZ-HBO-ICT/articles))
- Bain, K. (2004). *What the Best College Teachers Do*. Harvard University Press.
- `.claude/context/educational_context.md` — Bain-inspired lesson structure
- `.claude/context/persona.md` — HBO-ICT student archetypes and UDL checklist
