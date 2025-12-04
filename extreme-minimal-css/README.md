# extreme-minimal-css

The goal is to create a minimal css/scss file that can be used as a starting point for any project.

## Key features

- System font stack
- Normalized on modern browsers
- Supports dark mode
- `box-sizing: border-box` everywhere

## Usage

Set the color mode with the attribute `data-emc-theme` on the `html` element.

To set the dark mode, use

```html
<html lang="en" data-emc-theme="dark">
[...]
</html>
```

To set the auto mode, use

```html
<html lang="en" data-emc-theme="auto">
[...]
</html>
```

the auto mode sets the dark mode if the user has set the dark mode in the OS or browser.
