# Code Review Workflow

This repository uses automated code review via GitHub Actions to ensure code quality, security, and build integrity.

## Workflow Overview

The code review workflow (`code-review.yml`) automatically runs when:
- A pull request is opened or updated targeting the `main` branch
- Code is pushed directly to the `main` branch

## Review Stages

### 1. Code Quality & Build Check
This stage validates the code quality and ensures the application builds successfully:

#### Client (Frontend)
- **Dependency Installation**: Installs all client dependencies using `npm ci`
- **Prettier Format Check**: Validates code formatting against Prettier rules
- **Build Verification**: Ensures the React application builds without errors
- **Test Execution**: Runs all client-side tests (if available)

#### Server (Backend)
- **Dependency Installation**: Installs all server dependencies using `npm ci`
- **Syntax Validation**: Checks for JavaScript syntax errors
- **Dependency Audit**: Validates package.json dependencies

### 2. Security Scan
This stage identifies potential security vulnerabilities:

- **CodeQL Analysis**: Performs advanced security and quality analysis on JavaScript code
- **Dependency Audit (Client)**: Scans client dependencies for known vulnerabilities
- **Dependency Audit (Server)**: Scans server dependencies for known vulnerabilities

### 3. Docker Build Verification
This stage ensures Docker images can be built successfully:

- **Client Docker Build**: Validates the client Dockerfile
- **Server Docker Build**: Validates the server Dockerfile
- **Docker Compose Check**: Verifies docker-compose.yaml configuration

### 4. Review Summary
Provides an overall summary of all checks and reports the final status.

## Status Badges

You can add the following badge to your README.md to show the workflow status:

```markdown
![Code Review](https://github.com/LOGANBLUE1/Edtech-Deployment/actions/workflows/code-review.yml/badge.svg)
```

## Troubleshooting

### Failed Prettier Check
If the Prettier check fails, run the following to format your code:
```bash
cd client
npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"
```

### Failed Build
If the build fails, check the error logs in the GitHub Actions tab. Common issues include:
- Missing environment variables
- Dependency conflicts
- Syntax errors

### Failed Security Scan
If security vulnerabilities are detected:
1. Review the CodeQL alerts in the Security tab
2. Run `npm audit fix` in the affected directory (client or server)
3. Update vulnerable dependencies

### Failed Docker Build
If Docker builds fail:
1. Test locally with `docker build -t test ./client` or `docker build -t test ./server`
2. Ensure all required files are present and not in .dockerignore
3. Check Dockerfile syntax and paths

## Local Testing

Before pushing code, you can run these checks locally:

```bash
# Client checks
cd client
npm ci
npx prettier --check "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"
npm run build
npm test

# Server checks
cd server
npm ci
node -c index.js
npm audit

# Docker checks
docker build -t edtech-client:test ./client
docker build -t edtech-server:test ./server
docker-compose config
```

## Configuration

The workflow uses:
- **Node.js version**: 18.x
- **Runner**: ubuntu-latest
- **Permissions**: Read access to code, write access for security events

## Continuous Integration

This workflow is part of the CI/CD pipeline mentioned in the README. It ensures that:
- All code changes are reviewed automatically
- Security vulnerabilities are caught early
- Build integrity is maintained
- Code quality standards are enforced

## Future Enhancements

Potential improvements to the code review workflow:
- Add ESLint configuration and checks
- Implement code coverage reporting
- Add performance testing
- Integrate automated PR comments with review results
- Add deployment preview for approved PRs
