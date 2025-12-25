# NightChill Design System

## Overview

The NightChill design system is built around three core principles: **calm**, **clarity**, and **compassion**. Every design decision should reduce anxiety, not create it.

## Design Philosophy

### Core Principles
1. **Calm First** — No jarring animations, harsh colors, or overwhelming layouts
2. **Clarity Always** — Clear hierarchy, readable text, intuitive navigation
3. **Compassion Throughout** — Supportive language, gentle feedback, no shame
4. **Accessibility Matters** — WCAG AA minimum, inclusive design
5. **Consistency Builds Trust** — Predictable patterns, familiar interactions

---

## Theme Modes

Users can choose between three visual modes based on their comfort level and preference.

### 1. Light Mode
**Purpose:** Clean, calm, professional daytime interface

**Color Palette:**
```css
--bg-primary: #FFFFFF;
--bg-secondary: #F5F5F5;
--bg-tertiary: #E8E8E8;

--text-primary: #1A1A1A;
--text-secondary: #4A4A4A;
--text-tertiary: #8A8A8A;

--accent-primary: #6B7FD7;
--accent-secondary: #8B9FE8;

--border: #D0D0D0;
--shadow: rgba(0, 0, 0, 0.08);

--success: #4CAF50;
--warning: #FF9800;
--error: #F44336;
--info: #2196F3;
```

### 2. Dark Mode
**Purpose:** Low anxiety, night-friendly, reduced eye strain

**Color Palette:**
```css
--bg-primary: #1A1A1A;
--bg-secondary: #2D2D2D;
--bg-tertiary: #3A3A3A;

--text-primary: #F0F0F0;
--text-secondary: #B0B0B0;
--text-tertiary: #808080;

--accent-primary: #7B8FE8;
--accent-secondary: #9BAFF8;

--border: #404040;
--shadow: rgba(0, 0, 0, 0.3);

--success: #66BB6A;
--warning: #FFA726;
--error: #EF5350;
--info: #42A5F5;
```

### 3. Neon Mode (NightChill Brand)
**Purpose:** Motivational, modern, uplifting energy with soft neon accents

**Color Palette:**
```css
/* Backgrounds */
--bg-primary: #0D0D0D;
--bg-secondary: #1E1E1E;
--bg-tertiary: #2A2A2A;

/* Text */
--text-primary: #F0F0F0;
--text-secondary: #B0B0B0;
--text-tertiary: #808080;

/* Neon Accents */
--neon-purple: #9D4EDD;      /* Primary brand color */
--neon-pink: #FF006E;        /* Secondary accent */
--neon-orange: #FB5607;      /* Warm accent */
--neon-blue: #3A86FF;        /* Cool accent */
--neon-green: #06FFA5;       /* Success/progress */

/* UI Elements */
--border: #404040;
--shadow: rgba(157, 78, 221, 0.2);  /* Soft purple glow */

/* Status Colors */
--success: #06FFA5;
--warning: #FFD60A;
--error: #FF5A5F;
--info: #3A86FF;
```

**Neon Glow Effects:**
```css
/* Subtle glow for interactive elements */
.neon-glow {
  box-shadow: 0 0 10px rgba(157, 78, 221, 0.3),
              0 0 20px rgba(157, 78, 221, 0.2);
}

/* Stronger glow for focus states */
.neon-glow-focus {
  box-shadow: 0 0 15px rgba(157, 78, 221, 0.5),
              0 0 30px rgba(157, 78, 221, 0.3);
}

/* Text glow for headlines */
.neon-text-glow {
  text-shadow: 0 0 10px rgba(157, 78, 221, 0.4);
}
```

---

## Typography

### Font Families
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
--font-display: 'Inter', sans-serif;
--font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Courier New', monospace;
```

### Type Scale
```css
/* Display (Headlines) */
--text-display-lg: 48px / 56px;   /* Line height */
--text-display-md: 36px / 44px;
--text-display-sm: 30px / 38px;

/* Headings */
--text-h1: 28px / 36px;
--text-h2: 24px / 32px;
--text-h3: 20px / 28px;
--text-h4: 18px / 26px;

/* Body */
--text-body-lg: 18px / 28px;
--text-body-md: 16px / 24px;
--text-body-sm: 14px / 20px;

/* UI */
--text-button: 16px / 24px;
--text-caption: 12px / 16px;
--text-overline: 10px / 16px;
```

### Font Weights
```css
--weight-regular: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
```

### Typography Rules
- **Body Text:** Minimum 16px, 1.5 line height
- **Contrast:** WCAG AA minimum (4.5:1 for body, 3:1 for large text)
- **Line Length:** 50-75 characters for optimal readability
- **Paragraph Spacing:** 1em between paragraphs
- **Link Styling:** Underline on hover/focus, sufficient color contrast

---

## Spacing System

Use a consistent 8px base unit for all spacing.

```css
--space-1: 4px;    /* 0.5 unit */
--space-2: 8px;    /* 1 unit */
--space-3: 12px;   /* 1.5 units */
--space-4: 16px;   /* 2 units */
--space-5: 20px;   /* 2.5 units */
--space-6: 24px;   /* 3 units */
--space-8: 32px;   /* 4 units */
--space-10: 40px;  /* 5 units */
--space-12: 48px;  /* 6 units */
--space-16: 64px;  /* 8 units */
--space-20: 80px;  /* 10 units */
--space-24: 96px;  /* 12 units */
```

**Usage:**
- **Compact spacing:** space-2, space-3 (form fields, list items)
- **Standard spacing:** space-4, space-6 (sections, cards)
- **Loose spacing:** space-8, space-12 (page sections, major separations)

---

## Layout Grid

### Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Responsive Breakpoints
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### Grid System
- **Columns:** 12-column grid
- **Gutter:** 24px (16px on mobile)
- **Margins:** 16px (mobile), 24px (tablet), 32px (desktop)

---

## Components

### Buttons

**Primary Button**
```css
.btn-primary {
  background: var(--accent-primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--accent-secondary);
  transform: translateY(-1px);
}

/* Neon Mode */
.neon .btn-primary {
  background: var(--neon-purple);
  box-shadow: 0 0 20px rgba(157, 78, 221, 0.3);
}

.neon .btn-primary:hover {
  box-shadow: 0 0 30px rgba(157, 78, 221, 0.5);
}
```

**Secondary Button**
```css
.btn-secondary {
  background: transparent;
  color: var(--accent-primary);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid var(--accent-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--accent-primary);
  color: white;
}
```

**Ghost Button**
```css
.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--bg-secondary);
}
```

**Button States:**
- **Disabled:** 50% opacity, no pointer events
- **Loading:** Spinner animation, disabled state
- **Focus:** Visible outline (accessibility)

### Cards

```css
.card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px var(--shadow);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--shadow);
}

/* Neon Mode */
.neon .card {
  border: 1px solid rgba(157, 78, 221, 0.2);
  box-shadow: 0 0 20px rgba(157, 78, 221, 0.1);
}

.neon .card:hover {
  border-color: rgba(157, 78, 221, 0.4);
  box-shadow: 0 0 30px rgba(157, 78, 221, 0.2);
}
```

### Form Inputs

```css
.input {
  background: var(--bg-primary);
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(107, 127, 215, 0.1);
}

/* Neon Mode */
.neon .input:focus {
  border-color: var(--neon-purple);
  box-shadow: 0 0 0 3px rgba(157, 78, 221, 0.2);
}
```

### Badges & Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.badge-success {
  background: var(--success);
  color: white;
}

.badge-warning {
  background: var(--warning);
  color: white;
}

/* Neon Mode */
.neon .badge {
  border: 1px solid var(--neon-purple);
  background: rgba(157, 78, 221, 0.1);
  box-shadow: 0 0 10px rgba(157, 78, 221, 0.2);
}
```

### Progress Bars

```css
.progress {
  width: 100%;
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--accent-primary);
  transition: width 0.3s ease;
}

/* Neon Mode with glow */
.neon .progress-bar {
  background: linear-gradient(90deg, var(--neon-purple), var(--neon-pink));
  box-shadow: 0 0 10px var(--neon-purple);
}
```

---

## Icons

### Icon Style
- **Line style:** 2px stroke, rounded caps
- **Size scale:** 16px, 20px, 24px, 32px, 48px
- **Color:** Inherit from parent or use --text-secondary
- **Library:** Heroicons, Feather Icons, or Lucide Icons

### Icon Usage
- **Navigation:** 24px icons
- **Buttons:** 20px icons with 8px spacing from text
- **Lists:** 20px icons
- **Map markers:** 32px icons
- **Large displays:** 48px+ icons

---

## Animations & Transitions

### Timing
```css
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
--transition-slower: 0.5s ease;
```

### Animation Principles
1. **Subtle & Calm:** No jarring movements
2. **Purposeful:** Every animation should have a reason
3. **Smooth:** Use easing functions (ease, ease-in-out)
4. **Respect Preferences:** Honor `prefers-reduced-motion`

### Common Animations

**Fade In**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease;
}
```

**Slide Up**
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 0.4s ease;
}
```

**Gentle Pulse (Neon Mode)**
```css
@keyframes gentlePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.pulse {
  animation: gentlePulse 2s ease-in-out infinite;
}
```

**Reduced Motion**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Imagery

### Photo Style
- **Grey-washed:** Desaturated, calm, not harsh
- **Subjects:** Mountains, paths, still water, calm landscapes
- **Human photos:** Supportive moments, not staged or aggressive
- **Filters:** 30-50% desaturation, slightly increased brightness

### Image Guidelines
- **Aspect ratios:** 16:9 (landscape), 1:1 (profile), 4:3 (cards)
- **Resolution:** 2x for retina displays
- **Format:** WebP with JPEG fallback
- **Lazy loading:** All images below the fold
- **Alt text:** Always include descriptive alt text

---

## Accessibility

### WCAG AA Compliance
- **Contrast ratios:** 4.5:1 minimum for text, 3:1 for large text and UI
- **Focus indicators:** Visible focus state on all interactive elements
- **Keyboard navigation:** Full keyboard support
- **Screen readers:** Semantic HTML, ARIA labels when needed
- **Color independence:** Never rely on color alone to convey information

### Interactive Elements
- **Minimum touch target:** 44x44px (iOS), 48x48px (Android)
- **Spacing:** 8px minimum between touch targets
- **Feedback:** Visual and audible feedback for all interactions

### Motion Sensitivity
- Respect `prefers-reduced-motion` media query
- Provide settings to disable animations
- Keep animations slow and gentle by default

---

## Voice & Tone

### Writing Principles
1. **Calm & Supportive:** "You showed up. That's what matters."
2. **Clear & Simple:** Short sentences, everyday language
3. **Non-Judgmental:** No shame, no pressure
4. **Hopeful:** Focus on progress, not perfection
5. **Inclusive:** Use "you", avoid jargon

### Avoid
- ❌ Aggressive language: "crush", "dominate", "destroy"
- ❌ Pressure: "you should", "you must", "don't forget"
- ❌ Comparison: "beat others", "be the best"
- ❌ Guilt: "you missed", "failed to", "didn't achieve"

### Use
- ✅ "Welcome back. One step at a time."
- ✅ "No pressure. Just presence."
- ✅ "Your pace is perfect."
- ✅ "You're building momentum."
- ✅ "That's progress."

---

## Map Design

### Map Markers
- **Coffee:** ☕ (warm brown/orange)
- **Gym:** 🏋️ (blue/purple)
- **Mentor:** 🧠 (purple)
- **Nutrition:** 🥗 (green)
- **Partner:** 🤝 (brand color)

### Map Style
- **Light Mode:** Subtle colors, clear labels
- **Dark Mode:** Dark base, muted colors, high contrast labels
- **Neon Mode:** Dark base with neon marker glows

### Anxiety Level Indicators
```css
.anxiety-low { 
  border-left: 4px solid var(--success); 
}

.anxiety-medium { 
  border-left: 4px solid var(--warning); 
}

.anxiety-high { 
  border-left: 4px solid var(--error); 
}
```

---

## Loading States

### Skeleton Screens
- Use for content-heavy pages
- Animate with subtle pulse
- Match layout of loaded content

### Spinners
- Use for quick actions
- Small (16px) for buttons
- Medium (32px) for page sections
- Large (48px) for full-page loads

### Loading Messages
- "Finding locations near you..."
- "Loading your journey..."
- "Preparing your map..."

---

## Error & Empty States

### Error Messages
```css
.error-message {
  color: var(--error);
  padding: 12px 16px;
  background: rgba(244, 67, 54, 0.1);
  border-left: 4px solid var(--error);
  border-radius: 4px;
}
```

**Tone:**
- ✅ "We couldn't find locations nearby. Try adjusting your search."
- ✅ "Something went wrong. Please try again."
- ❌ "Error 404. Request failed."

### Empty States
- Provide helpful next steps
- Use supportive language
- Offer alternatives

**Example:**
```
No check-ins yet.

Start your journey by visiting a nearby 
coffee spot or anxiety-friendly gym.

[Find Locations]
```

---

## Dark Patterns to Avoid

1. **No guilt trips** for missed days
2. **No fake urgency** ("Only 3 spots left!")
3. **No hidden costs** or surprise charges
4. **No forced social sharing**
5. **No comparison** to other users
6. **No data collection** without consent

---

## Design Checklist

Before shipping any feature:

- [ ] Works in all three theme modes
- [ ] Meets WCAG AA contrast requirements
- [ ] Fully keyboard navigable
- [ ] Screen reader tested
- [ ] Respects reduced motion preferences
- [ ] Touch targets are 44x44px minimum
- [ ] Uses calm, supportive language
- [ ] No aggressive or pressure-inducing elements
- [ ] Loading and error states designed
- [ ] Mobile and desktop tested
- [ ] Consistent with design system

---

## Resources

### Design Tools
- Figma community file (to be created)
- Color palette swatches
- Icon library
- Component library

### Code
- CSS variables file
- Tailwind config (if using Tailwind)
- Component storybook (to be built)

---

**Remember:** Every design decision should ask, "Does this reduce anxiety or create it?" Design for calm, clarity, and compassion.
