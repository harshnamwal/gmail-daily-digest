# ✉️ Gmail Daily Digest

> A secure, executive-grade daily email briefing application that connects to your Gmail account with minimal read-only permissions and delivers a calm, categorized summary of your day's incoming messages.

---

## 🌟 Key Features

- **Google OAuth 2.0 with Strict Minimal Permissions:**
  - Requests exclusively `https://www.googleapis.com/auth/gmail.readonly`.
  - Zero password entry or sharing.
  - Technically impossible to send, modify, delete, or archive emails.
- **Intelligent Categorization:**
  - 💼 **Work:** Projects, agendas, client communications, PRs, roadmaps.
  - 👤 **Personal:** Friends, family, social correspondence.
  - 💳 **Bills & Finance:** Invoices, credit card statements, receipts, subscription notices.
  - ✈️ **Travel:** Flight bookings, hotel confirmations, boarding passes.
  - 🏷️ **Promotions:** Marketing, newsletters, discount deals.
  - ⚙️ **Updates & Security:** 2FA alerts, service notices, password resets.
- **Smart Priority Highlights:**
  - ⚡ **Replies Needed / Action Items:** Automatically surfaces questions and pending sign-offs.
  - ⏰ **Approaching Deadlines:** Flags due dates for bills, submissions, and tasks.
  - 📅 **Appointments & Events:** Highlights scheduled meetings, flights, and calendar invites.
- **Seamless 1-Click Direct Links:**
  - Every summary item includes an "Open in Gmail" button leading directly to the specific email (`https://mail.google.com/mail/u/0/#inbox/<message_id>`).
- **Flexible Scheduling & Delivery Controls:**
  - Pick your preferred daily briefing time (e.g., 08:00 AM) and time zone.
  - One-click Pause and Resume.
  - Category toggles (choose which categories you want to include).
  - Background worker to automatically dispatch summaries at your scheduled time.
  - Instant "Generate Summary Now" button for on-demand inbox briefings.
- **Safe Local Demo Mode:**
  - Instant 1-click exploration with realistic mock email data if Google credentials are not yet configured.
  - Peaceful empty state when there are zero new unread emails.
- **Complete Privacy & Data Sovereignty:**
  - OAuth refresh tokens encrypted at rest using **AES-256-GCM**.
  - 30-day automatic rolling retention.
  - 1-click Disconnect (revokes tokens directly with Google's OAuth servers).
  - 1-click "Delete Account & Data" (GDPR-compliant permanent purge).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Secrets
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Your `.env` contains pre-generated encryption secrets. The application automatically runs in **Safe Demo Mode** out of the box if Google credentials are not yet populated:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

ENCRYPTION_SECRET=e87b6495df025d57b102b7405239a2ffbcf3ecdae094f691b106e236529341f2
SESSION_SECRET=c082729a9871f302b1cde8264931bc109f5827361849203ba30284716a5b4c3d
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Setting up Google OAuth (For Live Gmail Integration)

To connect your real Gmail inbox, create a free OAuth 2.0 Web Application in the Google Cloud Console:

1. Visit [Google Cloud Console](https://console.cloud.google.com/) and create a new project named **Gmail Daily Digest**.
2. Go to **APIs & Services > Library**, search for **Gmail API**, and click **Enable**.
3. Go to **APIs & Services > OAuth consent screen**:
   - Choose **External** user type.
   - Enter App Name: `Gmail Daily Digest` and your support email.
   - Under **Scopes**, click **Add or Remove Scopes** and select:
     - `https://www.googleapis.com/auth/gmail.readonly`
     - `https://www.googleapis.com/auth/userinfo.email`
     - `https://www.googleapis.com/auth/userinfo.profile`
   - Under **Test Users**, add your personal Gmail address.
4. Go to **APIs & Services > Credentials > Create Credentials > OAuth Client ID**:
   - Application type: **Web application**.
   - Authorized redirect URIs:
     ```text
     http://localhost:3000/api/auth/callback
     ```
5. Copy your **Client ID** and **Client Secret** into your `.env` file:
   ```env
   GOOGLE_CLIENT_ID=your_id_here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_secret_here
   ```
6. Restart the server and click **Connect Gmail**!

---

## ⏰ Automated Scheduled Delivery Worker

To run the automated background sweep that evaluates users' scheduled delivery times and timezones every minute:

```bash
npm run worker
```

Or trigger a sweep on-demand via HTTP (e.g. from AWS EventBridge, Vercel Cron, or a system cron job):
```bash
curl http://localhost:3000/api/cron/daily-summary
```

---

## 🔒 Security Architecture

| Security Property | Implementation Details |
| :--- | :--- |
| **Authentication** | Standard Google OAuth 2.0 authorization code flow with offline consent. |
| **Passwords** | Never handled or stored. Handled entirely on Google's domain. |
| **Scopes** | Strictly `gmail.readonly` — write, update, delete, or send permissions are never requested. |
| **Token Storage** | AES-256-GCM symmetric encryption with 96-bit random IVs and authenticated tags. |
| **Data Retention** | 30-day automatic rolling window for daily digest history. |
| **Data Erasure** | 1-click complete data wipe + Google OAuth token revocation via Google API. |
| **Third-Party Ads** | Zero advertising, tracking pixels, or data brokerage. |

---

## 🧪 Production Build & Verification

```bash
npm run build
npm run start
```
