---
name: create-lesson
description: Start the full lesson creation workflow (8 steps)
disable-model-invocation: true
argument-hint: "[topic] (optional)"
---

Start the lesson creation workflow defined in CLAUDE.md. Follow all 8 steps in order:

1. Ask for the topic (skip if $ARGUMENTS is provided — use it as the topic)
2. Ask for sources
3. Create the lesson plan (`lesson.md`), reading `.claude/context/persona.md` and `.claude/context/educational_context.md` first
4. Ask for exercise context
5. Create exercises (`exercises.md`) and model answers (`answers.md`)
6. Create quiz questions (`quiz.md`), persona-aware
7. Create MARP slides (`slides.md`) and render to PDF
8. Create student notes template (`notes-template.md`)

Wait for user approval after Step 3 before continuing. Confirm completion after Step 8.
