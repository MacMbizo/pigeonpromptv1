# PromptOps Supabase Backend Setup Guide

This guide will help you set up the Supabase backend for your PromptOps application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- The PromptOps application code

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "promptops")
5. Enter a database password (save this securely)
6. Select a region close to your users
7. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 3: Configure Environment Variables

The `.env` file in your project root should already contain:

```env
VITE_SUPABASE_URL="your-project-url-here"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_DATABASE_KEY="your-database-password"
```

Replace the placeholder values with your actual Supabase credentials.

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from your project root
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:
- `users` table (extends auth.users)
- `prompts` table for storing prompt templates
- `workflows` table for storing workflow configurations
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates
- Sample data

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Under **Site URL**, add your application URL (e.g., `http://localhost:5176`)
3. Under **Redirect URLs**, add:
   - `http://localhost:5176/**` (for development)
   - Your production URL when deploying

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:5176`

3. Try the following:
   - Sign up for a new account
   - Check your email for verification
   - Sign in with your credentials
   - Create a new prompt
   - Create a new workflow

## Features Implemented

### Authentication
- ✅ User registration with email verification
- ✅ User login/logout
- ✅ Password reset
- ✅ Protected routes
- ✅ User session management

### Prompts Management
- ✅ Create, read, update, delete prompts
- ✅ Public/private prompt visibility
- ✅ Tag system for organization
- ✅ Real-time data synchronization

### Workflows Management
- ✅ Create, read, update, delete workflows
- ✅ JSON configuration storage
- ✅ User-specific workflows
- ✅ Workflow execution framework

### Dashboard
- ✅ Real-time statistics
- ✅ Recent prompts display
- ✅ User-specific data
- ✅ Loading states
- ✅ Error handling

## Database Schema Overview

### Tables

1. **users**
   - Extends Supabase auth.users
   - Stores additional user profile information

2. **prompts**
   - Stores prompt templates
   - Supports public/private visibility
   - Includes tagging system
   - User ownership with RLS

3. **workflows**
   - Stores workflow configurations
   - JSON-based configuration
   - User ownership with RLS

### Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Public prompts are visible to all users
- Automatic user profile creation on signup

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error**
   - Check that your `.env` file has the correct variable names with `VITE_` prefix
   - Restart your development server after changing environment variables

2. **Authentication not working**
   - Verify your Site URL and Redirect URLs in Supabase dashboard
   - Check that email confirmation is working

3. **Database connection issues**
   - Ensure the database schema has been applied
   - Check that RLS policies are correctly set up

4. **Data not loading**
   - Check browser console for errors
   - Verify user is authenticated
   - Check network tab for failed API calls

### Development Tips

1. **View real-time data**: Use the Supabase dashboard's Table Editor to see data changes in real-time

2. **Monitor API calls**: Check the Supabase dashboard's API logs for debugging

3. **Test RLS policies**: Use the SQL Editor to test queries as different users

## Next Steps

1. **Customize the schema**: Add more fields to tables as needed
2. **Implement file storage**: Use Supabase Storage for file uploads
3. **Add real-time features**: Use Supabase Realtime for live collaboration
4. **Set up edge functions**: Use Supabase Edge Functions for serverless logic
5. **Configure production**: Set up production environment variables

## Support

For issues with:
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **PromptOps**: Check the application logs and console errors

---

**Congratulations!** Your PromptOps application is now connected to a real Supabase backend with authentication, data persistence, and real-time capabilities.