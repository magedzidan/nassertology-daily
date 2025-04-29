import { useState, useEffect } from 'react';
import './App.css';
import { newsItems, device } from './data'; // Imports the mapped data from reuters_news.json
import styled, { createGlobalStyle } from 'styled-components';

// Basic Global Styles (Inspired by Reuters)
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; // Common font stack
    background-color: white; // Set background to white
    color: #333; // Default text color
    margin: 0;
  }
  * {
    box-sizing: border-box;
  }
  a {
    color: #111; // Link color to match title
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Header (Simplified version)
const AppHeader = styled.header`
  padding: 10px 20px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  h1 {
    font-size: 1.8rem;
    color: #d64000; // Reuters orange accent
    margin: 0;
  }
`;

// Removed Inner_Categrios and Categrios styled components as filtering is simplified

// Main Grid Layout (Adjusted for potentially fewer items, kept responsive)
const Grid = styled.main`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); // More flexible grid
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;

  // Removed first-child specific styling for simplicity, can be added back if needed

  @media (max-width: ${device.laptop}) {
    // Adjustments if needed for laptop
  }

  @media (max-width: ${device.tablet}) {
     grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  @media (max-width: ${device.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ItemStyle = styled.div`
  background-color: transparent;
  border-radius: 0;
  overflow: hidden;
  border: none;
  box-shadow: none;
  transition: transform 0.2s;
  text-align: start;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e0e0e0; // Add separator for consistency
  padding-bottom: 20px;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: none;
  }

  .news-image {
      width: 100%;
      height: 180px; // Standard image height
      object-fit: cover;
      display: block;
      margin-bottom: 10px; // Space below image
  }

  .news-content {
      padding: 0; // Remove padding here
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
  }

  .news-category {
      display: inline-block;
      font-size: 0.75rem;
      color: #555;
      margin-bottom: 8px;
      text-transform: uppercase;
      font-weight: 700;
  }

  .news-title {
      font-size: 1.1rem;
      margin: 0 0 8px 0; // Space below title
      color: #111;
      font-weight: 600;
      line-height: 1.3;
  }

  .news-summary {
      font-size: 0.9rem;
      color: #444;
      line-height: 1.4;
      margin-bottom: 10px;
  }

  .news-date {
      display: block;
      color: #666;
      font-size: 0.8rem;
      margin-top: auto; // Push date to bottom
  }
`;

// Date Formatting Function (Keep as is)
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Try parsing without assuming strict ISO format if needed
      const parsedDate = Date.parse(dateString);
      if (!isNaN(parsedDate)) {
         const d = new Date(parsedDate);
         // Format as needed, e.g., just date
         return d.toLocaleDateString('en-CA'); // YYYY-MM-DD
      }
      return dateString; // Return original if still invalid
    }
    // Format as YYYY-MM-DD
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
}

// News Item Component - Updated to include summary and link
function NewsItem({ title, category, date, imageUrl, summary, url }) {
  return (
    <>
      {imageUrl && <img src={imageUrl} alt={title} className="news-image" onError={(e) => { e.target.style.display = 'none'; }} />} {/* Hide image on error */}
      <div className="news-content">
        <div>
          <span className="news-category">{category}</span>
          <a href={url} target="_blank" rel="noopener noreferrer">
             <h2 className="news-title">{title}</h2>
          </a>
          <p className="news-summary">{summary}</p>
        </div>
        <span className="news-date">{formatDate(date)}</span>
      </div>
    </>
  );
}

function App() {
  // State now just holds all news items, filtering removed for simplicity
  const [currentNews, setCurrentNews] = useState([]);

  // Load news items on component mount
  useEffect(() => {
    // newsItems is imported directly from data.js which now reads the JSON
    setCurrentNews(newsItems);
  }, []);

  function HandleResetPage(){
     // No filtering to reset, maybe refresh data in future?
     // For now, just ensures clicking title doesn't break anything
     console.log("Resetting page view...");
  }

  return (
    <>
      <GlobalStyle />
      <AppHeader>
        {/* Make title clickable, but action is simplified */}
        <h1 onClick={HandleResetPage}>NasserTology Daily</h1>
        {/* Removed category buttons */}
      </AppHeader>
      {/* Removed inner category buttons */}
      <Grid>
        {currentNews.map((item) => (
          <ItemStyle key={item.id}>
            <NewsItem
              title={item.title}
              category={item.category}
              date={item.date}
              imageUrl={item.imageUrl}
              summary={item.summary} // Pass summary
              url={item.url} // Pass url
            />
          </ItemStyle>
        ))}
      </Grid>
    </>
  );
}

export default App;

