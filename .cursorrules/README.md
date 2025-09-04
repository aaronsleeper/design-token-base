# Design Token System - Cursor Rules

This project uses a comprehensive design token system with specific rules for maintaining consistency and best practices.

## Key Rules

### CSS Variables Preference
- **Always prefer CSS custom properties over SCSS variables** unless SCSS-specific functionality is required
- See `css-variables-preference.mdc` for detailed guidelines
- Use `var(--token-name)` instead of `$token-name` in CSS files
- Only use SCSS variables when functions like `darken()`, `lighten()`, `mix()`, etc. are needed

### Token Usage Guidelines
- Use semantic token names (e.g., `--color-primary-500` instead of `--blue-500`)
- Follow the established naming convention: `--category-variant-level`
- Maintain consistency across all files
- Document any custom token additions

### File Organization
- Keep all design tokens in `tokens/scss/` directory
- Use individual files for each token category
- Convert SCSS variables to CSS custom properties in `tokens.scss`
- Place demo-specific code in `demo/` directory

### Development Workflow
- Run `npm run build` to compile SCSS to CSS
- Use `npm run watch` for development with auto-compilation
- Test changes in the demo page at `index.html`
- Commit changes with descriptive messages

## Quick Reference

### Available Scripts
- `npm run build` - Compile SCSS to CSS
- `npm run watch` - Watch for changes and auto-compile
- `npm run dev` - Start development server with auto-compilation
- `npm run serve` - Start HTTP server only

### Token Categories
- Colors: `--color-*`
- Typography: `--font-*`, `--text-*`
- Spacing: `--spacing-*`
- Shadows: `--shadow-*`
- Borders: `--border-*`
- Breakpoints: `--breakpoint-*`
- Z-Index: `--z-index-*`
