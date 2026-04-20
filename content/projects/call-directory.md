---
title: Call/SMS Directory
slug: call-directory
summary: Twilio-powered directory — call or text one number to reach a menu of contacts; voice calls bridge and SMS relays bidirectionally.
tags:
  - Python
  - Twilio
links:
  - label: Source
    href: https://github.com/zain08816/call-directory
---

## Overview

**Call/SMS Directory** is a small **Python** service that connects to **Twilio**. Callers and texters interact with a single Twilio number; the app routes **voice** to the chosen contact and **SMS** between you and that contact. Only phone numbers on an allowlist can use the system.

## Highlights

- Webhooks for voice and SMS; contacts configured via JSON
- Environment-driven setup (Twilio credentials, allowlist, contact book)
