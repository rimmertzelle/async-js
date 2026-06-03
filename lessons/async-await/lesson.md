# Lesson: Async/Await

**Target audience:** 1st-year bachelor Software Engineering students (HBO-ICT)
**Duration:** 90 minutes
**Prior knowledge:** Promises (`.then()` / `.catch()`), REST APIs, callbacks

**Learning objectives (as questions):**

- What does `async` actually do to a function?
- What does `await` actually do — and how is it different from `.then()`?
- How do you handle errors in an async function?
- How do I rewrite a Promise chain as async/await — and when would I choose one over the other?
- How do I use async/await to fetch and display data from the classic-cars API?

---

## 1. Opening — Challenging Problem or Question

**Time:** ~10 min

Show both code snippets side by side — no explanation yet:

```js
// Version A — Promises
fetch('/api/cars')
  .then(response => response.json())
  .then(envelope => {
    const cars = envelope.data;
    renderCars(cars);
  })
  .catch(error => console.error(error));
```

```js
// Version B — Async/Await
async function loadCars() {
  try {
    const response = await fetch('/api/cars');
    const envelope = await response.json();
    renderCars(envelope.data);
  } catch (error) {
    console.error(error);
  }
}

loadCars();
```

Ask the class:

> "These two snippets do the same thing. Look at Version B. Without me explaining anything — what do you think `async` and `await` are doing here?"

Take answers. Then ask: *"Which version would you rather read in six months? Why?"*

Don't resolve the mechanics yet. The goal is to activate intuition and surface what they already suspect.

<!-- Persona note:
- Fatima may have seen async/await in a real project or tutorial — invite her to share what she remembers. Use it as an anchor for the group rather than a spoiler.
- Lars will likely be able to point at the `await` keyword and say "it waits for something" — that intuition is correct and worth affirming before formalising it.
- Daan may immediately want to know about top-level await, Promise.all, or edge cases — park those for the extension challenge later.
-->

---

## 2. Prior Knowledge Check

**Time:** ~8 min

Show this code and ask: **what does this print, and in what order?**

```js
console.log('A');

fetch('/api/cars')
  .then(response => response.json())
  .then(data => console.log('B', data));

console.log('C');
```

Ask students to predict the output before running it. Expected output:

```
A
C
B { meta: ..., links: ..., data: [...] }
```

This surfaces two common misconceptions:
1. *"It prints A, B, C"* — the student thinks `.then()` runs immediately (sync confusion)
2. *"It prints A, C, then nothing"* — the student doesn't trust that the Promise resolves at all

Write both on the board. Then ask: *"So if we add `await` before `fetch(...)` — what changes?"*

<!-- Persona note:
- Lars may get the order wrong and feel embarrassed — frame it as "this surprises most people, including experienced developers." Normalise the misconception.
- Fatima may get it right from intuition; push her to explain *why* — "what is the event loop doing between C and B?"
- Daan may already know the answer; ask him to explain it to the person next to him before the class discussion.
-->

---

## 3. Core Concepts

**Time:** ~20 min

### 3.1 — `async` wraps the return value in a Promise

```js
async function greet() {
  return 'hello';
}

greet(); // → Promise { 'hello' }
```

An `async` function **always returns a Promise**, even if you return a plain value. It never blocks the caller.

Ask: *"What does this mean for a function that already returns a Promise?"* (It wraps it — but since a Promise returned inside a Promise flattens, the behaviour is the same.)

### 3.2 — `await` unwraps the Promise and pauses — but only inside the function

```js
async function loadCars() {
  const response = await fetch('/api/cars');   // pauses here
  const envelope = await response.json();      // pauses here
  return envelope.data;                        // resumes, returns array
}
```

`await` pauses execution **inside the async function** — the rest of the JavaScript engine keeps running. This is not blocking the whole program; it is suspending only this function's execution until the Promise resolves.

Connect to what they know: `await somePromise` is equivalent to `.then(result => ...)`, just written in a way that reads top-to-bottom like synchronous code.

| Promise chain | Async/await |
|---------------|-------------|
| `fetch(url).then(r => r.json()).then(d => use(d))` | `const r = await fetch(url); const d = await r.json(); use(d);` |
| `.catch(e => ...)` | `try { ... } catch (e) { ... }` |

### 3.3 — Error handling with try/catch

```js
async function loadCars() {
  try {
    const response = await fetch('/api/cars');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const envelope = await response.json();
    return envelope.data;
  } catch (error) {
    console.error('Something went wrong:', error);
    return [];
  }
}
```

Key points:
- If the `await`-ed Promise rejects, it **throws** inside the function — just like a regular exception.
- `try/catch` works exactly as it does with synchronous code. This is the readability win.
- Check `response.ok` explicitly — `fetch()` only rejects on network failure, **not** on HTTP errors like 404 or 500.

<!-- Persona note:
- The `response.ok` check is a classic pitfall — Fatima may have hit this in practice. Ask if anyone has seen a `fetch` that "worked" but returned the wrong data. If yes, that was likely a missed 4xx/5xx.
- For Lars: make the analogy explicit — "try/catch here works the same way as catching a null pointer in Java."
- For Daan: ask "when would you use `.catch()` on the Promise directly instead of try/catch in async?" (valid for top-level code and Promise.all scenarios).
-->

### 3.4 — `await` only works inside `async` functions

```js
// This fails — top-level await is not available in all environments
const data = await fetch('/api/cars'); // SyntaxError

// This works
async function init() {
  const data = await fetch('/api/cars');
}
```

A common mistake is forgetting the `async` keyword and then getting a confusing `SyntaxError`. The fix is always: wrap it in an `async` function, or (in modern environments) use a top-level async module.

---

## 4. Application

**Time:** ~40 min

Students connect async/await to the classic-cars backend they have been working with. The backend already serves `/api/cars` returning the standard envelope (`meta`, `links`, `data`).

**Task (stated as a question):**

> *"You have a page with an empty `<ul id="car-list">`. Using async/await, fetch all cars from `GET /api/cars` and render each car's model and year as a list item. What do you do if the request fails?"*

**Minimal path (low floor — Lars):**

1. Write an `async` function `loadCars()` that:
   - `await`s `fetch('/api/cars')`
   - `await`s `.json()` on the response
   - Reads `envelope.data` to get the array
2. Loop over the array and append `<li>` elements to `#car-list`
3. Wrap in `try/catch` and show an error message in the DOM if it fails
4. Call `loadCars()` at the bottom of the script

**Extension (high ceiling — Daan and fast finishers):**

- Also fetch a single car from `GET /api/cars/1` on page load and display it in a detail panel. What is different about the `data` shape for a single resource vs. a collection?
- Refactor the fetch + JSON parsing into a reusable `apiFetch(url)` helper function that throws on non-OK responses, then use it for both requests.
- What happens if you call two async functions at the same time without `await`? Try it and observe the behaviour. What would `Promise.all` give you here?

**Teacher note:**
- The most common error is forgetting the second `await` on `.json()`. When this happens, students get `[object Promise]` in the DOM — use it as a teachable moment about what `.json()` actually returns.
- Students who put `await` outside an `async` function will get a SyntaxError. Remind them of section 3.4.
- Check that students are reading `envelope.data` and not `envelope` directly — the API response has the envelope wrapper.

<!-- Persona note:
- Lars: if stuck, show the Promise chain version first (which he knows) and then guide him to rewrite it step by step as async/await. The translation is mechanical and builds confidence.
- Fatima: push her to implement the `apiFetch()` helper — she will appreciate the pattern from a maintainability angle and can connect it to her work experience.
- Daan: the `Promise.all` exploration is genuinely interesting and worth his time. Let him run with it.
-->

---

## 5. Reflection

**Time:** ~10 min

Pose one question at a time; use think-pair-share or Mentimeter:

1. **"You have a `.then()` chain that works. Your team lead asks you to rewrite it with async/await. What actually changes — and what stays exactly the same?"**
   *(targets: understanding that async/await is syntax, not a new mechanism)*

2. **"Why does `fetch('/api/cars')` not reject on a 404 — and how do you handle that in an async function?"**
   *(targets: the `response.ok` pitfall)*

3. **"What is one thing about async/await that surprised you today, or that you understand differently now?"**
   *(metacognitive; space for Fatima's practical experience and Daan's depth)*

Optional 2-minute exit ticket:

> *"Finish this sentence in your own words: `await` pauses a function because…"*

---

## Sources Used

- [implementing-api-responses.md](https://github.com/rimmertzelle/classic-cars/blob/frontend-improvements/docs/implementing-api-responses.md) — backend envelope structure used in the application exercise
- [javascript.info/async-await](https://javascript.info/async-await) — async/await syntax, behaviour, and error handling
- Ken Bain, *What the Best College Teachers Do* — lesson design principles
- `.claude/context/educational_context.md` and `.claude/context/persona.md` — course context
