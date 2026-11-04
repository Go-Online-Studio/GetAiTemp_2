# GetYourAIPrompt

GetYourAIPrompt is a production-ready, full-stack web application built with **Next.js (App Router, JavaScript)**, **MongoDB Atlas (Mongoose)**, and **Cloudinary**.

The platform curates trending AI videos (generated with Sora, Veo, Kling, Runway, Midjourney, etc.) alongside the exact prompt used to create them. Visitors watch the video and opt in to watch a Google rewarded advertisement to unlock and copy the prompt.

The application is architected **mobile-first** because the primary traffic channel is direct link-clicks from Instagram DM / bio shares straight to single video pages (`/v/[slug]`).

---

## Key Features

1. **Strict UI Faithful to Custom Design**:
   - Palette: Background `#E3F2F6`, Navy `#13233F`, Teal `#08788A`, Secondary Text `#3A4A66`.
   - Typography: **Outfit** for headings and **DM Sans** for body (via `next/font/google`).
   - Clean, minimalist aesthetic with max 2px border radius, no heavy animations, no shadows, no glassmorphism, and hover underlines.

2. **Secure Video Page Prompt Flow**:
   - Prompt text is **never sent to the client browser in initial page data** (`prompt` field has `select: false` in Mongoose schema).
   - Dynamic Open Graph metadata generates rich link previews for Instagram, WhatsApp, Twitter, and iMessage.
   - User taps **"Watch ad to unlock prompt"** -> triggers Google Rewarded Ad.
   - On ad reward completion, the frontend dispatches `POST /api/unlock` with the video ID.
   - Server returns the unlocked prompt and increments the unlock count.
   - Unlock state is remembered in `localStorage` per video so page reloads do not re-lock the prompt.
   - Fallback protection: If ads fail or are blocked, the prompt can be unlocked after 2 tries so users are never stuck.

3. **AdSense Integration & Monetization**:
   - Reusable `<AdSlot position="below-video" | "below-prompt" | "between-related" | "banner" />` component.
   - Uses `IntersectionObserver` to lazy-load display ads below the fold.
   - Renders labelled placeholders during local development or when ad slot IDs are empty.
   - Maximum 3 display ads per page on mobile.
   - Opt-in rewarded ad logic isolated in `components/RewardedUnlock.jsx`.

4. **Complete Admin CMS**:
   - Secured behind JWT in `httpOnly` cookies and Next.js Edge Middleware (`middleware.js`).
   - Single admin credentials via `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` (bcrypt) or database fallback.
   - Post / Edit videos with title, slug generator, categories, tags, prompt, AI tool, duration, and status (draft / published).
   - Direct signed Cloudinary uploads for videos and thumbnails (`POST /api/admin/upload`) to bypass server payload limits.
   - Full category management.

5. **Performance & SEO**:
   - Cached Mongoose database connection (`lib/mongodb.js`).
   - Rate limiting on `/api/unlock` and `/api/contact` (`lib/rateLimit.js`).
   - Cloudinary transformations (`f_auto,q_auto,h_720`).
   - Dynamic XML Sitemap (`/sitemap.xml`) and Robots (`/robots.txt`).

---

## Getting Started Locally

### 1. Prerequisites
- Node.js 18.18+ or 20+
- A free MongoDB Atlas cluster (or local MongoDB daemon)
- A Cloudinary account (optional for local mock mode, required for video uploads)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your connection details:
```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/getyouraiprompt?retryWrites=true&w=majority

# Cloudinary (Find in Cloudinary Dashboard -> API Keys)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials
ADMIN_EMAIL=admin@getyouraiprompt.com
ADMIN_PASSWORD_HASH=$2b$10$.pQDej7/i3HxH4URXYP/PeL/edgz2y/CSx54ZSlFIxx2HGAm8rYtK
JWT_SECRET=generate_a_random_32_character_string_here

# Google AdSense (Optional in local dev)
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_BELOW_VIDEO=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_BELOW_PROMPT=0987654321

# Public Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Default Admin Credentials for Development:**
> - Email: `admin@getyouraiprompt.com`
> - Password: `admin123`
> *(The default `.env.local` contains the bcrypt hash for this password)*

To generate a new password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('YourNewPassword', 10))"
```

### 4. Seed the Database
Populate 4 categories (Cinematic, Fantasy, Product, Portrait) and 3 sample videos with locked prompts:
```bash
npm run seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
GetYourAIPrompt/
├── app/
│   ├── layout.jsx            # Root layout with Outfit & DM Sans fonts + AdSense loader
│   ├── globals.css           # Vanilla design system (strict colors, 2px radius, no shadows)
│   ├── page.jsx              # Home page: hero, how-it-works, trending grid, ad slot, footer
│   ├── sitemap.js            # Dynamic /sitemap.xml
│   ├── robots.js             # Dynamic /robots.txt
│   ├── videos/
│   │   └── page.jsx          # Explore all videos with category filter & pagination
│   ├── category/
│   │   └── [slug]/page.jsx   # Videos categorized by slug
│   ├── v/
│   │   └── [slug]/page.jsx   # Mobile-first single video page (Open Graph, video player, unlock)
│   ├── admin/
│   │   ├── page.jsx          # Admin dashboard (videos table, search, category manager)
│   │   ├── login/page.jsx    # Secure admin login
│   │   ├── new/page.jsx      # Create new video & prompt
│   │   └── edit/[id]/page.jsx# Edit video & prompt
│   ├── about/page.jsx        # About page
│   ├── privacy/page.jsx      # Privacy policy (AdSense & cookie disclosure)
│   ├── contact/page.jsx      # Contact form
│   └── api/
│       ├── videos/           # GET /api/videos (public list without prompt)
│       ├── unlock/           # POST /api/unlock (rate-limited prompt unlock + counter)
│       ├── views/            # POST /api/views (session debounced view counter)
│       ├── contact/          # POST /api/contact (stores contact message)
│       └── admin/
│           ├── login/        # POST /api/admin/login (JWT cookie)
│           ├── logout/       # POST /api/admin/logout
│           ├── me/           # GET /api/admin/me
│           ├── upload/       # POST /api/admin/upload (signed Cloudinary parameters)
│           ├── videos/       # CRUD /api/admin/videos
│           └── categories/   # CRUD /api/admin/categories
├── components/
│   ├── Header.jsx            # Standard / compact brand header
│   ├── Footer.jsx            # Brand footer
│   ├── VideoCard.jsx         # Video card with thumbnail & category
│   ├── VideoPlayer.jsx       # Lazy video player with poster-first loading
│   ├── VideoForm.jsx         # Video creation & editing form with direct upload
│   ├── AdSlot.jsx            # Lazy AdSense display unit with fallback placeholder
│   ├── UnlockPrompt.jsx      # Interactive prompt unlocker with localStorage caching
│   └── RewardedUnlock.jsx    # Google Rewarded Ad SDK handler & fallback recovery
├── lib/
│   ├── mongodb.js            # Cached Mongoose connection
│   ├── cloudinary.js         # Cloudinary configuration & upload signature helper
│   ├── auth.js               # JWT signing, verification, and cookie utilities
│   ├── rateLimit.js          # In-memory sliding window rate limiter
│   └── validations.js        # Zod validation schemas
├── models/
│   ├── Video.js              # Video model (prompt hidden with select: false, indexes)
│   ├── Category.js           # Category model
│   ├── Message.js            # Contact form inquiries
│   └── Admin.js              # Optional DB admin model
├── middleware.js             # Edge middleware protecting /admin and /api/admin
├── scripts/
│   └── seed.js               # Database seeder script
├── next.config.mjs           # Next.js configuration (remote image patterns)
└── package.json
```

---

## Google Rewarded Ads Integration

In `components/RewardedUnlock.jsx`, you will find the designated code integration block:

```javascript
// Google Publisher Tag (GPT) rewarded ad integration:
googletag.cmd.push(() => {
  const rewardedSlot = googletag.defineOutOfPageSlot(
    '/YOUR_NETWORK_ID/REWARDED_AD_UNIT',
    googletag.enums.OutOfPageFormat.REWARDED
  );
  if (rewardedSlot) {
    rewardedSlot.addService(googletag.pubads());
    googletag.pubads().addEventListener('rewardedSlotGranted', (event) => {
      onRewardGranted(); // Calls POST /api/unlock to reveal the prompt
    });
    googletag.enableServices();
    googletag.display(rewardedSlot);
  }
});
```

When no ad unit is configured or while developing locally, `RewardedUnlock.jsx` automatically falls back to granting the reward after a brief simulated viewing experience, ensuring seamless testing.

---

## Deployment to Vercel

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Under **Environment Variables**, add the variables from `.env.example`:
   - `MONGODB_URI`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.vercel.app`)
   - `NEXT_PUBLIC_ADSENSE_CLIENT`
   - `NEXT_PUBLIC_ADSENSE_SLOT_BELOW_VIDEO`
   - `NEXT_PUBLIC_ADSENSE_SLOT_BELOW_PROMPT`
5. Click **Deploy**. Vercel will build the Next.js application automatically.
6. Once deployed, run the seed script once against your MongoDB Atlas URI:
   ```bash
   MONGODB_URI="your_atlas_connection_string" npm run seed
   ```
