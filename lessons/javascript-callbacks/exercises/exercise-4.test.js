const { test } = require("node:test");
const assert = require("node:assert");

// Students: make sure your exercise-4.js exports loadPlaylist like this:
//   module.exports = { loadPlaylist };
const { loadPlaylist } = require("./exercise-4.js");

test("loadPlaylist calls callback with songs for a valid playlist", () => {
  let result = null;
  let err = null;

  loadPlaylist("chill", function (error, songs) {
    err = error;
    result = songs;
  });

  assert.strictEqual(err, null);
  assert.ok(Array.isArray(result), "songs should be an array");
  assert.ok(result.length > 0, "songs array should not be empty");
});

test("loadPlaylist calls callback with an error for an unknown playlist", () => {
  let result = null;
  let err = null;

  loadPlaylist("jazz-fusion-2099", function (error, songs) {
    err = error;
    result = songs;
  });

  assert.ok(err instanceof Error, "should receive an Error object");
  assert.strictEqual(result, null);
});

test("loadPlaylist works for the workout playlist", () => {
  let result = null;

  loadPlaylist("workout", function (error, songs) {
    result = songs;
  });

  assert.ok(Array.isArray(result));
  assert.ok(result.length > 0);
});
