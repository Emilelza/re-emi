# 🤖 MyChatBot — Complete Setup Guide (Beginner Friendly)

---

## WHAT YOU'LL NEED
- A computer (Windows/Mac/Linux)
- Internet connection
- 30–45 minutes

---

## STEP 1 — Install Node.js (if you don't have it)

1. Go to 👉 https://nodejs.org
2. Click the big green **"LTS"** button to download
3. Run the installer — just click Next → Next → Install
4. When done, open **Terminal** (Mac) or **Command Prompt** (Windows)
5. Type this and press Enter to verify:
   ```
   node --version
   ```
   You should see something like: v20.x.x ✅

---

## STEP 2 — Get your Anthropic API Key

1. Go to 👉 https://console.anthropic.com
2. Sign up for a free account
3. Click **"API Keys"** in the left menu
4. Click **"Create Key"**
5. Copy the key — it looks like: `sk-ant-api03-xxxxx`
6. Save it somewhere safe — you only see it once!

---

## STEP 3 — Set up Supabase (free login system)

1. Go to 👉 https://supabase.com
2. Click **"Start your project"** → Sign up free
3. Click **"New Project"**
4. Fill in:
   - **Name:** mychatbot (or anything you like)
   - **Database Password:** make a strong password, save it!
   - **Region:** pick closest to you
5. Click **"Create new project"** — wait ~2 minutes for it to set up
6. When ready, click **"Settings"** (gear icon) in left sidebar
7. Click **"API"**
8. You'll see two things — copy and save both:
   - **Project URL** → looks like: `https://abcdefgh.supabase.co`
   - **anon public key** → long string starting with `eyJ...`

---

## STEP 4 — Copy the project files

1. Create a new folder on your Desktop called `mychatbot`
2. Copy ALL the files I gave you into that folder
   The structure should look like this:
   ```
   mychatbot/
   ├── app/
   │   ├── api/chat/route.js
   │   ├── auth/callback/route.js
   │   ├── chat/page.js
   │   ├── login/page.js
   │   ├── signup/page.js
   │   ├── globals.css
   │   ├── layout.js
   │   └── page.js
   ├── lib/
   │   ├── supabase-browser.js
   │   └── supabase-server.js
   ├── middleware.js
   ├── next.config.js
   ├── package.json
   └── .env.example
   ```

---

## STEP 5 — Create your secret .env.local file

1. In your `mychatbot` folder, create a new file called **`.env.local`**
   (Note: starts with a dot)
2. Open it in any text editor (Notepad, VS Code, etc.)
3. Paste this inside:
   ```
   ANTHROPIC_API_KEY=paste_your_anthropic_key_here
   NEXT_PUBLIC_SUPABASE_URL=paste_your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_supabase_anon_key_here
   ```
4. Replace each value with the real keys you copied in Steps 2 & 3
5. Save the file

⚠️ IMPORTANT: Never share this file with anyone. Never upload it to GitHub.

---

## STEP 6 — Install and Run

1. Open Terminal/Command Prompt
2. Navigate to your project folder:
   ```
   cd Desktop/mychatbot
   ```
3. Install all dependencies (only need to do this once):
   ```
   npm install
   ```
   Wait for it to finish (~1-2 minutes)

4. Start the app:
   ```
   npm run dev
   ```
5. Open your browser and go to:
   👉 http://localhost:3000

You should see the login page! 🎉

---

## STEP 7 — Create your first account

1. On the login page, click **"Sign up free"**
2. Enter your email and a password
3. Check your email for a confirmation link
4. Click the link in the email
5. You'll be redirected back and logged in automatically
6. Start chatting! 🤖

---

## STEP 8 — Deploy to Vercel (put it on the internet, free!)

1. Go to 👉 https://github.com and create a free account
2. Create a new repository called `mychatbot`
3. Upload all your project files to it
   (drag and drop in the GitHub web interface)

4. Go to 👉 https://vercel.com
5. Sign up with your GitHub account
6. Click **"New Project"**
7. Select your `mychatbot` repository
8. Click **"Environment Variables"** and add all 3 from your .env.local:
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
9. Click **"Deploy"**
10. Wait ~2 minutes — your app is now LIVE on the internet! 🌍

Vercel gives you a free URL like: `https://mychatbot-xyz.vercel.app`

---

## TROUBLESHOOTING

**"npm: command not found"**
→ Node.js didn't install properly. Try reinstalling from nodejs.org

**"Cannot find module"**
→ Run `npm install` again in the project folder

**Login not working**
→ Double check your Supabase URL and anon key in .env.local

**"API error" in chat**
→ Double check your ANTHROPIC_API_KEY in .env.local
→ Make sure you have credits at console.anthropic.com

**Email confirmation not arriving**
→ Check spam folder
→ In Supabase dashboard → Authentication → disable email confirmation for testing

---

## CUSTOMIZING YOUR BOT

To change your bot's personality, open:
`app/chat/page.js`

Find this section near the top:
```javascript
const DEFAULT_SYSTEM = `You are a helpful, friendly AI assistant...`
```

Replace the text inside the backticks with whatever personality you want!
Example for Re-Emi:
```javascript
const DEFAULT_SYSTEM = `You are Re-Emi 💗 — a warm relationship companion...`
```

---

## FILE SUMMARY (what each file does)

| File | What it does |
|------|-------------|
| `app/page.js` | Home — redirects to chat or login |
| `app/login/page.js` | Login screen |
| `app/signup/page.js` | Signup screen |
| `app/chat/page.js` | The main chat interface |
| `app/api/chat/route.js` | Backend — calls Anthropic API (KEY IS SAFE HERE) |
| `app/auth/callback/route.js` | Handles email confirmation |
| `lib/supabase-browser.js` | Supabase helper for frontend |
| `lib/supabase-server.js` | Supabase helper for backend |
| `middleware.js` | Protects /chat from logged-out users |
| `.env.local` | YOUR SECRET KEYS (never share!) |

---

Made with 💗 — good luck with your chatbot!
