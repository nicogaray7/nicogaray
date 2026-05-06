---
version: v2-dark-bold
name: Nico Garay Portfolio Boutique - Dark + Vibrant
description: "Premium photography portfolio with dark, bold aesthetic and vibrant accent colors. The emotional tone is confident and energetic, drawing attention through strong visual contrast and carefully placed saturated colors."

colors:
  bg: "#0f0f0f"
  surface: "#1a1a1a"
  surface_elevated: "#252525"
  text_primary: "#fafaf9"
  text_secondary: "#a1a1a1"
  accent_primary: "#ff6b35"
  accent_secondary: "#00d4ff"
  muted: "#a1a1a1"

typography:
  title:
    fontFamily: "Cormorant Garamond"
    letterSpacing: "0.05em"
  body:
    fontFamily: "DM Sans"
    fontSize: "16-18px"
    lineHeight: 1.7

layout:
  structure:
    - Hero
    - A propos
    - Projets
    - Contact
  rules:
    - "Mix short text blocks with immersive full-screen visuals."
    - "Use generous spacing: minimum 80px vertical padding per section."
    - "Keep each paragraph to 4 lines maximum."

imagery:
  width: "Always full width"
  allowedRatios:
    - "4:3"
    - "16:9"

motion:
  allowed:
    - "fade-in only: opacity 0->1"
    - "subtle rise: translateY(12px)->0"
  duration: "0.8s-1s"
  easing: "ease-out"
  trigger: "on-scroll"
  once: true
  forbidden:
    - "aggressive motion"
    - "infinite loops"

contact:
  method: "Visible email only"

absoluteRules:
  forbiddenFonts:
    - Inter
    - Arial
    - Roboto
  forbiddenStyles:
    - "purple gradients"
    - "neon effects"

references:
  - "vsco.co"
  - "are.na"
  - "contemporary gallery direction"
  - "Japanese minimalism"
---

## Creative Direction

This project presents photography, video, and art to a broad audience with a bold, energetic premium feel.
The design language is dark and confident with vibrant accent colors (#ff6b35 orange-red, #00d4ff cyan) that guide attention and create hierarchy.

## Design Intent

- Confident and energetic first impression.
- Premium feel through strong contrast and carefully selected vibrant colors.
- Content-led storytelling: visuals carry the emotion, text provides short context, vibrant accents guide interaction.

## Section Blueprint

### Hero
- One immersive full-width visual (4:3 or 16:9).
- Minimal headline and one short supporting line.

### A propos
- 3 to 4 short sentences only.
- Human, grounded tone; no long biography block.

### Projets
- Curated selection with consistent image rhythm.
- Full-width media blocks and restrained captions.

### Contact
- Show a single visible email contact.
- No complex form fields.

## UI Rules

- Vertical padding per section must not go below 80px.
- Keep line length readable and never allow paragraphs longer than 4 lines.
- Use accent colors strategically for CTAs, highlights, and interactive elements.
- Maintain strong contrast: dark text on light backgrounds, light text on dark backgrounds.
- Borders: subtle white opacity on dark backgrounds, vibrant accent borders for important containers.

## Motion Rules

- Animate only on first reveal in viewport.
- Allowed motion pattern:
  - opacity from 0 to 1
  - translateY from 12px to 0
  - duration between 0.8s and 1s
  - `ease-out`
- No looping animations.
- No bouncing, scaling bursts, or high-energy transitions.

## Hard Exclusions

- Never use Inter, Arial, or Roboto.
- Never use soft pastel tones (conflicts with bold aesthetic).
- Never use low-contrast text on dark backgrounds.

## Accessibility and Quality Guardrails

- Maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text).
- Keep typography comfortable on mobile and desktop.
- Respect reduced motion preferences.
- Keep navigation and content scanning simple and uncluttered.
- Vibrant accents must not be sole indicator of state; use additional visual feedback.
