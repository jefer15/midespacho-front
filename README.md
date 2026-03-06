# MiDespacho — Frontend

Angular 21 client for the MiDespacho legal case management system. Built with Server-Side Rendering (SSR), Angular Material, and TailwindCSS v4.

---

## Tech Stack

| Technology | Version |
|---|---|
| Angular | 21.2 |
| Angular Material | 21.2 |
| TailwindCSS | 4.1 |
| Angular SSR | 21.2 |
| TypeScript | 5.9 |
| Node.js | ≥ 20 |
| npm | 11.9 |

---

## Prerequisites

- Node.js `>= 20`
- npm `>= 11`

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jefer15/midespacho.git
cd midespacho/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm start
```

The app will be available at `http://localhost:4200`.

---

## Project Structure

```
src/
├── app/
│   ├── core/                        
│   │   ├── models/
│   │   │   └── case.models.ts       
│   │   └── services/
│   │       ├── case/                
│   │       └── toast/               
│   ├── features/
│   │   └── cases/
│   │       ├── pages/
│   │       │   ├── cases-list/      
│   │       │   └── case-detail/    
│   │       └── components/
│   │           ├── case-form/       
│   │           └── case-file-batch/ 
│   ├── app.component.ts             
│   ├── app.routes.ts                
│   └── app.config.ts                
├── environments/
│   ├── environment.ts               
│   └── environment.prod.ts         
└── styles.css                       
```

---

## SSR — Server-Side Rendering

This project uses `@angular/ssr` with an Express v5 server.

To build and serve the SSR bundle:

```bash
# 1. Build
npm run build

# 2. Serve
npm run serve:ssr:midespacho-front
```

The SSR server runs on port `4000` by default.

---

## Key Features

- **Case management** — list, create, edit, and delete legal cases with pagination and live search.
- **Document batches** — upload multiple files at once, each batch tagged with a title and description.
- **File listing** — view all uploaded files per batch with name, size, and MIME type.
- **Responsive UI** — table view on desktop, card view on mobile.
- **Dark theme** — cohesive dark design using Angular Material + TailwindCSS v4.
