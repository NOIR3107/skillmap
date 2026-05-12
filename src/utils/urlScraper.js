export const fetchTextFromUrl = async (url) => {
  try {
    // Use AllOrigins to bypass CORS
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('Network response was not ok.');
    
    const data = await response.json();
    const htmlString = data.contents;
    
    // Parse the HTML string into a Document
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    // Remove scripts, styles, navs, headers, footers for cleaner text
    const selectorsToRemove = ['script', 'style', 'nav', 'header', 'footer', 'noscript', 'svg', 'iframe'];
    selectorsToRemove.forEach(selector => {
      const elements = doc.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
    
    // Attempt to target the main content area if possible, otherwise use body
    const mainContent = doc.querySelector('main') || doc.querySelector('[role="main"]') || doc.body;
    
    if (!mainContent) return "Could not extract content from the URL.";
    
    // Get text content, remove excessive whitespace
    let text = mainContent.innerText || mainContent.textContent;
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  } catch (error) {
    console.error("Error fetching URL:", error);
    throw new Error('Failed to fetch and parse the URL. Make sure it is publicly accessible.');
  }
};
