# lvlBase Web Platform

A Firebase-ready, static front-end platform built with **HTML, CSS, and Vanilla JavaScript** using an iPhone-inspired Bento + 3D glass design system.

## What this project contains

- Marketing home page (`index.html`) with Bento sections, animations, and role hub shortcuts.
- Multi-role school dashboards:
  - `school/students/dashboard.html`
  - `school/teachers/dashboard.html`
  - `school/parents/dashboard.html`
  - `school/admin/dashboard.html`
- Feature pages in `pages/`, `learning/`, `arena/`, and `ai-features/`.
- Full university role tree in `university/` for Student, Faculty, Parent, and Admin services.
- Firebase service layer in `js/firebase-config.js`.

## Structure

```text
.
├── index.html
├── pages/
│   ├── school-home.html
│   ├── privacy-policy.html
│   ├── terms-conditions.html
│   ├── cookie-policy.html
│   ├── acceptable-use.html
│   └── ...other product pages
├── school/
│   ├── students/
│   ├── teachers/
│   ├── parents/
│   └── admin/
├── university/
│   ├── student/
│   ├── faculty/
│   ├── parent/
│   └── admin/
├── services/                # legacy role pages kept for compatibility
├── css/
├── js/
└── README.md
```

## Firebase backend setup

1. Create a Firebase project.
2. Enable Authentication (Email/Password + Google if needed).
3. Create Firestore database.
4. Update `js/firebase-config.js` with real values.
5. Define Firestore security rules for each role (`student`, `teacher`, `parent`, `admin`).

## Run locally

Use any static server (recommended):

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Quality checks used in this repo

- HTML sanity checks (doctype + title presence).
- Internal link existence checks for local `href` targets.
- JS parse checks using Node syntax validation.

## Notes

- This repository is frontend-first; Firebase credentials are placeholders by default.
- Keep legal pages in `pages/` and link them from the homepage footer.
- Prefer role-first navigation: **School → Students/Teachers/Parents/Admins**.
