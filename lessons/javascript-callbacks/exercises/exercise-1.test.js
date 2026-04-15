const { test } = require("node:test");
const assert = require("node:assert");

// Import the function under test.
// Students: make sure your exercise-1.js exports playSong like this:
//   module.exports = { playSong };
const { playSong } = require("./exercise-1.js");

test("playSong calls the callback with the song title", () => {
  let received = null;

  playSong("Blue (Da Ba Dee)", function (title) {
    received = title;
  });

  assert.strictEqual(received, "Blue (Da Ba Dee)");
});

test("playSong calls the callback exactly once", () => {
  let callCount = 0;

  playSong("Sandstorm", function () {
    callCount++;
  });

  assert.strictEqual(callCount, 1);
});

test("playSong works with different song titles", () => {
  const songs = ["Bohemian Rhapsody", "One More Time", "Lose Yourself"];

  songs.forEach(function (song) {
    let received = null;
    playSong(song, function (title) {
      received = title;
    });
    assert.strictEqual(received, song);
  });
});
