# Security Policy

## Reporting a Vulnerability

The NightChill team takes security seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please do NOT create public GitHub issues for security vulnerabilities.**

Instead, please email security@nightchill.app with:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fixes (if any)

You should receive a response within 48 hours. If the issue is confirmed, we will:

1. Work on a fix
2. Release a security update
3. Credit you in the security advisory (if desired)

### What to Expect

- **Response Time:** Within 48 hours
- **Fix Timeline:** Critical issues within 7 days, others within 30 days
- **Communication:** We'll keep you updated on progress
- **Disclosure:** Public disclosure after fix is deployed (coordinated with you)

## Security Best Practices

### For Users

1. **Strong Passwords:** Use unique, strong passwords for your account
2. **Two-Factor Authentication:** Enable 2FA when available
3. **Official Apps Only:** Download NightChill only from official sources
4. **Keep Updated:** Update to the latest version of the app
5. **Secure Devices:** Use device lock screens and encryption
6. **Beware of Phishing:** NightChill will never ask for your password via email

### For Developers

1. **Environment Variables:** Never commit `.env` files or secrets
2. **Dependencies:** Regularly update dependencies and check for vulnerabilities
3. **Input Validation:** Always validate and sanitize user input
4. **Authentication:** Use secure token storage and implement proper session management
5. **Data Encryption:** Encrypt sensitive data at rest and in transit
6. **SQL Injection:** Use parameterized queries
7. **XSS Protection:** Sanitize output and use Content Security Policy headers
8. **Rate Limiting:** Implement rate limiting on all endpoints
9. **Logging:** Log security-relevant events (but not sensitive data)
10. **Regular Audits:** Conduct regular security audits and penetration testing

## Known Security Considerations

### Data Privacy

NightChill handles sensitive mental wellness data. We:

- Encrypt all data in transit (TLS 1.3)
- Encrypt sensitive data at rest
- Implement strict access controls
- Follow GDPR and privacy regulations
- Never sell user data
- Provide data export and deletion options

### Authentication

- JWT tokens with secure signing
- Refresh token rotation
- OAuth2 support for third-party login
- Password hashing with bcrypt (cost factor 12+)
- Account lockout after failed login attempts
- Password reset with time-limited tokens

### QR Code Security

QR codes for rewards and check-ins:

- Are cryptographically signed
- Have time-based expiration
- Are single-use for redemptions
- Are validated server-side
- Cannot be easily forged or reused

### API Security

- Rate limiting per user and IP
- CORS configuration
- Request validation
- SQL injection prevention
- XSS protection headers
- CSRF protection for state-changing operations

## Security Updates

We will notify users of security updates through:

- In-app notifications (for critical issues)
- Email notifications (for account-related issues)
- Security advisories on GitHub
- Release notes

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Vulnerability Disclosure Policy

### Coordinated Disclosure

We follow coordinated vulnerability disclosure:

1. **Report received** → We acknowledge within 48 hours
2. **Investigation** → We verify and assess impact (1-7 days)
3. **Fix development** → We develop and test a fix (7-30 days)
4. **Deployment** → We deploy the fix to production
5. **Disclosure** → Public disclosure after users have time to update (typically 7-14 days after fix)

### Public Recognition

With your permission, we will:

- Credit you in the security advisory
- Add you to our security hall of fame
- Provide a thank-you note

We do not currently offer a bug bounty program but may consider it in the future.

## Scope

### In Scope

- API endpoints (api.nightchill.app)
- Web application (nightchill.app)
- Mobile applications (iOS/Android)
- Authentication and authorization flows
- Data storage and encryption
- QR code generation and validation

### Out of Scope

- Third-party services (Google Maps, payment processors)
- Social engineering attacks
- Physical attacks
- Denial of Service (DoS) attacks
- Issues in outdated versions

## Contact

- **Security Issues:** security@nightchill.app
- **General Inquiries:** support@nightchill.app
- **PGP Key:** Available upon request

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GDPR Compliance](https://gdpr.eu/)
- [API Security Best Practices](https://owasp.org/www-project-api-security/)

---

**Thank you for helping keep NightChill and our users safe.**
