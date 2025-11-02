<div align="center">

![Mermaid AI Playground](https://github.com/LeulAria/Mermaid-AI-Playground/raw/main/apps/web/public/hero-img.png)

# Mermaid AI Playground

**Transform your ideas into stunning diagrams with AI-powered Mermaid diagram generation.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-000?style=flat)](https://tanstack.com/start)

</div>

---

## ✨ Features

- 🤖 **AI-Powered Generation** - Create diagrams from natural language descriptions
- 📊 **Multiple Diagram Types** - Flowcharts, sequence diagrams, class diagrams, and more
- ⚡ **Real-time Preview** - See your diagrams update as you type
- 🎨 **Modern UI** - Beautiful, intuitive interface built with shadcn/ui
- 🔒 **Authentication** - Secure user authentication with Better-Auth
- 💾 **Type-Safe APIs** - End-to-end type safety with oRPC
- 🚀 **SSR Ready** - Built on TanStack Start for optimal performance

## 🛠️ Tech Stack

- **Frontend**: React, TanStack Start, TailwindCSS, shadcn/ui
- **Backend**: TanStack Start, oRPC
- **Database**: SQLite/Turso with Prisma ORM
- **Auth**: Better-Auth
- **Language**: TypeScript
- **Build**: Turborepo, Bun

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.2.21 or later)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/LeulAria/Mermaid-AI-Playground.git
cd Mermaid-AI-Playground
```

2. **Install dependencies**

```bash
bun install
```

3. **Set up the database**

```bash
cd apps/web && bun db:local
cd ../..
bun db:push
```

4. **Configure environment variables**

Create a `.env` file in `apps/web` with your configuration:

```env
# Add your environment variables here
```

5. **Start the development server**

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) to view the application.

## 📁 Project Structure

```
mermaid/
├── apps/
│   └── web/              # Fullstack application
│       ├── src/          # Application source code
│       ├── public/       # Static assets
│       └── prisma/       # Database schema
├── packages/
│   ├── api/              # API layer and business logic
│   ├── auth/             # Authentication configuration
│   └── db/               # Database schema and queries
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun check-types` | Type-check all packages |
| `bun db:push` | Push schema changes to database |
| `bun db:studio` | Open Prisma Studio |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) - a modern TypeScript stack.

---

<div align="center">

Made with ❤️ by [LeulAria](https://github.com/LeulAria)

[⭐ Star this repo](https://github.com/LeulAria/Mermaid-AI-Playground) | [☕ Buy me a coffee](https://www.buymeacoffee.com/leularia)

</div>