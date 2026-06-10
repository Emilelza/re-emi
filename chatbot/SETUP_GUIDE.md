# Re-EMI — Setup Guide

## Overview

Re-EMI is an AI-powered relationship companion that helps users understand messages, analyze conversations, and receive communication suggestions through an interactive chat interface.

## Technologies Used

* Next.js
* Supabase Authentication
* Anthropic Claude API
* Vercel Deployment

## Installation

### Prerequisites

* Node.js (v18 or later)
* Anthropic API Key
* Supabase Project

### Clone the Project

```bash
git clone <repository-url>
cd re-emi
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file in the project root and add:

```env
ANTHROPIC_API_KEY=_api_key
NEXT_PUBLIC_SUPABASE_URL=_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=_supabase_anon_key
```

### Run the Application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Features

* User Authentication using Supabase
* AI-powered message analysis
* Communication and reply suggestions
* Personalized conversation assistance
* Secure API integration

## Deployment

The application can be deployed on Vercel by connecting the GitHub repository and configuring the required environment variables.

## Project Structure

```text
app/
├── api/
├── auth/
├── chat/
├── login/
├── signup/

lib/
├── supabase-browser.js
└── supabase-server.js

middleware.js
next.config.js
package.json
```
