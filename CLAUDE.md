# CLAUDE.md - Anti-Slop Guardrails

## Mission
- Produce production-ready code for `photos.nicogaray.com`.
- Prefer small, safe changes over broad rewrites.
- Keep visual quality high and consistent.

## Output Quality Rules
- No placeholder text (`lorem ipsum`, `TODO`, `temp`, `mock`) in final code.
- No fake data in production paths unless explicitly requested.
- No dead code, duplicate components, or unused exports.
- Do not add dependencies unless required and justified.
- Do not change unrelated files.

## Frontend Design Rules
- Prioritize clean, minimal UI (Notion/Linear-like): clear hierarchy, spacing rhythm, restrained colors.
- Reuse existing design tokens, Tailwind patterns, and shared components before creating new ones.
- Respect responsive behavior from `320px` to desktop.
- Keep motion subtle; respect `prefers-reduced-motion`.
- Maintain strong contrast and keyboard accessibility.
- For major UI redesigns, load skill `/nicogaray-design-system` first, then align with `DESIGN.md`.

## CSS/Tailwind Rules
- Prefer utility-first Tailwind; avoid large custom CSS blocks.
- Avoid `!important` unless absolutely necessary.
- Keep `z-index` intentional and documented in code comments when non-obvious.
- Do not introduce one-off spacing scales if an existing token fits.
- Verify no overflow and no layout shift on mobile.

## Engineering Workflow
1. Read relevant files first and understand current patterns.
2. Propose the smallest viable fix and implement it.
3. Run checks on touched scope.
4. Report what changed, why, and remaining risks.

## Required Verification Before Finalizing
- Run lint for touched files or project lint when practical.
- Build must pass for production-impacting changes.
- For UI tasks, verify key routes and asset loading.

## Communication Style
- Be concise and factual.
- Explain tradeoffs when there are multiple valid options.
- If blocked, state blocker, impact, and next action clearly.

