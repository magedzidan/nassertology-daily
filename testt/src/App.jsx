import { useState } from 'react'
import './App.css'
import { newsItems, device } from './data';
import styled, { createGlobalStyle } from 'styled-components'

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
    color: #333; // Basic blue link color
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
  h1 {
    font-size: 1.8rem;
    color: #d64000; // Reuters orange accent
    margin: 0;
  }
`;

const Inner_Categrios=styled.div`
display:flex;
flex-direction:row;
gap:10px;
max-width:800px;
justify-content:start;
margin: 10px 20px;

>button{
  background-color: white;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.6rem;
  font-weight: 800;
  color: #483c3c;
  &:hover {
    font-weight:900;
    box-shadow: 0 4px 8px rgba(72, 60, 60, 0.2);
    transform: translateY(-1px);
    transition: all 0.3s ease;
  }

  &:focus {
    font-weight:900;
    box-shadow: 0 4px 8px rgba(72, 60, 60, 0.2);
    transform: translateY(-1px);
    transition: all 0.3s ease;

    }
}
`

const Categrios = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.1rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #847f7f;

  > button {
    background-color: white;
    padding: 10px 40px;
    border: 1px solid #ffffff;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 700;
    color: #483c3c;
    &:hover {
      font-weight: 800;
      transition: all 0.1s ease;

    }
    &:focus {
      font-weight: 800;
      transition: all 0.1s ease;

    }
  }
`;

// Main Grid Layout
const Grid = styled.main`
  display: grid;
  grid-template-columns: repeat(4, 1fr); // Default: 4 columns
  gap: 20px; // Default gap for desktop
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  
  > div:first-child {
    grid-column: 1 / 4;
    grid-row: 1 / 3;

    img.news-image {
      height: 500px;
      object-fit: cover;
    }
  }

  // Styles for Laptop and smaller (where separators appear)
  @media (max-width: ${device.laptop}) {
    grid-template-columns: repeat(3, 1fr); // 3 columns for laptop
    gap: 0 20px; // Remove row gap, keep column gap
    
    > div {
        border-bottom: 1px solid #e0e0e0; // Add separator line
        padding-bottom: 20px; // Add padding below item content
        margin-bottom: 20px; // Add margin to simulate row gap visually
    }



    > div:first-child {
      grid-column: 1 / 3;
      margin-bottom: 20px; // Ensure hero item has margin too
    }
  }

  @media (max-width: ${device.tablet}) {
    grid-template-columns: repeat(2, 1fr); // 2 columns for tablet
    gap: 0 20px; // Remove row gap, keep column gap
    
     > div {
        /* Styles inherited from laptop query */
     }

    > div:first-child {
      grid-column: 1 / 3;
    }
  }

  @media (max-width: ${device.mobile}) {
    grid-template-columns: 1fr; // 1 column for mobile
    gap: 0; // Remove all gaps

    > div {
        /* Styles inherited */
        padding-left: 0; // Adjust padding if needed for single column
        padding-right: 0;
    }
    
    > div:first-child {
      grid-column: 1 / 2;
      grid-row: 1 / 2; 
      
      img.news-image {
        height: 300px;
      }
    }
  }
`;

// Individual Item Styling (Transparent background, no shadow/border)
const ItemStyle = styled.div`
  background-color: transparent; // Transparent background
  border-radius: 0; // Remove border-radius if desired
  overflow: hidden;
  border: none; // Remove border
  box-shadow: none; // Remove box-shadow
  transition: transform 0.2s;
  text-align: start;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-3px);
    box-shadow: none; // Ensure no shadow on hover either
  }

  .news-image {
      width: 100%;
      height: 180px; // Standard image height
      object-fit: cover;
      display: block;
  }

  .news-content {
      padding: 10px 0 0 0; // Remove side/bottom padding here
      flex-grow: 1; 
      display: flex;
      flex-direction: column;
      justify-content: space-between; 
  }
  .news-inner-category{
    display:block;
      font-size: 0.75rem;
      color: #555;
      margin-bottom: 8px;
      text-transform: uppercase;
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
      margin: 0 0 0px 0;
      color: #111;
      font-weight: 600;
      line-height: 1.3;
  }

  .news-date {
      display: block;
      color: #666;
      font-size: 0.8rem;
      margin-top: 5px;
  }
`;

// Date Formatting Function
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; 
    }
    const options = { hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'shortOffset' };
    let formatted = new Intl.DateTimeFormat('en-US', options).format(date);
    return formatted;
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString; 
  }
}

// News Item Component (now simpler, styling handled by ItemStyle)
function NewsItem({ title, category, date, imageUrl,innerCategory }) {
  return (
    <>
      <img src={imageUrl} alt={title} className="news-image" />
      <div className="news-content">
        <div> 
          <span className="news-category">{category}</span>
          <span className="news-inner-category">{innerCategory}</span>
          <h2 className="news-title">{title}</h2>
        </div>
        <span className="news-date">{formatDate(date)}</span>
      </div>
    </>
  );
}

function App() {
  const [currentCategory, setCurrentCategory] = useState(newsItems);
  const [innerCategoryState, setinnerCategoryState] = useState(false);

  function HandleCategory(category) {
    setCurrentCategory(newsItems.filter((item) => item.category === category));
    setinnerCategoryState(true);
  }

  return (
    <>
      <GlobalStyle />
      <AppHeader>
        <h1>Nasrtology</h1>
        <Categrios>
          <button onClick={() => HandleCategory('Technology')}>Technology</button>
          <button onClick={() => HandleCategory('Sports')}>Sports</button>
          <button onClick={() => HandleCategory('Environment')}>Environment</button>
          <button onClick={() => HandleCategory('Business')}>Business</button>
        </Categrios> 
      </AppHeader>
      <Inner_Categrios>
        <button onClick={() => HandleCategory('Technology')}>Technology</button>
        <button onClick={() => HandleCategory('Sports')}>Sports</button>
        <button onClick={() => HandleCategory('Environment')}>Environment</button>
        <button onClick={() => HandleCategory('Business')}>Business</button>
      </Inner_Categrios>
      <Grid>
        {currentCategory.map((item, index) => (
          <ItemStyle key={item.id}>
              {innerCategoryState?
            <NewsItem
              title={item.title}
              innerCategory={item.innerCategory}
              date={item.date}
              imageUrl={item.imageUrl}
            />: 
             <NewsItem
            title={item.title}
            category={item.category}
            date={item.date}
            imageUrl={item.imageUrl}
          />}
          </ItemStyle>
        ))}
      </Grid>
    </>
  );
}

export default App;

