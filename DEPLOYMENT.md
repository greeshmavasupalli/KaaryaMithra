# KaaryaMithra — Deployment Guide (Vercel + Render)

This guide provides step-by-step instructions to deploy **KaaryaMithra**:
1. **Backend REST API** on [Render](https://render.com) (Free Web Service)
2. **Frontend React Client** on [Vercel](https://vercel.com) (Free Global CDN)
3. **Database** on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free 512MB M0 Cluster)

---

## Part 1: Setup Free Database (MongoDB Atlas)

> *Note: If you skip this, the backend automatically initializes an in-memory database fallback, but MongoDB Atlas is recommended for persistence.*

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a new free cluster (Shared M0 - Free forever).
3. Under **Security &rarr; Database Access**:
   - Create a database user (e.g., username `kaaryamithra_admin` and set a password).
4. Under **Security &rarr; Network Access**:
   - Click **Add IP Address** &rarr; select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Under **Database &rarr; Connect**:
   - Choose **Drivers** (Node.js).
   - Copy your connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/kaaryamithra?retryWrites=true&w=majority
     ```

---

## Part 2: Deploy Backend API on Render

1. Go to [dashboard.render.com](https://dashboard.render.com) and log in with your GitHub account (`greeshmavasupalli`).
2. Click **New +** &rarr; **Web Service**.
3. Select your repository: **`greeshmavasupalli/KaaryaMithra`**.
4. Configure the Web Service settings:
   - **Name:** `kaaryamithra-api`
   - **Region:** Any close region (e.g., Singapore / Frankfurt / Oregon)
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Expand **Environment Variables** and add:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production security & cross-site cookies |
   | `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string from Part 1 |
   | `JWT_SECRET` | `kaaryamithra_super_secret_jwt_key_2026` | Random secure string |
   | `CLIENT_ORIGIN` | `https://*.vercel.app` | Will update with your exact Vercel URL in Part 3 |
6. Click **Create Web Service**.
7. Once deployed, copy your Render backend URL:
   `https://kaaryamithra-api.onrender.com`

> **Note on Cold Starts:** On Render's free tier, the backend sleeps after 15 minutes of inactivity and takes 30-45 seconds to wake up on the first request. The database is automatically seeded with 12 categories, 32 worker profiles, and demo accounts upon first startup!

---

## Part 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** &rarr; **Project**.
3. Import your repository: **`greeshmavasupalli/KaaryaMithra`**.
4. In the Project Configuration:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and choose `client`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
5. Expand **Environment Variables** and add:
   | Key | Value | Description |
   |---|---|---|
   | `VITE_API_BASE_URL` | `https://kaaryamithra-api.onrender.com/api` | Your Render backend URL + `/api` |
6. Click **Deploy**.
7. In ~60 seconds, your site will be live at:
   `https://kaaryamithra.vercel.app` (or your assigned domain).

---

## Part 4: Final Connect (CORS)

Now that you have your live Vercel URL (e.g. `https://kaaryamithra.vercel.app`):
1. Go back to Render &rarr; **`kaaryamithra-api`** &rarr; **Environment**.
2. Update `CLIENT_ORIGIN`:
   ```
   CLIENT_ORIGIN=https://kaaryamithra.vercel.app
   ```
3. Render will automatically redeploy with the updated origin.

---

## Part 5: Review & Test Live Site

1. Open your Vercel URL (`https://kaaryamithra.vercel.app`).
2. Test one-click Demo Mode:
   - Click **Try as Worker (Ramesh - Electrician)** &rarr; Check profile dashboard.
   - Click **Try as Customer (Ananya)** &rarr; Search for a Plumber & send an enquiry.
   - Click **Try as Admin** &rarr; Review moderation queue and audit logs.
3. Done! Your full-stack platform is completely deployed and publicly accessible.
