---
title: Seasonal Food Finder
slug: seasonal-foods
summary: Full-stack app that shows which foods are in season for a selected US region or state and date.
tags:
  - Python
  - FastAPI
  - React
  - TypeScript
links:
  - label: Source
    href: https://github.com/zain08816/seasonal-foods
---

## Overview

**Seasonal Food Finder** pairs a **React + TypeScript + Vite** frontend with a **Python FastAPI** backend backed by **SQLite**, **SQLAlchemy**, and seeded static JSON. Pick a region and date to see what is in season.

## Highlights

- Separate `backend/` and `frontend/` with a `./dev.sh` script to run uvicorn and Vite together
- Dockerfiles for backend and frontend; API docs available from the FastAPI app when running locally
