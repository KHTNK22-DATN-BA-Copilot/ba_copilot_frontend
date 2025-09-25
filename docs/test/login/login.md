# Login Feature Testing Document

## 1. Testing Document Plan

### Objective
Ensure the login feature functions correctly, securely, and meets user requirements.

### Scope
- Email field
- Password field
- Login button
- Error handling and validation

### Resources
- Testers: 2 QA engineers
- Tools: Manual testing, automated test scripts (e.g., Cypress, Selenium)

### Schedule
- Test case design: 1 day
- Test execution: 2 days
- Reporting: 1 day

## 2. Testing Strategy

### Test Types

#### Functional Testing
- Verify email and password fields accept input.
- Validate login with correct credentials.
- Check error messages for invalid email format.
- Check error messages for incorrect password.
- Ensure required field validation.

#### Security Testing
- Test for SQL injection and XSS vulnerabilities.
- Ensure password is not exposed in logs or UI.
- Verify secure transmission (HTTPS).

#### Usability Testing
- Confirm clear error messages.
- Check tab order and accessibility.

#### Performance Testing
- Measure response time for login requests.

### Test Data
- Valid email/password combinations
- Invalid email formats
- Incorrect passwords
- Empty fields

### Acceptance Criteria
- Successful login with valid credentials.
- Appropriate error messages for invalid input.
- No security vulnerabilities.

---
# Login Feature Example Test Cases

## Test Case 1: Successful Login with Valid Credentials
- **Precondition:** User is on the login page.
- **Steps:**
    1. Enter a valid email (e.g., user@example.com) in the email field.
    2. Enter the correct password in the password field.
    3. Click the login button.
- **Expected Result:** User is logged in and redirected to the dashboard.

## Test Case 2: Invalid Email Format
- **Precondition:** User is on the login page.
- **Steps:**
    1. Enter an invalid email (e.g., userexample.com) in the email field.
    2. Enter any password in the password field.
    3. Click the login button.
- **Expected Result:** Error message "Invalid email format" is displayed. Login is not successful.

## Test Case 3: Incorrect Password
- **Precondition:** User is on the login page.
- **Steps:**
    1. Enter a valid email (e.g., user@example.com) in the email field.
    2. Enter an incorrect password in the password field.
    3. Click the login button.
- **Expected Result:** Error message "Incorrect password" is displayed. Login is not successful.

## Test Case 4: Empty Fields Submission
- **Precondition:** User is on the login page.
- **Steps:**
    1. Leave both email and password fields empty.
    2. Click the login button.
- **Expected Result:** Error messages "Email is required" and "Password is required" are displayed.

## Test Case 5: SQL Injection Attempt
- **Precondition:** User is on the login page.
- **Steps:**
    1. Enter `user@example.com' OR '1'='1` in the email field.
    2. Enter any password in the password field.
    3. Click the login button.
- **Expected Result:** Login is not successful. No sensitive information is exposed. Application remains secure.

---
