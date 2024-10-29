# About
The user uploads PDF files, which are stored locally and cataloged in an SQLite database. When a file is selected, the user can type in a question related to its content. The backend processes this question by extracting text from the PDF using PyMuPDF (via fitz), and then uses LangChain's RetrievalQA with OpenAI embeddings to provide an answer based on the PDF's content. Answers are retrieved using a vectorized database, facilitating quick and contextually accurate responses. 

-Main edit. Make sure to edit the background image path in fronted to where you have downloaded the image.
-Make sure all the libraries are updated and  

### Features
- Upload PDF Files: Users can upload pdf files.
- Question Submission: Once a PDF is selected, users can ask questions about its content.
- File Download: Users can download their uploaded PDFs.
- Search Functionality: A search bar helps users find specific files by name.
- Interactive UI: The UI includes interactive elements such as highlighting for selected files, and error messages for file upload limits or backend errors.

### Setup Instructions
Clone the repository and navigate to the project directory.

### Installing Required Packages:
#### Backend (Python): 
pip install -r requirements.txt
#### Frontend (Node.js):
npm install react-scripts

### Set Up OpenAI API Key:
Add your OpenAI API key in the backend code (main.py) by replacing "your-api-key" in:
python
os.environ["OPENAI_API_KEY"] = "your-api-key"


### Database Initialization:
The database is automatically created with the create_db function when you start the backend server. The database file files.db will be stored in the project’s root directory.

to Run the Application:
Starting the Backend Server: uvicorn main:app --reload
Starting the Frontend Server: npm start
The application will be accessible at http://localhost:3000 for the frontend and http://localhost:8000 for the backend.

### Project Structure 
Mainly in frontend
App.js: The main React component, which includes file upload, search, selection, and Q&A logic.
App.css: Styles for the application, including the interactive and highlighted components.

Mainly in backend
main.py: FastAPI server handling file uploads, downloads, and question processing.
database.py: Manages the SQLite database, file storage, and retrieval.










ChatGPT can make mistakes. Check important info.
