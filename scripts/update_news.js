import axios from "axios";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// RSS feed URL for Reuters World News (via FiveFilters)
const RSS_URL = "https://cdn.feedcontrol.net/8/1115-TvWAhu4G064WT.xml";
// Output path relative to the script's location
const OUTPUT_JSON_PATH = path.join(__dirname, "../src/reuters_news.json");

// Retry settings
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds

// Options for XML parser
const xmlParserOptions = {
    ignoreAttributes: false,
    attributeNamePrefix : "@_",
    allowBooleanAttributes: true,
};

// Helper function for delaying execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchAndParseRSS = async () => {
    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            console.log(`Attempt ${retries + 1}/${MAX_RETRIES}: Fetching RSS feed from ${RSS_URL}...`);
            const response = await axios.get(RSS_URL, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                },
                timeout: 15000 // Add a timeout
            });
            const xmlData = response.data;

            console.log("Validating XML...");
            const validationResult = XMLValidator.validate(xmlData);
            if (validationResult !== true) {
                console.error("XML validation failed:", validationResult.err);
                // No retry on validation failure, likely a feed issue
                return;
            }

            console.log("Parsing XML...");
            const parser = new XMLParser(xmlParserOptions);
            const jsonObj = parser.parse(xmlData);

            const items = jsonObj?.rss?.channel?.item || [];
            console.log(`Found ${items.length} articles.`);

            const articles = items.map((item, index) => {
                const title = item.title || "No title available";
                const link = item.link || "#";
                const pubDateRaw = item.pubDate || null;
                const description = item.description || item.title || "No summary available";
                const category = "World"; // Set category to World News

                let imageUrl = null;
                // Check for media:content with url attribute
                if (item["media:content"] && item["media:content"]["@_url"]) {
                    imageUrl = item["media:content"]["@_url"];
                } 
                // Check for enclosure with url attribute
                else if (item.enclosure && item.enclosure["@_url"]) {
                     imageUrl = item.enclosure["@_url"];
                }
                // Check for media:thumbnail with url attribute (another common pattern)
                else if (item["media:thumbnail"] && item["media:thumbnail"]["@_url"]) {
                    imageUrl = item["media:thumbnail"]["@_url"];
                }

                const summary = description.replace(/<[^>]*>/g, "").trim();
                const publishDate = pubDateRaw ? new Date(pubDateRaw).toISOString() : null;

                return {
                    // Use guid as a more stable ID if available, otherwise fallback to index
                    id: item.guid && typeof item.guid === 'string' ? item.guid : `generated-${index + 1}`,
                    title,
                    summary,
                    imageUrl,
                    publishDate,
                    category,
                    url: link
                };
            });

            console.log(`Saving ${articles.length} articles to ${OUTPUT_JSON_PATH}...`);
            await fs.writeFile(OUTPUT_JSON_PATH, JSON.stringify(articles, null, 2));
            console.log("Successfully saved news data.");
            return; // Success, exit the loop

        } catch (error) {
            console.error(`Attempt ${retries + 1} failed: Error fetching or parsing RSS feed:`, error.message);
            retries++;
            if (retries < MAX_RETRIES) {
                console.log(`Waiting ${RETRY_DELAY_MS / 1000} seconds before retrying...`);
                await delay(RETRY_DELAY_MS);
            } else {
                console.error("Max retries reached. Failed to fetch news data.");
            }
        }
    }
};

fetchAndParseRSS();

