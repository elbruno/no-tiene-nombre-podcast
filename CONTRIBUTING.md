# Contributing to notienenombre.com

Thank you for your interest in contributing to notienenombre.com! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.17.0 or higher (see [.nvmrc](.nvmrc))
- **npm**: Version 9.0.0 or higher
- **Git**: For version control
- **Modern Browser**: For testing (Chrome, Firefox, Safari, Edge)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/no-tiene-nombre-podc.git
   cd no-tiene-nombre-podc
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright (for screenshots)**
   ```bash
   npm run screenshots:install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Visit Development Site**
   Open http://localhost:5173 in your browser

## 🛠 Development Workflow

### Branch Naming

Use descriptive branch names following this pattern:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Commit Messages

Follow [Conventional Commits](https://conventionalcommits.org/) specification:

```
type(scope): description

Examples:
feat(player): add skip silence functionality
fix(rss): handle malformed episode data
docs(readme): update installation instructions
style(components): improve button accessibility
refactor(hooks): optimize useEpisodes performance
test(screenshots): add mobile navigation tests
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, readable code
   - Follow existing code style and conventions
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Locally**
   ```bash
   npm run build        # Verify build works
   npm run lint         # Check code quality
   npm run screenshots  # Generate updated screenshots
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use the provided PR template
   - Include description of changes
   - Add screenshots for UI changes
   - Link related issues

6. **Code Review**
   - Address feedback promptly
   - Update documentation if needed
   - Ensure CI/CD passes

## 📋 Contribution Guidelines

### Code Style

- **TypeScript**: Use strict TypeScript configuration
- **React**: Follow React best practices and hooks patterns
- **CSS**: Use Tailwind CSS utilities, avoid custom CSS when possible
- **Imports**: Use absolute imports from `src/` directory
- **Naming**: Use descriptive names for variables, functions, and components

### Testing

- **Unit Tests**: Add tests for utility functions and hooks
- **Component Tests**: Test React components with user interactions
- **E2E Tests**: Add Playwright tests for critical user flows
- **Visual Tests**: Update screenshots when UI changes are made

### Performance

- **Bundle Size**: Keep bundle size minimal, check with `npm run analyze`
- **Lighthouse**: Maintain 95+ performance score
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Core Web Vitals**: Optimize for Google's performance metrics

### Documentation

- **Code Comments**: Add comments for complex logic
- **Component Props**: Document component interfaces
- **README Updates**: Update README for new features
- **Architecture**: Update ARCHITECTURE.md for structural changes

## 🎯 Types of Contributions

### 🐛 Bug Reports

When reporting bugs, please include:

- **Environment**: Browser, OS, Node.js version
- **Steps to Reproduce**: Clear steps to reproduce the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: Visual evidence if applicable
- **Console Errors**: Any JavaScript errors or warnings

### ✨ Feature Requests

For new features, please provide:

- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: How should this work?
- **Alternatives**: Other solutions you've considered
- **User Stories**: Who benefits and how?
- **Technical Considerations**: Implementation complexity

### 📚 Documentation

Documentation improvements are always welcome:

- **Clarity**: Make instructions clearer
- **Completeness**: Fill in missing information
- **Examples**: Add code examples and use cases
- **Screenshots**: Update visual documentation

### 🔧 Code Contributions

Code contributions should:

- **Solve Real Problems**: Address actual user needs
- **Follow Standards**: Match existing code style and patterns
- **Include Tests**: Cover new functionality with tests
- **Maintain Performance**: Not degrade site performance
- **Be Accessible**: Support all users including those with disabilities

## 🚫 What We Don't Accept

- **Breaking Changes**: Without clear migration path and major version bump
- **Large Refactors**: Without prior discussion and planning
- **Proprietary Code**: Code that cannot be open-sourced under MIT license
- **Performance Regressions**: Changes that significantly slow down the site
- **Accessibility Regressions**: Changes that reduce accessibility compliance

## 🤖 AI-Assisted Development

This project leverages AI assistance through:

- **GitHub Copilot**: Code generation and completion
- **GPT-5 with Beast-Mode**: Enhanced development assistance
- **Documentation**: AI-generated documentation improvements

When using AI assistance:
- Review all generated code carefully
- Ensure code follows project conventions
- Test thoroughly for edge cases
- Document AI-assisted contributions when significant

## 🔒 Security

- **Vulnerabilities**: Report security issues via [SECURITY.md](SECURITY.md)
- **Dependencies**: Keep dependencies updated and secure
- **Content Security**: Be mindful of XSS and other web security issues
- **Data Privacy**: Respect user privacy and data protection

## 📞 Getting Help

- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check existing documentation first
- **Code Review**: Request specific feedback in PR comments

### Maintainer Response Times

- **Security Issues**: Within 24 hours
- **Bug Reports**: Within 48 hours
- **Feature Requests**: Within 1 week
- **Pull Requests**: Within 1 week

## 🏆 Recognition

Contributors are recognized through:

- **CONTRIBUTORS.md**: List of all contributors
- **Release Notes**: Credit in changelog for significant contributions
- **GitHub**: Automatic contribution tracking
- **Social Media**: Highlighting major contributions

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 📚 Additional Resources

- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture overview
- **History**: [HISTORY.md](HISTORY.md) - Project development timeline
- **Roadmap**: [ROADMAP.md](ROADMAP.md) - Future development plans
- **Security**: [SECURITY.md](SECURITY.md) - Security policies and reporting

---

**Thank you for contributing to notienenombre.com!** 🎉

Your contributions help make this the fastest, most accessible podcast website possible.