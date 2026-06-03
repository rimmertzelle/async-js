# Quiz — Async/Await

*Use these questions to check your own understanding. There are no grades — just honest self-reflection.*

---

## Q1 — What `async` returns

**Type:** Recall
**Primarily for:** Lars

**Question:**
What does the following function return when you call it?

```js
async function greet() {
    return 'hello';
}

const result = greet();
console.log(result);
```

A) The string `'hello'`
B) `undefined`
C) A Promise that resolves to `'hello'`
D) A syntax error

**Self-check:**
The answer is **C**. An `async` function always returns a Promise, even when the return value is a plain string. The string is automatically wrapped. If you answered A, re-read section 3.1 of the lesson — this is the most common mental model mistake with async/await.

---

## Q2 — Reading a fetch response

**Type:** Application
**Primarily for:** Fatima

**Question:**
A student writes the following code to load cars:

```js
async function loadCars() {
    const response = await fetch('/api/cars');
    const envelope = response.json();
    console.log(envelope.data);
}
```

The console prints `undefined`. What is wrong, and how do you fix it?

**Self-check:**
The `await` before `response.json()` is missing. `.json()` is itself asynchronous — it returns a Promise. Without `await`, `envelope` is a Promise object, not the parsed data, so `envelope.data` is `undefined`. Fix: `const envelope = await response.json();`

---

## Q3 — Error handling

**Type:** Conceptual
**Primarily for:** Daan

**Question:**
You fetch a car that does not exist:

```js
const response = await fetch('/api/cars/9999');
const envelope = await response.json();
```

`response.ok` is `false`, but no error is thrown. Why not? And how do you handle this correctly in an async function?

**Self-check:**
`fetch()` only rejects its Promise (i.e. throws in an async function) on a **network failure** — for example, when there is no internet connection or the server cannot be reached. HTTP error status codes (4xx, 5xx) do **not** cause a rejection. The Promise resolves normally with a response object that has `ok: false`. To handle this correctly you must either check `response.ok` and throw manually, or inspect `envelope.error` from the API's error envelope. `try/catch` alone will not catch a 404.

---

## Q4 — Comparing approaches

**Type:** Transfer
**For:** All

**Question:**
Your team has this working code:

```js
fetch('/api/cars')
    .then(r => r.json())
    .then(envelope => renderCars(envelope.data))
    .catch(err => showError(err));
```

A new team member asks: *"Should we rewrite this with async/await?"* What would you say — and what, if anything, actually changes if you do?

**Self-check:**
There is no single right answer, but a strong response covers: async/await is syntactic sugar over Promises — the underlying mechanism is identical. A rewrite changes readability, not behaviour. The main benefits are: easier to read top-to-bottom, easier to add intermediate steps (e.g. checking `response.ok`), and standard `try/catch` for error handling. The main caveat: async/await requires wrapping in a function, and `.catch()` on a Promise chain is still useful at the top level or with `Promise.all`. A good answer acknowledges both styles are valid and explains when one is preferable.
