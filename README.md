# GitHub QnA

GitHub QnA is an AI-powered question-answering tool for code repositories.  
It allows developers to query a repository in natural language and get contextual answers along with relevant code snippets.  
This project uses semantic search and embeddings to deliver precise results.

---

## 🚀 Features

- **Natural Language Queries** — Ask questions about your code in plain English.  
- **Semantic Search** — Uses vector embeddings to find the most relevant results.  
- **Repository Integration** — Works directly with GitHub repositories.  
- **Contextual Answers** — Combines embeddings with file contents to generate AI-powered answers.  
- **Efficient Search** — Filters results by similarity score for relevance.  
- **Team Collaboration** — Invite team members to your project and see who is part of your team.    

---

## 🛠 Tech Stack

- **Next.js** — Frontend framework  
- **Drizzle ORM** — Database abstraction  
- **pgvector** — Vector search in PostgreSQL  
- **Google Gemini API (GenAI)** — Embedding generation and AI responses  
- **Clerk** — Authentication  
- **Stripe** — Payment processing  
- **Vercel** — Deployment  

---

## ⚙️ Setup

### Prerequisites

Create a `.env` file in the root of your project with the following variables:

```env
DATABASE_URL=
OPENAI_API_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
SIGNING_SECRET=
GITHUB_ACCESS_TOKEN=
GEMINI_API_KEY=
NEXT_PUBLIC_BASE_URL=
GLADIA_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## 📦 Installation

### Clone the repository:

```bash
git clone https://github.com/chirag0785/github-qna.git
cd github-qna
```

### Install dependencies
```bash
npm install
```

### Run the development server
```bash
npm run dev
```

## 🔍 How It Works

1. **Embedding Generation**  
   When a query is submitted, GitHub QnA uses Google GenAI's `text-embedding-004` model to convert the query into a numerical vector.

2. **Vector Search**  
   This vector is compared against stored embeddings in PostgreSQL (via `pgvector`) to find the most similar files.

3. **Answer Generation**  
   The system retrieves the relevant file contents and uses AI to generate a contextual answer to the query.

4. **Invite Team Members**
   On inviting team members, we get a private link to the project, that can be shared to the team to join the project.


