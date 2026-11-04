# Terminal Engine

Terminal Engine is the console abstraction behind Terminal Applications. Its public description should be about the console class itself, not about which apps currently consume similar ideas.

The central concept is a `BasicConsole`-style API: render code asks one object to write text, clear the screen, show or hide the cursor, measure terminal dimensions, and format output. The host can then bind those operations to Node stdout, xterm.js, a test harness, or another terminal-like surface.

## Console Class Responsibilities

The console class owns the low-level terminal surface:

- `write(text)`: emit raw text and ANSI sequences.
- `clear_screen()`: reset the visible terminal buffer.
- `show_cursor(visible)`: control cursor visibility during rendered screens.
- `getWidth()`: report the current column count for width-aware layout.
- `getHeight()`: report the current row count when vertical layout needs it.
- Color and decoration helpers: wrap text in ANSI formatting without tying render code to a browser or Node implementation.
- Text layout helpers: center, merge, wrap, crop, and safely slice strings that may include ANSI escape sequences.

That boundary lets application code focus on producing a frame, menu, prompt, or scene while the host adapter decides how bytes reach the terminal.

## Host Adapter Contract

A browser adapter should bind the console methods to xterm.js:

- `write(text)` forwards to the xterm instance.
- `clear_screen()` clears the xterm instance in the way the application expects.
- `getWidth()` and `getHeight()` return fitted terminal dimensions.
- `show_cursor(false)` keeps rendered terminal UIs from exposing a browser caret when the app is drawing full frames.

A Node adapter should bind the same methods to `process.stdout`, terminal control sequences, and terminal size APIs.

The important rule is that render code should not know which host is active. It should only depend on the console class.

## Input Boundary

Input normalization is adjacent to, but separate from, the console class. Browser key events should be converted into stable app-level strings such as:

- `enter`
- `space`
- `esc`
- `arrowup`
- `arrowdown`
- `arrowleft`
- `arrowright`

Modifier state can be passed alongside those strings when a runtime needs it.

## Resize Boundary

Resize handling should fit the host terminal first, then notify the runtime to redraw against the new dimensions. The console class remains the source of truth for width and height during rendering.

## Public Copy Guidance

Good copy:

- "Terminal Engine is a console abstraction centered on a `BasicConsole` class."
- "It provides write, clear, cursor, width, color, and layout helpers behind a host adapter."
- "Render code can target one console API while Node, xterm.js, or tests supply the concrete output surface."

Avoid:

- Naming a specific app as the definition of Terminal Engine.
- Saying Terminal Engine is already one extracted package if that packaging has not happened.
- Describing the engine as a catalog of the applications that use it.

## Route Boundary

Terminal Engine has no user-facing route in the current site. It is promoted on the home/catalog page as the core console abstraction; `/console-adventure` and `/rtsim` remain the app routes.
