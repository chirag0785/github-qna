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

GitHub QnA leverages AI and vector search to provide precise answers from your code repositories. Here's the workflow:

1. **Embedding Generation**  
   - When you submit a query, GitHub QnA uses Google GenAI's `text-embedding-004` model to convert your natural language query into a numerical vector.  
   - This vector represents the semantic meaning of your query in a form the system can understand.

2. **Vector Search**  
   - The generated query vector is compared against precomputed embeddings stored in PostgreSQL using `pgvector`.  
   - The system identifies the most semantically similar files and code snippets from your repository based on similarity scores.

3. **Answer Generation**  
   - Relevant file contents are retrieved and passed to the AI model.  
   - The AI generates a **contextual answer** to your query, often including **code snippets** and explanations to help you understand the solution.

4. **Invite Team Members**  
   - You can generate a **private project link** to invite team members.  
   - Team members can join using this link and collaborate on queries, access project resources, and view responses in real-time.



