# Quiz — Async JavaScript: Promises

*Use these questions to check your understanding. There are no grades — just honest self-reflection.*

---

## Q1 — States of a Promise
**Type:** Recall
**Question:** A Promise starts in the `pending` state. What are the two states it can move to, and can it move back to `pending` after settling?
**Self-check:** A Promise can become `fulfilled` (resolved with a value) or `rejected` (failed with an error). Once settled, it cannot change state — a Promise settles exactly once, permanently.

---

## Q2 — Reading the Weather
**Type:** Application
**Question:** You write this code to fetch the temperature in Rotterdam:

```javascript
fetch("https://api.open-meteo.com/v1/forecast?latitude=51.92&longitude=4.48&current=temperature_2m")
  .then(response => response.json())
  .then(data => console.log(data.current.temperature_2m));
```

Your colleague says: *"Just combine those two `.then()` calls into one — it's cleaner."* They rewrite it as:

```javascript
fetch("https://api.open-meteo.com/v1/forecast?latitude=51.92&longitude=4.48&current=temperature_2m")
  .then(response => {
    const data = response.json();
    console.log(data.current.temperature_2m);
  });
```

Does their version work? Why or why not?

**Self-check:** No — it breaks. `response.json()` returns a Promise, not the parsed data. Without `return`-ing it and waiting in a second `.then()`, `data` is a pending Promise object, and `data.current` is `undefined`. The two-step chain exists for a reason: parsing is itself asynchronous.

---

## Q3 — Where Does the Error Go?
**Type:** Conceptual
**Question:** Consider this chain:

```javascript
fetch(url)
  .then(response => response.json())
  .then(data => {
    throw new Error("Something went wrong in processing");
  })
  .then(result => console.log("Done:", result))
  .catch(error => console.log("Caught:", error.message));
```

Which `.then()` handlers run? What does `.catch()` receive? Why does the third `.then()` not run?

**Self-check:** The first two `.then()` handlers run (parsing succeeds). The third `.then()` is skipped because the second one threw an error — the chain short-circuits to the nearest `.catch()`. `.catch()` receives the `Error` with message `"Something went wrong in processing"`. This is the same behaviour as a `try/catch` block: once an error is thrown, execution jumps to the handler, skipping intermediate steps.

---

## Q4 — A Different Kind of Async
**Type:** Transfer
**Question:** A teammate is building a chat app. They want to load a user's profile from an API, then load that user's message history, and only then display the chat. They ask you: *"Should I use Promises for this? Or is there a situation where I wouldn't?"*

What would you tell them — and can you think of an example in a weather app or another context where Promises would NOT be the right tool?

**Self-check:** There is no single correct answer. A strong response recognises that Promises are well-suited for one-off async operations (load profile → load history → display). But Promises settle once — they are not designed for ongoing streams of events. For example: a weather app that updates the temperature every 10 seconds via a WebSocket, or a live typing indicator in a chat app, would use event listeners or streams instead. Promises represent a *single future value*, not a continuous flow.
