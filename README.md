# Beamish v25 — GitHub-ready Website

This repository contains the **Beamish v25** static HTML/CSS/JavaScript website prototype, including the Public Website, Candidate and Employer portals, Portal Hub, and the Admin/Finance/CMS demonstration pages. It preserves the approved v25 design and functionality.

## Repository layout

| Location | Purpose |
| --- | --- |
| `index.html` | Entry page; automatically opens the public website |
| `public/` | Public website, including Career IRL and For Employers |
| `candidate/` | Candidate portal |
| `employer/` | Employer portal, Candidate Discovery, subscriptions and boost campaigns |
| `portal-hub/` | Portal hub |
| `backend/` | Demo Platform Admin, Finance and CMS portals |
| `auth/` | Candidate and Employer signup/login pages |
| `assets/` | Stylesheets, scripts, images and related assets |
| `docs/` | Website's existing sample documents and previews |
| `project-notes/` | v25 change log, fixes, and original QA reports |
| `netlify.toml` | Netlify static-site deployment configuration |

## Upload to a new GitHub repository

1. **Extract** `Beamish_v25_GitHub_Ready.zip` on your computer. GitHub will not automatically extract an uploaded ZIP.
2. Create a new repository on GitHub (e.g. `beamish-website`). Keep it **Private** if the project is not ready for public source-code access.
3. Use GitHub Desktop (recommended for multiple files): **File → Add Local Repository**. Choose the extracted folder; if it is not a Git repository yet, select **Create a Repository**. Commit and **Publish repository**.
4. Alternatively, from a terminal in the extracted folder:

   ```bash
   git init
   git add .
   git commit -m "Beamish v25 initial import"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

   Create an **empty** repository in GitHub first if using the terminal commands above. Replace `YOUR-USERNAME` and `YOUR-REPO` with your own values and authenticate using a supported GitHub method. If Git asks for your name/email, configure your Git identity before the commit.

## Deploy from GitHub to Netlify (recommended)

The project is a plain static website; **no npm install or build command** is required.

1. Netlify → **Add new project / Import from Git** → select your GitHub repository. To retain an existing Netlify site URL, connect the repository from the settings of your **existing** Netlify site instead of creating a new one.
2. Use the `main` branch.
3. **Build command:** leave blank. **Publish directory:** `.` (repository root). The included `netlify.toml` also declares this.
4. Deploy. For subsequent updates, push commits to GitHub and Netlify can redeploy them automatically.

## Optional: GitHub Pages

Because this is a static site, you can also use GitHub Pages: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save**. The `.nojekyll` file is included. `index.html` sends visitors to `public/index.html` via a relative URL. GitHub Pages may work differently from Netlify for routing and hosting, so test each portal and asset URL after publishing.

## Run locally

For best results, use a local web server rather than opening files through `file://`:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Important: prototype limitations

This release uses demonstration data and browser-local storage. It does **not** include production authentication, hosted uploads, a synchronized user database, real payments, or live AI generation. Image/video selection and preview in the demo are **not** equivalent to server-side uploads. See `project-notes/README_V25_FIXES.md` for the full v25 scope and QA qualifications.

## Design preservation

All functional website files in this GitHub package are copied **unchanged** from the v25 Netlify-ready release. Only repository documentation and metadata have been added.
