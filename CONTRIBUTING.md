# Contributing to DMP Cemetery Management System

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to the DMP Cemetery Management System. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## 🛠️ Development Process

1.  **Fork the repo** and create your branch from `main`.
2.  **Install dependencies**: `npm install`
3.  **Make your changes**.
4.  **Test your changes**: Ensure the build passes with `npm run build`.
5.  **Commit your changes**: Use descriptive commit messages (e.g., `feat: Add new inventory filter` or `fix: Resolve login timeout issue`).
6.  **Push to your fork** and submit a Pull Request.

## 🎨 Coding Standards

### TypeScript
- Avoid using `any`. Define proper interfaces in `src/types/index.ts`.
- Ensure strict type checking is enabled.

### React Components
- Use functional components with Hooks.
- Keep components small and focused.
- Use Tailwind CSS for styling.

### Backend
- Always validate input using `express-validator` middleware.
- Use parameterized queries for all database interactions.
- Handle errors gracefully using the centralized error handler.

## 🐛 Reporting Bugs

Bugs are tracked as GitHub issues. When filing an issue, please include:
- A clear title and description.
- Steps to reproduce the bug.
- Expected vs. actual behavior.
- Screenshots if applicable.

## 💡 Feature Requests

Feature requests are welcome! Please create an issue and tag it as `enhancement`. Describe the feature in detail and why it would be useful.
