# Architecture

## Overview
The system uses a browser-based frontend connected directly to Supabase services.

## Components

### Frontend
- HTML for page structure
- CSS for styling
- JavaScript for client-side logic
- Supabase JavaScript client for authentication and database interaction

### Backend
- Supabase Auth for authentication
- PostgreSQL database hosted by Supabase
- Row Level Security for authorization control

## Data Flow
1. User signs up or logs in
2. Supabase Auth authenticates the user
3. Frontend receives session data
4. Frontend performs database operations through Supabase client
5. Supabase applies Row Level Security policies
6. Data is returned and rendered in the UI

## Main Modules
- auth.js
- projects.js
- comments.js
- milestones.js
- collaborations.js
- celebration.js

## Database Design
Main tables:
- profiles
- projects
- milestones
- comments
- collaborations

## Security Approach
- passwords are not stored in public tables
- public tables use Row Level Security
- users can only modify their own records where relevant
