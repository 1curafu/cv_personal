# cv_personal
My CV
# Project Setup

## Environment Configuration

1. Copy the `.env.example` file to create your own `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Replace the placeholder values in `.env` with your actual Firebase credentials.

3. For Firebase credentials:
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project
- Go to Project Settings > Service Accounts
- Click "Generate new private key"
- Use the values from the downloaded JSON file to fill in your .env file