# The LLM Residency

Source for **The LLM Residency**: a six-month learning journal from inside a real industrial LLM training residency: building and running LLMs from zero, written down every week. Deepest treatment where most material is thinnest: inference and operations.

*Six months. Ten hours a week. No magic.*

## Stack

Deliberately small: hand-crafted static HTML + one CSS file. No framework or build step; JavaScript is limited
to progressive enhancements such as the subscribe form, copy button, and Week 0 next-token explainer. Serves
anywhere that serves files.

## Structure

| File | Purpose |
|---|---|
| `index.html` | The program: pipeline, route, full 26-week curriculum, competencies, interactives |
| `week00a.html` | Week 0 · Part A: "The Map of the Territory" |
| `styles.css` | The design system (light + dark, WCAG-validated tokens) |
| `resources.html` | The shelf: papers, books, articles, people worth following |
| `404.html` | Self-contained not-found page |
| `labs/week00_the_map.ipynb` | Week 0 lab; opens directly in Google Colab |

© 2026 The LLM Residency. Content licensed for personal learning; please link rather than mirror.
