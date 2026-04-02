# Signup Form Implementation

## Overview
Complete signup form with the following fields has been created:

### Form Fields
1. **Merchant Name** - Text input for store name
2. **Merchant URL** - Text input for store URL (slug)
3. **First Name** - Text input for user's first name
4. **Last Name** - Text input for user's last name
5. **Email** - Email input with validation
6. **Password** - Password input with visibility toggle
7. **Dialing Code** - Dropdown with international phone codes (Vietnam +84 default)
8. **Phone Number** - Text input for phone number

## Project Structure

### Created Files:

#### Feature Folder: `apps/auth/src/feature/signup/`
- **models/signup.model.ts** - TypeScript interfaces for form values and API response
- **services/signup.service.ts** - Server action for handling signup API call
- **hooks/use-signup-form.ts** - Custom hook managing form state and validation
- **components/SignupForm.tsx** - Reusable form component with all input fields
- **pages/SignupPage.tsx** - Full page component with branding and form
- **index.ts** - Feature exports

#### Route: `apps/auth/src/app/signup/page.tsx`
- Main signup page route accessible at `/signup`

#### Enhanced Components:
- **packages/zap-design/src/genesis/organisms/auth/LoginForm.tsx**
  - Added `onSignUp` prop to interface
  - Added "Create New Account" button below "Authorize Access" button

- **apps/auth/src/components/auth-form.tsx**
  - Added `handleSignUp` handler function
  - Passed `onSignUp` to LoginForm component

## Features

✅ **Form Validation**
- Required field validation
- Email format validation
- Password minimum length (6 characters)
- Phone number required

✅ **UI/UX**
- Grid layout for organized field display
- Leading/trailing icons for inputs
- Error banner display
- Loading state with spinner
- Link to login page for existing accounts
- Responsive design

✅ **Dialing Codes Support**
Pre-configured country codes:
- 🇻🇳 Vietnam (+84)
- 🇺🇸 USA (+1)
- 🇬🇧 UK (+44)
- 🇯🇵 Japan (+81)
- 🇫🇷 France (+33)
- 🇨🇳 China (+86)
- 🇮🇳 India (+91)
- 🇦🇺 Australia (+61)

## Usage

### Signup Button on Login Page
Users can click the "Create New Account" button below the login form to navigate to `/signup`

### Direct URL Access
Navigate to `http://localhost:4700/signup` to access the signup form

### Form Submission
- Validates all required fields
- Sends POST request to `/api/auth/signup`
- On success: redirects to login page
- On error: displays error message

## API Integration

The signup service expects an endpoint at:
```
POST /api/auth/signup
```

Request body:
```json
{
  "merchant_name": "string",
  "merchant_url": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "password": "string",
  "dialing_code": "string",
  "phone": "string"
}
```

Expected response:
```json
{
  "success": true,
  "message": "string"
}
```

## Next Steps

1. Implement the backend API endpoint for signup
2. Add email verification flow (optional)
3. Add CAPTCHA for security (optional)
4. Customize error messages based on backend responses
5. Add password strength indicator (optional)
