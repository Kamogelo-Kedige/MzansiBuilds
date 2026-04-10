# Security

## Secure-by-Design Decisions

### 1. Authentication
Authentication is handled by Supabase Auth.  
Passwords are not stored in the application's public database tables.

### 2. Authorization
Row Level Security is enabled on all main application tables.  
Policies ensure that users can only insert, update, or delete records they own where appropriate.

### 3. Secrets Management
Sensitive keys are not committed to version control.  
Environment variables are used for configuration.

### 4. Input Handling
User input must be validated before submission.  
Examples:
- required fields cannot be empty
- invalid email format must be rejected
- comments and messages should be length-limited

### 5. Data Exposure
Only authenticated users can access platform data.  
The frontend must never expose privileged keys such as the Supabase service role key.

### 6. Risks Considered
- unauthorized data modification
- accidental secret exposure
- insecure password storage
- weak input handling
- over-permissive database access

