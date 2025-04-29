# NasserTology Daily - Reuters News Integration

## Project Overview

This project integrates real-time news articles from Reuters (specifically, World News via a FiveFilters RSS feed) into the "NasserTology Daily" React application. It replaces the original dummy data with fetched news content, including titles, summaries, images (if available), publication dates, and links to the original articles.

## Features

*   Fetches news articles from a reliable Reuters World News RSS feed.
*   Parses RSS/XML data and extracts relevant fields (title, summary, image URL, date, category, article URL).
*   Saves fetched data into a structured JSON file (`src/reuters_news.json`).
*   Integrates the fetched news data into the existing React application structure.
*   Displays news articles with titles, summaries, images, and publication dates.
*   Article titles link directly to the original Reuters source.
*   Includes a Node.js script (`scripts/update_news.js`) for manually refreshing the news data.
*   The scraper script includes error handling with retry logic for robustness.

## Technology Stack

*   **Frontend:** React (using Vite), styled-components
*   **News Fetching:** Node.js
*   **HTTP Client:** Axios
*   **XML Parsing:** fast-xml-parser
*   **News Source:** FiveFilters.org pre-made Reuters World News RSS feed

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/magedzidan/nassertology-daily.git
    cd nassertology-daily
    ```
2.  **Install dependencies:** This installs both React app dependencies and the dependencies needed for the news update script.
    ```bash
    npm install
    ```

## Running the Application Locally

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to the local URL provided (usually `http://localhost:5173` or similar).

The application will initially display the news data present in `src/reuters_news.json` at the time of the last update.

## Updating News Data

Automated scheduling for news updates is currently unavailable. To manually refresh the news data displayed in the application, follow the instructions in the `manual_update_instructions.md` file (which will also be included in the final delivery).

In summary, you need to run the following command in the project root directory:

```bash
node scripts/update_news.js
```

After the script successfully updates `src/reuters_news.json`, you need to commit and push this change to your GitHub repository:

```bash
git add src/reuters_news.json
git commit -m "Update Reuters news data"
git push origin main # Or your default branch
```

## Scraper Script (`scripts/update_news.js`)

This Node.js script is responsible for fetching and processing the news data.

*   **Functionality:**
    *   Fetches the XML content from the specified Reuters World News RSS feed URL (`https://cdn.feedcontrol.net/8/1115-TvWAhu4G064WT.xml`).
    *   Uses `axios` for making the HTTP request.
    *   Includes retry logic (up to 3 attempts with a 2-second delay) and a request timeout to handle temporary network issues.
    *   Validates the fetched XML using `fast-xml-parser`.
    *   Parses the valid XML into a JavaScript object.
    *   Maps the relevant data from each news item (`<item>`) in the feed (title, link, pubDate, description, media:content/enclosure for image URL) to a structured format.
    *   Provides fallbacks for missing data fields (e.g., "No title available").
    *   Assigns a stable ID using the feed's `guid` if available, otherwise generates one.
    *   Saves the resulting array of article objects as a JSON file to `src/reuters_news.json`, overwriting the previous content.
*   **Dependencies:** `axios`, `fast-xml-parser` (these are installed via `npm install` in the main project).
*   **Execution:** Run manually using `node scripts/update_news.js` from the project root.

## React Integration

1.  **Data Loading (`src/data.js`):**
    *   This file now directly imports the `reuters_news.json` file.
    *   It maps the raw data from the JSON file into the `newsItems` array, ensuring the structure matches what the React components expect (e.g., formatting dates, providing placeholder images if `imageUrl` is missing).
2.  **Data Display (`src/App.jsx`):**
    *   Imports `newsItems` from `src/data.js`.
    *   Uses the `useState` and `useEffect` hooks to load the news data into the component's state (`currentNews`).
    *   Renders the list of news articles using the `Grid` and `ItemStyle` styled components.
    *   The `NewsItem` component has been updated to:
        *   Accept and display the `summary`.
        *   Wrap the `title` in an `<a>` tag linking to the original article `url`.
        *   Include basic error handling for missing images (`onError` on the `<img>` tag).
    *   Category filtering has been simplified/removed as the current feed only provides "World" news.

## Deployment

This is a standard React application built with Vite. You can deploy it to various static hosting platforms.

1.  **Build the Application:**
    ```bash
    npm run build
    ```
    This command creates a `dist` folder containing the optimized static assets for your application.
2.  **Deploy the `dist` folder:**
    *   **Platforms:** You can deploy the contents of the `dist` folder to services like:
        *   Vercel
        *   Netlify
        *   GitHub Pages
        *   AWS S3 + CloudFront
        *   Other static web hosts.
    *   **Process:** Most platforms allow you to connect your GitHub repository directly. They will automatically detect it's a Vite/React project, run the build command (`npm run build`), and deploy the resulting `dist` folder.
    *   **Manual Upload:** Alternatively, you can manually upload the contents of the `dist` folder to your chosen hosting provider.

**Important:** Ensure that the `src/reuters_news.json` file is committed to your repository *before* deploying. The build process includes this JSON file, so the deployed application will contain the news data from the last time the update script was run and committed.

