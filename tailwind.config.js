/**
 * Mirror of src/styles/tokens.css. Every value points at a custom property —
 * no hex literals live here or in any component.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: 'var(--charcoal)',
        'charcoal-2': 'var(--charcoal-2)',
        'charcoal-12': 'var(--charcoal-12)',
        caramel: 'var(--caramel)',
        'caramel-2': 'var(--caramel-2)',
        accent: 'var(--accent)',
        'accent-bright': 'var(--accent-bright)',
        amber: 'var(--amber)',
        'amber-ink': 'var(--amber-ink)',
        sand: 'var(--sand)',
        milk: 'var(--milk)',
        ink: 'var(--ink)',
        danger: 'var(--danger)',
        'ink-70': 'var(--ink-70)',
        'ink-muted': 'var(--ink-muted)',
        'ink-12': 'var(--ink-12)',
        'milk-70': 'var(--milk-70)',
        'milk-40': 'var(--milk-40)',
        'milk-14': 'var(--milk-14)',
        neutral: 'var(--neutral)',
        'neutral-strong': 'var(--neutral-strong)',
        // Set per page and per featured drink via [data-feature].
        feature: 'var(--feature)',
        'feature-soft': 'var(--feature-soft)',
        'feature-deep': 'var(--feature-deep)',
        'feature-fill': 'var(--feature-fill)',
        'feature-hero': 'var(--feature-hero)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
      borderWidth: {
        // Named `line`, not a colour name — `border-ink` would collide with the
        // ink colour utility and silently drop the width.
        line: '1.5px',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        lg2: 'var(--radius-lg)',
        xl2: 'var(--radius-xl)',
      },
      boxShadow: {
        lift: 'var(--lift)',
        card: 'var(--lift-card)',
        deck: 'var(--lift-deck)',
      },
      maxWidth: {
        shell: 'var(--shell)',
        measure: '62ch',
      },
      fontSize: {
        util: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.12em' }],
      },
    },
  },
  plugins: [],
}
