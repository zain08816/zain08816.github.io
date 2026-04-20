---
title: Dark Forest — interactive scenario
slug: dark-forest
summary: Static React SPA exploring the Dark Forest idea as a branching narrative—world-state meters, per-beat visuals, a path timeline, and save/resume via localStorage.
tags:
  - TypeScript
  - React
  - Vite
links:
  - label: Source
    href: https://github.com/zain08816/dark-forest
---

## Overview

**Dark Forest** is a **React + Vite + TypeScript** single-page app with no backend: `npm run build` emits static files. Story nodes live in modular narrative files; each beat can register its own visual component. Choices update meters, drive animations, and feed a **timeline** tied to your path. State can be saved and restored with **localStorage**.

## Highlights

- Branching narrative with tests (Vitest) to catch bad graph links
- Optional path map and decision hints in the UI
