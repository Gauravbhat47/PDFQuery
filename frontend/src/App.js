import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [isHovered, setIsHovered] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [question, setQuestion] = useState('');
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null); // State for error messages

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleFileUpload = async () => {
    // Limit the number of uploaded files to 7
    if (uploadedFiles.length >= 7) {
      setError('You can upload a maximum of 7 PDFs.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';

    input.onchange = async (event) => {
      const file = event.target.files[0];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('http://127.0.0.1:8000/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Upload failed, please try again.');
          }

          const result = await response.json();
          console.log(result); // Handle the response from the backend

          setUploadedFiles((prevFiles) => [
            ...prevFiles,
            { id: result.file_id, name: file.name }, // Use file.name for the file name
          ]);
          setError(null); // Clear any previous errors
        } catch (error) {
          console.error('Error uploading file:', error);
          setError(error.message); // Set error state to display
        }
      }
    };

    input.click();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredFiles = uploadedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuestionSubmit = async () => {
    if (!selectedFileId) return; // Prevent submitting if no file is selected
    if (question.trim() === '') return; // Prevent empty questions

    try {
      const response = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_id: selectedFileId, question }),
      });

      const result = await response.json();
      setAnswer(result.answer || 'No answer found'); // Store the answer to display
      setQuestion(''); // Clear the question input after submission
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  const handleFileSelect = (fileId) => {
    setSelectedFileId(fileId);
    setAnswer(''); // Clear previous answer when selecting a new file
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          className={`sticky-logo ${isHovered ? 'hovered' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <li></li>
        <li></li>
        <h1 className='welcome-text'>Welcome To My Interactive PDF !</h1>
      </header>

      {/* Upload Section */}
      <div className="upload-section">
        <button className="upload-button" onClick={handleFileUpload}>
          Upload File Here
        </button>
        {error && <p className="error-message">{error}</p>} {/* Show error message if any */}
      </div>

      {/* Download Section with Dotted Border */}
      <div className="download-section bordered">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <div key={file.id} className={`download-item ${selectedFileId === file.id ? 'highlighted' : ''}`}>
              <span>{file.name}</span>
              <button
                onClick={() => handleFileSelect(file.id)} // Select for question
                className="download-button"
              >
                Select for Question
              </button>
              <a
                href={`http://127.0.0.1:8000/download/${file.id}`} // Use file.id for the download URL
                target="_blank"
                rel="noopener noreferrer"
                className="download-button"
              >
                Download
              </a>
            </div>
          ))
        ) : (
          <p>No files found</p>
        )}
      </div>

      {/* Search Section with Border */}
      <div className="search-section bordered">
        <input
          type="text"
          placeholder="Search uploaded files..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Question Section with Border */}
      <div className="question-section bordered">
        <h2>{selectedFileId ? `Ask a Question About ${uploadedFiles.find(file => file.id === selectedFileId)?.name}` : 'Ask a Question About Your Uploaded PDF:'}</h2>
        <input
          type="text"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="question-input"
        />
        <button
          onClick={handleQuestionSubmit}
          className="upload-button"
        >
          Submit Question
        </button>
      </div>

      {/* Answer Section with Border (always visible) */}
      <div className="answer-section bordered">
        <h2>Answer:</h2>
        <p>{answer || 'Your questions answer will appear here'}</p>
      </div>
    </div>
  );
}

export default App;
