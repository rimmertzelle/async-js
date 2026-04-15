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
