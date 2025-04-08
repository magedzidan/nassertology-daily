import { useState } from 'react'
import './App.css'
import { newsItems } from './data';
// Sample news data
import styled from 'styled-components'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
  
  > div:first-child {
    grid-column: 1 / 4; //htbd2 mn wa7d w t3d tlata spots b3dha (1+3)
    grid-row: 1 / 3;

    img.news-image {
      height: 500px;
      object-fit: cover;
    }
  }
`;


const ItemStyle = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
    &:hover {
    transform: translateY(-5px);
    } 


`;


function NewsItem({ title, category, date, imageUrl }) {
  return (
    <div className="news-item">
      <img src={imageUrl} alt={title} className="news-image" />
      <div className="news-content">
        <span className="news-category">{category}</span>
        <h2 className="news-title">{title}</h2>
        <span className="news-date">{date}</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Daily News</h1>
      </header>
      <Grid className="news-container">
        {newsItems.map(item => (
          <ItemStyle key={item.id}>
            <NewsItem
              title={item.title}
              category={item.category}
              date={item.date}
              imageUrl={item.imageUrl}
            />
          </ItemStyle>
        ))}
      </Grid>
    </div>
  );
}

export default App;

