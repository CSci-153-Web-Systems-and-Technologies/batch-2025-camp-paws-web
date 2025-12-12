# Middleware Security Enhancements

This document describes the security features implemented in the CAMP-PAWS middleware.

## ✅ Completed Features

### 1. **Authentication & Authorization** 🔐
- Role-based access control (RBAC)
- Database-backed role verification
- Automatic redirection for unauthorized access
- Protected admin routes

### 2. **Security Headers** 🛡️
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME-type sniffing
- **Content-Security-Policy**: Controls resource loading
- **Referrer-Policy**: Controls referrer information
- **X-XSS-Protection**: Legacy XSS protection
- **Permissions-Policy**: Controls browser features

### 3. **Rate Limiting** 🚦
- **Auth routes** (`/login`, `/signup`): 10 requests per minute per IP
- **Report submissions**: 20 reports per hour per user
- Automatic retry-after headers
- IP-based and user-based limits

### 4. **Request Logging** 📝
- Security event logging
- Unauthorized access attempt tracking
- Rate limit violation logging
- Structured JSON logs for analysis

### 5. **CSRF Protection** 🔒
- Token generation for authenticated users
- Automatic validation on state-changing requests
- HTTPOnly cookies
- SameSite strict policy

### 6. **Session Timeout** ⏱️
- 30-minute inactivity timeout
- 5-minute warning before logout
- Activity detection (mouse, keyboard, scroll, touch)
- Automatic cleanup

## 📁 File Structure

```
src/
├── lib/
│   └── middleware/
│       ├── csrf.ts          # CSRF token utilities
│       ├── logger.ts        # Security logging
│       └── rate-limit.ts    # Rate limiting logic
├── hooks/
│   ├── useCSRF.ts          # Client-side CSRF hook
│   └── useSessionTimeout.ts # Session timeout hook
└── middleware.ts            # Main middleware logic
```

## 🔧 Configuration

### Rate Limits
Edit in `middleware.ts`:
- Auth routes: `maxRequests: 10, windowSeconds: 60`
- Report submissions: `maxRequests: 20, windowSeconds: 3600`

### Session Timeout
Edit in `src/hooks/useSessionTimeout.ts`:
- Timeout: `INACTIVITY_TIMEOUT = 30 * 60 * 1000` (30 min)
- Warning: `WARNING_BEFORE_LOGOUT = 5 * 60 * 1000` (5 min)

### Security Headers
Edit in `middleware.ts` under "Add security headers" section

## 📊 Monitoring

All security events are logged with:
- Timestamp
- User ID and email
- IP address
- Request path
- User agent
- Metadata

In production, integrate with logging services like:
- Sentry
- LogRocket  
- Datadog
- CloudWatch

## 🚀 Usage

### Using CSRF Token in Forms

```typescript
import { getCSRFHeaders } from '@/hooks/useCSRF';

// In your component
const headers = {
  'Content-Type': 'application/json',
  ...getCSRFHeaders(),
};

fetch('/api/endpoint', {
  method: 'POST',
  headers,
  body: JSON.stringify(data),
});
```

### Checking Logs

Security logs appear in the console with `[SECURITY]` or `[AUTH]` prefixes.

## 🔐 Security Best Practices

1. **Never commit sensitive data** (API keys, secrets)
2. **Use HTTPS in production** for all requests
3. **Regularly review logs** for suspicious activity
4. **Keep dependencies updated** to patch vulnerabilities
5. **Use environment variables** for configuration
6. **Enable database RLS policies** for data protection

## 📈 Future Enhancements

- [ ] Redis-based rate limiting for distributed systems
- [ ] IP-based geolocation restrictions
- [ ] Two-factor authentication (2FA)
- [ ] Advanced bot detection
- [ ] Webhook security for external integrations
- [ ] Audit trail for admin actions

## 🐛 Troubleshooting

### CSRF Token Issues
- Ensure cookies are enabled
- Check `SameSite` cookie policy
- Verify HTTPS in production

### Rate Limiting Too Strict
- Adjust limits in `middleware.ts`
- Consider user feedback
- Monitor false positives

### Session Timeout Too Short
- Increase `INACTIVITY_TIMEOUT`
- Add session extension UI
- Consider "Remember Me" feature

---

**Last Updated**: December 12, 2025
**Version**: 1.0.0
