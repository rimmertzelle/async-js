# Lesson: JavaScript Callbacks

**Target audience:** HBO-ICT students with basic knowledge of JavaScript (variables, functions, conditionals, loops). No prior experience with asynchronous programming required.
**Duration:** 90 minutes
**Learning objectives (as questions):**
- Why doesn't JavaScript wait? What does it mean for code to be asynchronous?
- What is a callback, and why do we pass functions to other functions?
- How does the event loop decide what runs when?
- What is callback hell, and why does it make code hard to reason about?

---

## 1. Opening — Challenging Problem or Question

**The problem:** Show students this broken code:

```javascript
console.log("Fetching user...");
setTimeout(() => {
  const user = { name: "Fatima", role: "admin" };
}, 1000);
console.log("Welcome, " + user.name); // ReferenceError
```

Ask: *"Why does this crash? The user is being loaded — so why can't we access it?"*

Let students discuss in pairs for 2 minutes, then collect hypotheses.

> This surfaces the core misconception: that JavaScript waits line-by-line like a recipe. The crash forces students to confront that something more complex is happening.

**Follow-up framing question:** "If JavaScript can only do one thing at a time, how does a webpage ever load data and stay interactive simultaneously?"

<!-- Persona note:
- Fatima: relatable through helpdesk/web context — she's seen a site "hang" or respond out of order
- Lars: the crash is concrete and specific — gives him a tangible anchor before abstraction
- Daan: the question hints at a deeper mechanism worth investigating; invites him to think before being told
-->

---

## 2. Prior Knowledge Check

Before introducing callbacks, activate prior knowledge with three quick questions (Mentimeter poll or show of hands):

1. *"Can you pass a function as an argument to another function in JavaScript?"* (Yes / No / Unsure)
2. *"What does `setTimeout` do?"* (open short answer)
3. *"True or false: JavaScript always runs code from top to bottom, one line at a time."*

Collect responses and name the split openly:
> "Most of you said true for statement 3 — that's the intuition we're going to complicate today."

**Anticipated misconceptions by persona:**
- **Lars:** Likely thinks JavaScript is strictly sequential; has read about functions but may not have passed one as an argument yet.
- **Fatima:** May have used callbacks (e.g., `addEventListener`) without knowing the term. May think async is about speed, not ordering.
- **Daan:** Possibly knows Promises or async/await already; may underestimate how foundational callbacks are — worth naming that callbacks are the root mechanism.

<!-- Persona note: The poll format is low-stakes and fast, which suits Lars's need for safety and Fatima's preference for purpose-driven interaction. -->

---

## 3. Core Concepts

Introduce concepts in this sequence, using the event loop diagram as a visual anchor throughout.

### 3.1 — Functions as First-Class Citizens

JavaScript treats functions like any other value: you can store them in variables, pass them as arguments, and return them from other functions.

```javascript
function greet(name) {
  console.log("Hello, " + name);
}

function runTwice(fn, value) {
  fn(value);
  fn(value);
}

runTwice(greet, "Lars"); // Hello, Lars  Hello, Lars
```

> Key insight: we're passing the *function itself* — not calling it (`greet`, not `greet()`).

<!-- Persona note:
- Lars: the worked example with labelled variable names makes the mechanics traceable
- Fatima: connects to event listeners she's used before — addEventListener("click", handler) is the same pattern
- Daan: this feels obvious, but naming it "first-class" opens the door to functional programming — a conceptual hook
-->

### 3.2 — What Is a Callback?

A **callback** is a function you pass to another function, to be called *later* — usually when something has finished.

```javascript
function loadScript(src, callback) {
  let script = document.createElement("script");
  script.src = src;
  script.onload = () => callback(script);
  document.head.append(script);
}

loadScript("app.js", function(script) {
  console.log(script.src + " loaded!");
});
```

Draw the timeline on the board:
1. `loadScript` is called
2. The browser starts loading — JavaScript keeps running
3. When the file arrives, the callback fires

> "The callback is a promise you leave behind: *'when you're done, call this.'*"

### 3.3 — The Event Loop

Use a visual diagram of:
- **Call Stack** — where code runs
- **Web APIs** — where browser handles async work (timers, network)
- **Callback Queue** — where finished callbacks wait
- **Event Loop** — moves callbacks to the stack when it's empty

Trace through this code step by step:

```javascript
console.log("start");

setTimeout(function() {
  console.log("timeout");
}, 0);

console.log("end");
// Output: start → end → timeout
```

> The `0ms` timeout still runs *after* "end" — because the event loop only picks from the queue when the call stack is clear.

**Conceptual extension (for Daan / deeper thinkers):**
> "What would happen if the callback queue filled up faster than the call stack could clear? This is the basis of how servers can become unresponsive. Node.js is built entirely on this model."

<!-- Persona note:
- Lars: step-by-step trace keeps cognitive load manageable; label each arrow explicitly
- Fatima: the diagram matches the mental model she's built intuitively — validates her experience
- Daan: the extension question about server saturation opens a door to the Node.js model
-->

### 3.4 — Error-First Callbacks

A widely-used convention in Node.js:

```javascript
function readFile(path, callback) {
  // ...
  if (error) {
    callback(error, null);
  } else {
    callback(null, data);
  }
}

readFile("data.json", function(err, data) {
  if (err) {
    console.error("Failed:", err);
    return;
  }
  console.log("Got data:", data);
});
```

> First parameter = error (or `null` if none). Second = result.

### 3.5 — Callback Hell

What happens when you need several async things to happen *in order*?

```javascript
setTimeout(() => {
  console.log("Step 1");
  setTimeout(() => {
    console.log("Step 2");
    setTimeout(() => {
      console.log("Step 3");
    }, 1000);
  }, 1000);
}, 1000);
```

This is **callback hell** — also called the *Pyramid of Doom*. Problems:
- Hard to read
- Hard to handle errors at each level
- Hard to modify or extend

> "This is a structural problem, not just a style issue. Each nested level is another chance for a bug to hide."

*Preview:* Promises and async/await exist precisely to flatten this — but they're built *on top of* callbacks.

---

## 4. Application

### In-class task: "Fix the sequence"

Students are given a script that runs three steps out of order due to missing callbacks. Their task: restructure it using callbacks so the steps run in the correct sequence.

Starter code provided — intentionally broken. Students work in pairs.

**Low floor:** the broken code runs, just in the wrong order — students can experiment
**High ceiling:** extension prompt: "Can you restructure this without nesting the callbacks inside each other? What problems do you run into?"

> Teacher note: the extension is hard — students who attempt it are discovering the limitations that Promises solve. Name this explicitly during debrief: *"You've just invented the problem that Promises exist to solve."*

<!-- Persona note:
- Lars: pair work + starter code reduces open-endedness; he can trace what's broken before fixing it
- Fatima: the practical debugging context suits her; the extension rewards depth over speed
- Daan: the extension question is genuinely hard and conceptually interesting — connects to real API design
-->

---

## 5. Reflection

End the lesson with these questions (individual writing, 3–4 minutes, then optional share):

1. *"Before today, what did you think happened when JavaScript hit a `setTimeout`? How has that changed?"*
2. *"Describe callback hell in your own words — not as a code pattern, but as a problem."*
3. *"Where in your own work or experience have you encountered something that behaves asynchronously — even outside of code?"*

> The third question is deliberately open. Fatima may connect to API calls or helpdesk ticket queues. Daan may connect to event-driven systems he's built. Lars may find this harder — prompt him to think about web pages loading, or apps updating while you scroll.

---

## Sources Used

- Wes Bos — *JavaScript: The Event Loop and Callback Hell*
  https://wesbos.com/javascript/12-advanced-flow-control/66-the-event-loop-and-callback-hell
- javascript.info — *Introduction: callbacks*
  https://javascript.info/callbacks
- Ken Bain — *What the Best College Teachers Do* (via `.claude/context/educational_context.md`)
- Student persona profiles — `.claude/context/persona.md`
