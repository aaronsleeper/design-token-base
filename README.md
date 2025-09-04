# Design Token System

A comprehensive design token system for building consistent design systems. This system provides a foundation for creating scalable, maintainable design systems with SCSS variables and CSS custom properties.

## 🏗️ Project Structure

```
design-token-base/
├── tokens/
│   └── scss/
│       ├── _colors.scss      # Color tokens
│       ├── _typography.scss  # Typography tokens
│       ├── _spacing.scss     # Spacing tokens
│       ├── _shadows.scss     # Shadow tokens
│       ├── _borders.scss     # Border tokens
│       ├── _breakpoints.scss # Breakpoint tokens
│       ├── _z-index.scss     # Z-index tokens
│       └── tokens.scss       # Main SCSS file
├── demo/
│   ├── demo.css              # Demo-specific styles
│   └── demo.js               # Demo interactivity
├── index.html                # Demo page
├── tokens.css                # Compiled CSS output
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

1. **Compile SCSS to CSS:**
   ```bash
   npm run build
   ```

2. **Watch for changes and auto-compile:**
   ```bash
   npm run watch
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   This will start both the SCSS watcher and a local HTTP server on port 8000.

4. **Open the demo page:**
   Open `http://localhost:8000` in your browser to see the design token system in action.

## 🎨 Token Categories

### Colors
- **Primary Colors**: 50-900 scale with semantic naming
- **Secondary Colors**: Neutral grays for backgrounds and text
- **Semantic Colors**: Success, warning, error, and info states
- **Background Colors**: Primary, secondary, and tertiary backgrounds
- **Text Colors**: Primary, secondary, tertiary, and inverse text
- **Border Colors**: Primary, secondary, and focus states

### Typography
- **Font Families**: Primary (Inter), secondary (Georgia), and monospace (JetBrains Mono)
- **Font Sizes**: 10-level scale from 12px to 60px
- **Font Weights**: 9 weights from thin (100) to black (900)
- **Line Heights**: 5 levels from tight to loose
- **Letter Spacing**: 6 levels from tighter to widest

### Spacing
- **Base Scale**: 4px unit system (0.25rem)
- **Spacing Scale**: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64
- **Semantic Spacing**: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
- **Component Spacing**: Specific spacing for UI components
- **Layout Spacing**: Section-level spacing for page layouts

### Shadows
- **Box Shadows**: 6 levels from xs to 2xl
- **Colored Shadows**: Primary, success, warning, and error variants
- **Focus Shadows**: Accessibility-focused shadow states
- **Text Shadows**: 3 levels for text effects

### Borders
- **Border Radius**: 7 levels from none to full
- **Border Width**: 5 levels from 0 to 8px
- **Border Styles**: Solid, dashed, dotted, double, and none
- **Component Radius**: Specific radius values for buttons, inputs, cards, etc.

### Breakpoints
- **Responsive Breakpoints**: xs, sm, md, lg, xl, 2xl
- **Container Max Widths**: Matching container sizes for each breakpoint

### Z-Index
- **Z-Index Scale**: 0, 10, 20, 30, 40, 50
- **Semantic Z-Index**: Specific values for dropdowns, modals, tooltips, etc.

## 💻 Usage

### SCSS Variables

Use SCSS variables in your SCSS files:

```scss
@import 'tokens/scss/tokens';

.my-component {
  background-color: $color-primary-500;
  padding: $spacing-4;
  border-radius: $border-radius-md;
  box-shadow: $shadow-md;
}
```

### CSS Custom Properties

Use CSS custom properties in your CSS files or HTML:

```css
.my-component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
}
```

### Utility Classes

Use the included utility classes:

```html
<div class="text-lg font-semibold spacing-md shadow-lg border-radius-lg">
  Content with utility classes
</div>
```

## 🛠️ Customization

### Adding New Tokens

1. Add new variables to the appropriate SCSS file in `tokens/scss/`
2. Add corresponding CSS custom properties to `tokens/scss/tokens.scss`
3. Recompile with `npm run build`

### Modifying Existing Tokens

1. Update the SCSS variable in the appropriate file
2. The CSS custom property will be automatically updated when you recompile
3. Run `npm run build` to apply changes

## 📱 Demo Features

The demo page (`index.html`) showcases:

- **Color Palettes**: Interactive color swatches with click-to-copy functionality
- **Typography Scale**: All font sizes, weights, and families
- **Spacing Examples**: Visual representation of the spacing scale
- **Shadow Showcase**: All shadow levels and variants
- **Border Examples**: All border radius and width options
- **Component Examples**: Buttons, cards, and form elements using the tokens
- **Dark Mode Toggle**: Interactive theme switching
- **Responsive Design**: Mobile-friendly layout

## 🔧 Build Scripts

- `npm run build` - Compile SCSS to CSS (expanded format)
- `npm run build:compressed` - Compile SCSS to CSS (compressed format)
- `npm run watch` - Watch for SCSS changes and auto-compile
- `npm run dev` - Start development server with auto-compilation
- `npm run serve` - Start HTTP server only

## 📄 License

MIT License - feel free to use this token system in your projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📚 Resources

- [Design Tokens Community Group](https://design-tokens.github.io/community-group/)
- [Sass Documentation](https://sass-lang.com/documentation)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
