# Contributing to ACN Node

We're excited that you're interested in contributing to the ACN Node platform! This document provides guidelines for contributing to this revolutionary AI platform with advanced memory optimization and graph intelligence.

## 🎯 **Project Vision**

ACN Node aims to create the most advanced AI platform combining:
- **Intelligent File Management** with auto-accept operations
- **Professional Graph Visualization** for learning transparency
- **Modular MCP Architecture** for maximum flexibility
- **Real-time Learning** with advanced memory optimization

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+
- Python 3.9+
- Angular CLI 16+
- MongoDB 6.0+
- Git

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/your-username/acn-node.git
cd acn-node
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set up Development Environment**
```bash
# Copy environment template
cp .env.example .env

# Start development servers
npm run dev
```

4. **Verify Setup**
- Frontend: http://localhost:4200
- Backend: http://localhost:8000
- Filesystem MCP: http://localhost:5001

## 📁 **Project Structure**

```
acn-node/
├── frontend/           # Angular + PrimeNG UI
├── backend/           # FastAPI server
├── mcp-servers/       # 9 specialized MCP servers
├── docs/             # Documentation
├── tests/            # Test suites
└── docker/           # Container configuration
```

## 🔧 **Development Workflow**

### **Branch Naming Convention**
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### **Commit Message Format**
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(mcp): add filesystem auto-organization
fix(ui): resolve graph rendering performance issue
docs(readme): update installation instructions
```

**Types:**
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance

**Scopes:**
- `frontend` - Angular UI
- `backend` - FastAPI server
- `mcp` - MCP servers
- `filesystem` - File management
- `graph` - Visualization
- `ui` - User interface
- `api` - API changes

## 🧪 **Testing**

### **Running Tests**
```bash
# All tests
npm run test

# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend

# MCP server tests
npm run test:mcp

# E2E tests
npm run test:e2e
```

### **Test Requirements**
- All new features must include tests
- Maintain minimum 80% code coverage
- Include both unit and integration tests
- Add E2E tests for critical user flows

### **Test Structure**
```
tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── e2e/              # End-to-end tests
└── fixtures/         # Test data
```

## 🔌 **MCP Server Development**

### **Creating a New MCP Server**

1. **Create Server Directory**
```bash
mkdir mcp-servers/new-server
cd mcp-servers/new-server
```

2. **Use Server Template**
```bash
npm init -y
# Copy from existing server template
```

3. **Implement Required Interface**
```typescript
interface NewServerMCP {
  capabilities: {
    // Define your server capabilities
  };
  config: {
    // Server configuration
  };
}
```

4. **Add to Main Configuration**
Update `package.json` scripts and docker-compose.yml

### **MCP Server Guidelines**
- Each server should have a single responsibility
- Use WebSocket for real-time communication
- Implement proper error handling
- Include comprehensive logging
- Follow the MCP protocol specifications

## 🎨 **Frontend Development**

### **Angular Guidelines**
- Use Angular 16+ features
- Follow PrimeNG component patterns
- Implement responsive design
- Use TypeScript strict mode
- Follow Angular style guide

### **Component Structure**
```typescript
@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent implements OnInit {
  // Component implementation
}
```

### **Styling Guidelines**
- Use PrimeNG theme system
- Follow professional dark theme
- Ensure responsive design
- Use CSS Grid and Flexbox
- Maintain accessibility standards

## 🔧 **Backend Development**

### **FastAPI Guidelines**
- Use async/await for all operations
- Implement proper error handling
- Use Pydantic models for validation
- Include comprehensive documentation
- Follow REST API conventions

### **API Structure**
```python
@app.post("/api/v1/endpoint")
async def endpoint(request: RequestModel) -> ResponseModel:
    # Implementation
    pass
```

## 📚 **Documentation**

### **Documentation Requirements**
- Update README.md for significant changes
- Include inline code documentation
- Add API documentation for new endpoints
- Update architecture diagrams when needed
- Include examples and usage instructions

### **Documentation Structure**
```
docs/
├── api/              # API documentation
├── architecture/     # System architecture
├── deployment/       # Deployment guides
└── user-guide/      # User documentation
```

## 🐛 **Bug Reports**

### **Bug Report Template**
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: 
- Node.js version:
- Browser (if applicable):
- Version:

## Additional Context
Any other relevant information
```

## 💡 **Feature Requests**

### **Feature Request Template**
```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed?

## Proposed Implementation
How should this feature work?

## Additional Context
Any other relevant information
```

## 🔍 **Code Review Process**

### **Review Checklist**
- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

### **Review Guidelines**
- Be constructive and respectful
- Focus on code quality and maintainability
- Suggest improvements, don't just point out problems
- Test the changes locally when possible

## 🚀 **Release Process**

### **Version Numbering**
We follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes

### **Release Checklist**
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Docker images built
- [ ] Release notes prepared

## 🤝 **Community Guidelines**

### **Code of Conduct**
- Be respectful and inclusive
- Focus on technical discussions
- Help others learn and grow
- Give constructive feedback

### **Communication Channels**
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Requests**: Code contributions

## 🎖️ **Recognition**

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📞 **Getting Help**

If you need help:
1. Check existing documentation
2. Search GitHub issues
3. Ask in GitHub Discussions
4. Contact maintainers

## 🙏 **Thank You**

Thank you for contributing to ACN Node! Your contributions help make this revolutionary AI platform better for everyone.

---

**Happy coding! 🚀**