import React, { useState, useEffect } from 'react';
import { listBlobsInContainer } from './blobService';

const FileSearch = () => {
    const [query, setQuery] = useState("");
    const [blobs, setBlobs] = useState([]);

    useEffect(() => {
        const fetchBlobs = async () => {
            try {
                const blobList = await listBlobsInContainer();
                setBlobs(blobList);
            } catch (error) {
                console.error('Error fetching blobs:', error);
            }
        };

        fetchBlobs();
    }, []);

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

            <div className="file-list">
                <h2>File List</h2>
                <hr style={{border: '1px solid #000000'}}/>
               <ul>
                    {blobs.map((blob, index) => (
                        <li key={index}>{blob}</li>
                    ))}
                </ul>
            </div>

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
