# DevSolvr

An intelligent programming doubt solver powered by Google Gemini 2.5 Flash.

## Setup & Deployment

### 1. Installation

```bash
npm install
```

### 2. Environment Variables

Create a file named `.env` in the root directory and add your API key:

```env
API_KEY=your_google_genai_api_key_here
```

### 3. Run Locally

```bash
npm run dev
```

## Google Search Console Verification

To verify your site ownership with Google Search Console:

1.  Go to [Google Search Console](https://search.google.com/search-console).
2.  Add your website property (choose **URL prefix** if you are just starting out).
3.  When asked for verification, choose the **HTML Tag** method.
4.  Copy the meta tag provided by Google (it looks like `<meta name="google-site-verification" content="..." />`).
5.  Open `index.html` in this project.
6.  Locate the line `<!-- TODO: Replace 'YOUR_GOOGLE_VERIFICATION_CODE' ... -->`.
7.  Replace `YOUR_GOOGLE_VERIFICATION_CODE` with the code from the meta tag you copied.
8.  Deploy your changes to your website (e.g., GitHub Pages, Vercel, Netlify).
9.  Return to Google Search Console and click **Verify**.

### 4. Push to GitHub

1. Initialize Git:
   ```bash
   git init
   ```
2. Add files:
   ```bash
   git add .
   ```
   > **Note:** This command respects the `.gitignore` file. It will **automatically exclude** massive folders like `node_modules` and sensitive files like `.env`. Your API key will remain safe on your local machine.

3. Commit:
   ```bash
   git commit -m "Initial commit"
   ```
4. Create a new repository on GitHub (https://github.com/new).
5. Link your local repo to GitHub (replace URL with your repo URL):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/devsolvr.git
   ```
6. Push:
   ```bash
   git branch -M main
   git push -u origin main
   ```
