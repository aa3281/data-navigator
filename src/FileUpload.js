import React, { useState, useRef } from 'react';
import { uploadFileToBlob } from './blobService';
import main from './documentAnalysis'; 

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (file) {
      setIsUploading(true);
      try {
        const response = await uploadFileToBlob(file);
        const analysisResult = await main(response.url);
        setUploadResponse({
          name: file.name,
          url: response.url,
          summaryText: analysisResult.summaryText,
          fullText: analysisResult.fullText,
        });
        setMessage('File uploaded successfully. See below');
      } catch (error) {
        if (error.response) {
          // The server responded with an error (e.g., 500 Internal Server Error)
          console.error('Server error:', error.response.data);
          setMessage('Failed to upload file: Server error');
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          setMessage('Failed to upload file: No response received');
        } else {
          // Something else went wrong
          console.error('Error:', error.message);
          setMessage(`Failed to upload file: ${error.message}`);
        }
      } finally {
        setIsUploading(false);
      }
      
    } else {
      setMessage('Please select a file to upload');
    }
  };
  

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleCancel = () => {
    setFile(null);
    setUploadResponse(null);
    setMessage('File upload cancelled.');
  };

  return (
    <div className="file-upload">

      <div className="upload-input-section">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button className="upload-area" onClick={handleClick}>
          <span className="upload-area-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="340.531" height="419.116" viewBox="0 0 340.531 419.116">
              <g id="files-new" clipPath="url(#clip-files-new)">
                <path id="Union_2" data-name="Union 2" d="M-2904.708-8.885A39.292,39.292,0,0,1-2944-48.177V-388.708A39.292,39.292,0,0,1-2904.708-428h209.558a13.1,13.1,0,0,1,9.3,3.8l78.584,78.584a13.1,13.1,0,0,1,3.8,9.3V-48.177a39.292,39.292,0,0,1-39.292,39.292Zm-13.1-379.823V-48.177a13.1,13.1,0,0,0,13.1,13.1h261.947a13.1,13.1,0,0,0,13.1-13.1V-323.221h-52.39a26.2,26.2,0,0,1-26.194-26.195v-52.39h-196.46A13.1,13.1,0,0,0-2917.805-388.708Zm146.5,241.621a14.269,14.269,0,0,1-7.883-12.758v-19.113h-68.841c-7.869,0-7.87-47.619,0-47.619h68.842v-18.8a14.271,14.271,0,0,1,7.882-12.758,14.239,14.239,0,0,1,14.925,1.354l57.019,42.764c.242.185.328.485.555.671a13.9,13.9,0,0,1,2.751,3.292,14.57,14.57,0,0,1,.984,1.454,14.114,14.114,0,0,1,1.411,5.987,14.006,14.006,0,0,1-1.411,5.973,14.653,14.653,0,0,1-.984,1.468,13.9,13.9,0,0,1-2.751,3.293c-.228.2-.313.485-.555.671l-57.019,42.764a14.26,14.26,0,0,1-8.558,2.847A14.326,14.326,0,0,1-2771.3-147.087Z" transform="translate(2944 428)" fill="var(--c-action-primary)" />
              </g>
            </svg>
          </span>
          <span className="upload-area-title">Choose a file to upload.</span>
        </button>
        {isUploading && (
          <div className="loading-icon">&#8634;</div>
        )}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={handleFileUpload}>Upload File</button>
        </div>
      </div>


      <p>{message}</p>
      {file && !uploadResponse && <p>Selected file: {file.name}</p>}
      {uploadResponse && (
        <>
          <hr style={{ borderColor: '#00a3ee' }} />
          <div className="file-upload-results">
            <h1>Document Name: {uploadResponse.name}</h1>
            <p>Document Link: <a href={uploadResponse.url} target="_blank" rel="noopener noreferrer">{uploadResponse.url}</a></p>
            <div className='response-section'>
              <h3 className="response-section-title">Section Summaries</h3>
              <hr style={{marginBottom: '2rem', borderColor:'#00a3ee'}}/>
              {/* <p>{uploadResponse.summaryText}</p> */}
              <div dangerouslySetInnerHTML={{ __html: uploadResponse.summaryText }}></div>
            </div>
            <div className='response-section'>
              <h3 className="response-section-title">Full Text</h3>
              <hr style={{marginBottom: '2rem', borderColor:'#00a3ee'}}/>
              {/* <p style={{ whiteSpace: 'pre-wrap' }}>{uploadResponse.fullText}</p> */}
              <div dangerouslySetInnerHTML={{ __html: uploadResponse.fullText }}></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUpload;
