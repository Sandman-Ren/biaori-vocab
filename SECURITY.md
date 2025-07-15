# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :x:                |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in the 中日交流标准日本语 词汇学习系统 (Japanese Vocabulary Learning System), please report it responsibly.

### How to Report

1. **GitHub Issues**: Create a security-related issue at [https://github.com/Sandman-Ren/biaori-vocab/issues](https://github.com/Sandman-Ren/biaori-vocab/issues)
2. **Email**: Send details to the maintainer (preferred for sensitive issues)
3. **Security Advisory**: Use GitHub's security advisory feature for coordinated disclosure

### What to Include

When reporting a vulnerability, please provide:

- **Description**: Clear description of the vulnerability
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Impact Assessment**: Potential impact and affected components
- **Proof of Concept**: Code or screenshots demonstrating the issue
- **Suggested Fix**: If you have ideas for fixing the vulnerability
- **Environment**: Browser, OS, and version information

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Progress Updates**: Every 7 days during investigation
- **Resolution**: Target 30 days for critical issues, 90 days for others

## Security Scope

### In Scope

This application is a static site with client-side functionality. Security concerns include:

- **Cross-Site Scripting (XSS)**: Prevention in user-generated content
- **Content Security Policy**: Implementation and enforcement
- **Data Validation**: Input sanitization and validation
- **Privacy Protection**: User data handling and storage
- **Accessibility**: Ensuring secure accessibility features
- **Dependencies**: Third-party package vulnerabilities
- **Build Security**: Secure build and deployment processes

### Out of Scope

The following are outside our security scope:

- **Browser Vulnerabilities**: Issues specific to browser implementations
- **Network Infrastructure**: CDN, hosting provider, or network issues
- **Social Engineering**: Phishing or social manipulation attacks
- **Physical Security**: Device or physical access security
- **Third-party Services**: External service vulnerabilities (report to respective maintainers)

## Security Measures

### Current Protections

1. **Content Security Policy (CSP)**
   - Strict CSP headers to prevent XSS
   - Restricted script sources and inline scripts
   - Safe evaluation of dynamic content

2. **Input Validation**
   - Client-side input sanitization
   - Safe handling of user-provided data
   - Proper encoding of output

3. **Dependency Management**
   - Regular dependency updates
   - Automated vulnerability scanning
   - Minimal dependency footprint

4. **Build Security**
   - Secure build pipeline
   - Static analysis tools
   - Automated security testing

5. **Data Protection**
   - Local storage only (no server-side data)
   - No sensitive data collection
   - Privacy-by-design architecture

### Privacy Considerations

- **No User Accounts**: No personal information collection
- **Local Storage**: All user preferences stored locally
- **No Tracking**: No analytics or tracking cookies
- **Open Source**: Full transparency of codebase
- **Static Site**: No server-side data processing

## Best Practices for Users

### For End Users

1. **Keep Browser Updated**: Use the latest browser versions
2. **Secure Environment**: Use the application on trusted devices
3. **Data Backup**: Export bookmarks and preferences regularly
4. **Report Issues**: Report any suspicious behavior immediately

### For Developers

1. **Code Review**: All changes undergo security review
2. **Dependency Updates**: Regular updates with security patches
3. **Testing**: Comprehensive security testing before releases
4. **Documentation**: Keep security documentation current

## Incident Response

### In Case of Security Incident

1. **Immediate Response**
   - Assess the severity and scope
   - Implement temporary mitigations if possible
   - Notify users if data exposure is possible

2. **Investigation**
   - Detailed analysis of the vulnerability
   - Identify root cause and affected systems
   - Develop comprehensive fix

3. **Resolution**
   - Implement and test the fix
   - Deploy the patch as quickly as possible
   - Verify the fix resolves the issue

4. **Communication**
   - Public disclosure after fix is deployed
   - Credit security researchers (if desired)
   - Post-mortem analysis and lessons learned

## Security Updates

### Notification Channels

- **GitHub Releases**: All security updates announced
- **GitHub Security Advisories**: For critical vulnerabilities
- **README Updates**: Security-related changes documented
- **Changelog**: Detailed security fix information

### Update Recommendations

- **Automatic Updates**: Enable automatic updates if using package managers
- **Regular Checks**: Check for updates monthly
- **Security Patches**: Apply security patches immediately
- **Testing**: Test updates in development environment first

## Recognition

We appreciate security researchers and users who help improve our security:

### Hall of Fame

*Currently no security vulnerabilities have been reported.*

### Recognition Policy

- **Public Recognition**: Security researchers credited in releases (if desired)
- **Responsible Disclosure**: Coordinated disclosure timeline respected
- **Communication**: Clear communication throughout the process

## Contact Information

- **Project Maintainer**: Sandman-Ren
- **GitHub Repository**: [https://github.com/Sandman-Ren/biaori-vocab](https://github.com/Sandman-Ren/biaori-vocab)
- **Security Issues**: [https://github.com/Sandman-Ren/biaori-vocab/issues](https://github.com/Sandman-Ren/biaori-vocab/issues)
- **Security Advisories**: [https://github.com/Sandman-Ren/biaori-vocab/security/advisories](https://github.com/Sandman-Ren/biaori-vocab/security/advisories)

## Resources

- **OWASP**: [https://owasp.org/](https://owasp.org/)
- **CVE Database**: [https://cve.mitre.org/](https://cve.mitre.org/)
- **GitHub Security**: [https://docs.github.com/en/code-security](https://docs.github.com/en/code-security)
- **Web Security**: [https://web.dev/security/](https://web.dev/security/)

---

*This security policy is reviewed and updated regularly. Last updated: January 15, 2025*
