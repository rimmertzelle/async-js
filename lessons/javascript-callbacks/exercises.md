# Exercises — JavaScript Callbacks

**Format:** Individual | **Stakes:** Formative (not graded)
**Runtime:** Node.js + VS Code — no dependencies required
**Theme:** Music

Create a folder `exercises/` inside `lessons/javascript-callbacks/` and add a separate `.js` file for each exercise.

---

## During the Lesson

### Exercise 1 — Write Your First Callback

**File:** `exercises/exercise-1.js`

You are building a music player. Complete the function `playSong` so that it:

1. Accepts a song title and a callback function
2. Logs `"Playing: <title>"`
3. Calls the callback with the song title when done

Then call `playSong` with a song of your choice and a callback that logs `"Finished playing: <title>"`.

**Starter code:**

```javascript
function playSong(title, onFinished) {
  // your code here
}

// Call playSong here
```

**Run it:**

```bash
node exercises/exercise-1.js
```

**Optional — run the tests:**

A test file is provided at `exercises/exercise-1.test.js`. Run it with:

```bash
node --test exercises/exercise-1.test.js
```

*Targets: understanding that a function can be passed as an argument and called later*

---

### Exercise 2 — Predict the Output

**File:** `exercises/exercise-2.js`

Before running this code, write down (on paper or in a comment) what you think the output order will be. Then run it and compare.

```javascript
console.log("Opening app...");

setTimeout(function () {
  console.log("Playlist loaded");
}, 0);

console.log("Waiting for your playlist...");
```

**Questions to answer in a comment in the file:**

1. What did you predict?
2. What was the actual output?
3. Why does `"Playlist loaded"` appear last, even though the timeout is `0`?

**Run it:**

```bash
node exercises/exercise-2.js
```

*Targets: event loop mental model, misconception about synchronous execution*

---

### Exercise 3 — Fix the Sequence

**File:** `exercises/exercise-3.js`

A DJ set needs three songs to play in order. But the code below runs them in the wrong order. Fix it using callbacks so the songs always play as: Track 1 → Track 2 → Track 3.

**Broken starter code:**

```javascript
function playTrack(title, delay, onDone) {
  setTimeout(function () {
    console.log("Now playing: " + title);
    onDone();
  }, delay);
}

// These fire at the same time — fix this!
playTrack("Bohemian Rhapsody", 1000, function () {});
playTrack("Blue (Da Ba Dee)", 800, function () {});
playTrack("Sandstorm", 600, function () {});
```

> The delays are intentionally misleading — the point is to chain using callbacks, not to sort by delay.

**Run it:**

```bash
node exercises/exercise-3.js
```

*Targets: callback chaining, understanding that async order is not guaranteed by default*

---

## After the Lesson

### Exercise 4 — Error-First Callback

**File:** `exercises/exercise-4.js`

Complete the function `loadPlaylist` so that it:

1. Accepts a playlist name and a callback
2. If the playlist name is in the available list, calls `callback(null, songs)` with an array of song titles
3. If the playlist name is **not** found, calls `callback(new Error("Playlist not found"), null)`

Then call `loadPlaylist` twice — once with a valid name, once with an invalid one — and handle both outcomes in the callback.

**Starter code:**

```javascript
const available = {
  "chill": ["Weightless - Marconi Union", "Breathe - Pink Floyd"],
  "workout": ["Eye of the Tiger - Survivor", "Lose Yourself - Eminem"],
};

function loadPlaylist(name, callback) {
  // your code here
}

// Call it with a valid playlist name

// Call it with an invalid playlist name
```

**Run it:**

```bash
node exercises/exercise-4.js
```

**Optional — run the tests:**

```bash
node --test exercises/exercise-4.test.js
```

*Targets: error-first callback convention, defensive callback handling*

---

### Exercise 5 — Escape the Pyramid

**File:** `exercises/exercise-5.js`

The code below works — but it's a mess. A DJ set plays five tracks in sequence using nested callbacks, creating a Pyramid of Doom.

**Your task:** Refactor the code so it is flat and readable. Extract each step into a named function. The behaviour must stay identical.

**Broken (but working) starter code:**

```javascript
setTimeout(function () {
  console.log("Track 1: One More Time - Daft Punk");
  setTimeout(function () {
    console.log("Track 2: Around the World - Daft Punk");
    setTimeout(function () {
      console.log("Track 3: Get Lucky - Daft Punk");
      setTimeout(function () {
        console.log("Track 4: Harder Better Faster - Daft Punk");
        setTimeout(function () {
          console.log("Track 5: Da Funk - Daft Punk");
          console.log("Set complete.");
        }, 500);
      }, 500);
    }, 500);
  }, 500);
}, 500);
```

> You may not use Promises, async/await, or any npm packages.

**Run it:**

```bash
node exercises/exercise-5.js
```

*Targets: recognising callback hell, refactoring for readability using named functions*

---

### Exercise 6 — Reflection (Open Question)

**File:** `exercises/exercise-6.md` (write your answer here)

No code required for this one.

> "Think of a music app you use — Spotify, YouTube Music, SoundCloud, whatever. Pick one moment in that app where something loads, buffers, or responds to your action. Describe what you think is happening behind the scenes in terms of callbacks and the event loop. You don't need to be technically precise — focus on the idea."

There is no single right answer. The goal is to connect what you learned to something real.

---
