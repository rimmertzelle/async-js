# Quiz — JavaScript Callbacks

*Use these questions to check your understanding. There are no grades — just honest self-reflection.*

---

## Q1 — What is a callback?
**Type:** Recall
**Primarily for:** Lars

**Question:**
In your own words: what is a callback function, and why do we pass it to another function instead of just calling it immediately?

**Self-check:**
A callback is a function passed as an argument to another function, to be executed later — usually when an asynchronous operation has completed. We pass it instead of calling it immediately because we don't want it to run *now*; we want it to run *when something is done*. The receiving function decides when to call it.

---

## Q2 — Spotify presses play
**Type:** Application
**Primarily for:** Fatima

**Question:**
You are building a simple music player. When the user clicks "Play", you need to:
1. Load the audio file from a server (takes some time)
2. Start playing it once it has loaded

Write a short sketch of how you would use a callback to handle this. You don't need to write real network code — `setTimeout` to simulate the delay is fine.

**Self-check:**
```javascript
function loadAudio(url, onLoaded) {
  setTimeout(function () {        // simulates network delay
    const audio = { url: url };   // simulated audio object
    onLoaded(audio);
  }, 1000);
}

loadAudio("song.mp3", function (audio) {
  console.log("Now playing: " + audio.url);
});
```
Key ideas: the callback (`onLoaded`) is only called *after* the load completes, not before. The rest of the app can keep running while the audio loads.

---

## Q3 — Why does `0ms` still run last?
**Type:** Conceptual
**Primarily for:** Daan

**Question:**
Consider this code:

```javascript
console.log("A");
setTimeout(function() { console.log("B"); }, 0);
console.log("C");
```

The output is `A → C → B`. Why does `B` print last, even though the timeout is `0` milliseconds? What does this tell you about how JavaScript handles time?

**Self-check:**
Even a `0ms` timeout doesn't mean "run immediately" — it means "put this in the callback queue as soon as possible." But the callback queue is only processed when the call stack is *empty*. Since `console.log("C")` is still on the call stack when the timer fires, `B` has to wait. JavaScript's single-threaded nature means asynchronous callbacks always yield to synchronous code, no matter how short the delay.

---

## Q4 — Callbacks beyond code
**Type:** Transfer
**Primarily for:** All

**Question:**
The callback pattern — "do something, and when you're done, let me know" — shows up everywhere, not just in code. Describe one example from everyday life (music, work, school, anything) that follows this same pattern. Then explain: what is the "callback" in your example, and what triggers it?

**Self-check:**
There is no single right answer. Some examples:
- *Streaming music*: Spotify starts buffering a song; once enough is loaded, the player starts (the "callback" is the playback start; the trigger is enough data arriving).
- *A download notification*: your phone notifies you when a podcast episode finishes downloading — the notification is the callback.
- *A pizza oven timer*: the buzzer fires when the time is up — you registered the callback (the buzzer action) and went off to do something else.

A strong answer names both the trigger and the deferred action, and connects it to the idea that the "caller" kept doing other things while waiting.
