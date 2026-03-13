# Synaptiv Admin App

A standalone React + TypeScript + TailwindCSS admin dashboard for managing Synaptiv Learning course batches.

## Quick Start

```bash
cd admin-app
npm install
npm run dev
```

Opens at http://localhost:5173

**Default password:** `admin2025`

## Features

- Password-protected admin login (sessionStorage-based)
- Course batch management: create, edit, delete
- Stat cards: total batches, upcoming, estimated revenue
- Search and filter by program
- Export to CSV
- Seed data auto-loads on first run (3 sample batches)
- localStorage mock service (mirrors Amplify API shape)

## Project Structure

```
admin-app/
├── src/
│   ├── types/index.ts              # CourseBatch + CourseBatchInput types
│   ├── services/courseService.ts   # localStorage mock CRUD service
│   ├── admin/courses/
│   │   ├── CoursesPage.tsx         # Main page with stats, filters, table
│   │   ├── CourseTable.tsx         # Table with edit/delete actions
│   │   ├── CourseForm.tsx          # Shared form with validation
│   │   ├── AddCourseModal.tsx      # Create modal
│   │   └── EditCourseModal.tsx     # Edit modal
│   ├── App.tsx                     # Auth gate + layout
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Tailwind directives + utility classes
├── amplify/data/resource.ts        # Amplify Gen2 schema (for future use)
└── README.md
```

## Connect to AWS Amplify (optional)

1. `npm install aws-amplify @aws-amplify/ui-react`
2. `npx amplify init`
3. `npx amplify add auth` (Cognito User Pools)
4. `npx amplify add api` (GraphQL)
5. Replace `src/services/courseService.ts` with real Amplify DataStore/API calls
6. `npx amplify push`

The `amplify/data/resource.ts` file contains the ready-to-use Amplify Gen2 schema.
