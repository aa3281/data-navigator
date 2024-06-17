import React, { useState } from 'react';

const FileSearch = () => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // For now, we will just log the query
    console.log("Search query submitted: ", query);
  };

  return (
    <>
      <header className="App-header">
        <h1>DataNavigator: File Search</h1>
        <p>
          Search through the documents stored in the Azure Blob Storage container and ask questions. “Chat” with your data in natural language and get relevant information from your stored documents. 
        </p>
      </header>
      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-form">
          <input 
            type="text" 
            placeholder="Type your question here..." 
            value={query} 
            onChange={handleInputChange} 
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
    </>
  );
};

export default FileSearch;
