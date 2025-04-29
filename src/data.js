import newsData from './reuters_news.json';

// Map the fetched Reuters data to the structure expected by the components
export const newsItems = newsData.map((item, index) => ({
  id: index + 1, // Generate a simple ID
  title: item.title || 'No Title',
  category: item.category || 'General', // Use the category from the feed ('World')
  innerCategory: item.category || 'General', // Use the same for innerCategory for now
  date: item.publishDate ? item.publishDate.split('T')[0] : new Date().toISOString().split('T')[0], // Format date as YYYY-MM-DD
  imageUrl: item.imageUrl || `https://picsum.photos/400/250?random=${index + 1}`, // Use placeholder if no image
  summary: item.summary || 'No summary available.', // Add summary field
  url: item.url || '#' // Add url field
}));

export const device = {
  mobile: '500px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1440px'
};

