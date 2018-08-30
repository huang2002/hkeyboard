# hkeyboard

A keyboard lib.

# Usage

```js
// Use as an ES module:
import * as HKB from "hkeyboard";
// or a UMD module:
const HKB = window.HKB;

// Create a keyboard:
const keyboard = new HKB.Keyboard({
    // Automatic listening options:
    target: window,
    options: {},
    // Other options...
});

// Subscribe to shortcuts:
keyboard.on('Esc', () => {
    // ...
}).on('Control+D', () => {
    // ...
}).on('ctrl+shift+l', () => {
    // ...
}).on('ctrl+shift+alt+left', () => {
    // ...
}).on('ctrl+c alt+d', () => {
    // ...
});

// Start listening manually:
keyboard.listenOn(window);
```

# APIs

Please read the declaration files in `typings` folder or the source files in `src` folder to learn the APIs.

# Changelog

See [CHANGELOG.md](CHANGELOG.md)
