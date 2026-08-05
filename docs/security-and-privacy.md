# Security and Privacy — Personal Finance OS

Public-safe security overview. No implementation details that could create attack surfaces are included.

---

## Security Model

The Personal Finance OS is a personal financial management system. Security is a first-class concern.

### Authentication

- User authentication uses Supabase Auth
- Multi-Factor Authentication (MFA/TOTP) is supported and required for sensitive operations
- Sessions use HttpOnly cookies managed server-side
- Step-up authentication (fresh TOTP verification) is required for high-impact actions

### Authorization

- All data access is enforced by Row-Level Security (RLS) policies at the PostgreSQL layer
- RLS ensures users can only access their own data
- API-level authorization checks are applied independently of database RLS

### Data Encryption

- Sensitive fields (e.g., account names, counterparty information) are encrypted at the application layer
- Encryption uses AES-256-GCM
- Encryption keys are managed outside the database

### Transport Security

- All communication uses HTTPS
- CSRF protection is enforced for write operations
- Same-origin validation is applied on sensitive API endpoints

---

## Privacy

- User financial data is never stored in logs
- Log redaction is enforced at the observability layer
- No real financial data is used in test fixtures

---

## Responsible Disclosure

This is a personal project. If you find a security issue, please contact the maintainer directly.
