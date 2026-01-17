# Contributing to urlinks

First and foremost, a massive thank you for even considering contributing to urlinks! Every contribution, no matter how small, helps make this project better for everyone. You can contribute in many ways:

*   **By code:** Help us build new features, fix bugs, and improve the existing codebase.
*   **By sharing urlinks:** Spread the word about urlinks to your friends, colleagues, and communities.
*   **By donating:** Support our efforts on [Ko-fi](https://ko-fi.com/4bs3nt) or [Github Sponsors](https://github.com/sponsors/0x4bs3nt/).

Please ensure you read and adhere to our [Code of Conduct](https://github.com/0x4bs3nt/urlinks/blob/dev/CODE_OF_CONDUCT.md). We want urlinks to be a welcoming and inclusive environment for everyone.

## Getting Started with Code Contributions

Most of the work that needs to be done on the codebase is tracked in our [GitHub Issues](https://github.com/0x4bs3nt/urlinks/issues). If you want to work on something, please check the existing issues first. If you have an idea for a new feature or improvement that isn't already listed, please open a new issue to discuss it before you start working on it. This helps prevent duplicated effort and ensures your contribution aligns with the project's goals.

## Web/Frontend Contributions

When contributing to the web/frontend, please keep the following guidelines in mind:

*   **No lint or type errors:** All code submitted must be free of linting and TypeScript errors.
*   **Package Manager:** We exclusively use [Bun](https://bun.sh/) as our package manager. Please do not use `npm`, `yarn`, or any other manager for this project.
*   **Code Checks:** Before submitting your code, ensure it passes all checks by running `bun check`.
*   **Components:** Only [Shadcn UI](https://ui.shadcn.com/) components should be used. If a specific component you need is not available in Shadcn UI, do not install any other component library. Instead, create a custom component to fulfill the requirement.

## Backend Contributions

For backend contributions, please note the following:

*   **Pre-commit Hooks:** Make sure to install the pre-commit hooks by running `pre-commit install`.
*   **Package Manager:** We use [uv](https://github.com/astral-sh/uv) as our package manager for backend dependencies.

## Commits and Pull Requests

To maintain a clean and understandable commit history, please follow these guidelines:

*   **Conventional Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format for your commit messages. This includes prefixes like `feat` (for new features), `fix` (for bug fixes), `chore` (for routine tasks), `docs` (for documentation changes), etc.
*   **Meaningful Commit Messages:** Ensure your commit messages are meaningful and clearly explain the purpose and content of the commit.
*   **Pull Request Description:** Your pull request description should include:
    *   A short summary of the work done.
    *   A list of features added, bugs fixed, or improvements made.
    *   A task list of any items that still need to be addressed within the current PR or in subsequent PRs.
*   **Small Pull Requests:** Please avoid sending overly large pull requests. Smaller, focused pull requests are much easier to review and merge. If your changes can be broken down into multiple viable, smaller PRs, that is always preferred.

## Questions?

If you have any questions or need further clarification, please don't hesitate to reach out to me on Discord (_4bs3nt) or in the #freetree-dev channel in [gnukeith's discord server](https://discord.gg/Km5p7gfj35)
