import React, { useEffect, useState } from 'react';

const JustForTodayPage = () => {
  // Data objects
  const jftData = {
    "01-01": "New Year's Day: We admitted we were powerless over our addiction, that our lives had become unmanageable.",
    "01-02": "January 2: Came to believe that a Power greater than ourselves could restore us to sanity.",
    "01-03": "January 3: Made a decision to turn our will and our lives over to the care of God as we understood Him.",
    "01-04": "January 4: Made a searching and fearless moral inventory of ourselves.",
    "01-05": "January 5: Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.",
    // ... (imagine all 366 entries are here)
    "12-30": "December 30: We continue to take personal inventory and when we were wrong promptly admitted it.",
    "12-31": "December 31: Having had a spiritual awakening as the result of these steps, we tried to carry this message to addicts, and to practice these principles in all our affairs."
  };

  const basicTextExcerpt = {
    "page1": "This is an excerpt from page 1 of the Basic Text. It talks about who is an addict.",
    "page55": "This is an excerpt from page 55 of the Basic Text. It discusses the concept of surrender.",
    "page78": "This is an excerpt from page 78 of the Basic Text, focusing on the NA fellowship.",
    "page100": "This is an excerpt from page 100 of the Basic Text, detailing the promises."
    // ... (more excerpts)
  };

  // Helper functions
  const getCurrentDateString = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(today.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  };

  const formatJFTForDisplay = (jftEntry) => {
    if (!jftEntry) return "<p>No reading available for today.</p>";
    const parts = jftEntry.split(':');
    const title = parts[0].trim();
    const text = parts.slice(1).join(':').trim();
    // Basic HTML sanitization (example)
    const sanitizedText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<h3>${title}</h3><p>"<em>${sanitizedText}</em>"</p>`;
  };

  const formatBasicTextForDisplay = (page, excerpt) => {
    if (!excerpt) return "";
    // Basic HTML sanitization (example)
    const sanitizedExcerpt = excerpt.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<p class="basic-text-excerpt">Basic Text Excerpt (Page ${page}): "${sanitizedExcerpt}"</p>`;
  };

  const getSummary = async (textToSummarize) => {
    const API_KEY = ""; // Intentionally empty as per original
    if (!API_KEY) {
      // console.warn("API key for summarization is not set. Returning original text.");
      // Return original text if API key is missing, but extract the core message for summary
      const coreMessageMatch = textToSummarize.match(/<em>(.*?)<\/em>/);
      if (coreMessageMatch && coreMessageMatch[1]) {
        return `<p>${coreMessageMatch[1]}</p>`;
      }
      return `<p>${textToSummarize}</p>`; // Fallback if no em tag
    }
    // API call logic would go here if an API key was provided
    // For now, it will just return the original text due to the warning above.
    // This part would be more complex if actual summarization was happening
    // For example, calling an external API:
    // const response = await fetch('https://api.example.com/summarize', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    //   body: JSON.stringify({ text: textToSummarize })
    // });
    // if (!response.ok) {
    //   console.error("Failed to summarize text:", await response.text());
    //   return textToSummarize; // Or handle error appropriately
    // }
    // const summary = await response.json();
    // return summary.text;
    return `<p>${textToSummarize}</p>`; // Placeholder
  };

  // State for dynamic content
  const [currentDateDisplay, setCurrentDateDisplay] = useState('');
  const [jftReadingHtml, setJftReadingHtml] = useState('');
  const [basicTextHtml, setBasicTextHtml] = useState('');
  const [summaryHtml, setSummaryHtml] = useState('');

  useEffect(() => {
    const dateStr = getCurrentDateString();
    const today = new Date();
    const formattedDate = `${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`;
    setCurrentDateDisplay(formattedDate);

    const jftEntry = jftData[dateStr] || "No reading available for today.";
    const formattedJft = formatJFTForDisplay(jftEntry);
    setJftReadingHtml(formattedJft);

    const excerptKeys = Object.keys(basicTextExcerpt);
    const randomKey = excerptKeys[Math.floor(Math.random() * excerptKeys.length)];
    const randomExcerpt = basicTextExcerpt[randomKey];
    const formattedBasicText = formatBasicTextForDisplay(randomKey.replace('page',''), randomExcerpt);
    setBasicTextHtml(formattedBasicText);

    // Get summary (will return the JFT text itself due to no API key)
    // We need to extract the text content from the formattedJFT HTML for the summary
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formattedJft;
    const jftTextContent = tempDiv.querySelector('p')?.textContent || tempDiv.textContent || '';
    
    getSummary(jftTextContent.replace(/"/g, '').trim()).then(summaryResult => {
      // The summary function itself now returns HTML string with <p> tag
      setSummaryHtml(summaryResult);
    });

  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="container">
      <header>
        <h1>NA Daily Reflections</h1>
      </header>
      <main>
        <section id="jft" className="reflection-section">
          <h2>Just for Today</h2>
          <p id="current-date">{currentDateDisplay}</p>
          <div id="jft-reading-content" dangerouslySetInnerHTML={{ __html: jftReadingHtml }}></div>
        </section>
        <section id="basic-text" className="reflection-section">
          <h2>Basic Text Excerpt</h2>
          <div id="basic-text-content" dangerouslySetInnerHTML={{ __html: basicTextHtml }}></div>
        </section>
        <section id="summary" className="reflection-section">
          <h2>Summary</h2>
          <div id="summary-content" dangerouslySetInnerHTML={{ __html: summaryHtml }}></div>
        </section>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} NA Reflections App</p>
      </footer>
    </div>
  );
};

export default JustForTodayPage;
