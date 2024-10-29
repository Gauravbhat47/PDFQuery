import sqlite3
import os
import fitz  # PyMuPDF
from langchain.chains import RetrievalQA
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI

def create_db():
    """Create the database and the files table if it doesn't exist."""
    conn = sqlite3.connect('files.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def add_file(filename):
    """Add the filename to the database."""
    conn = sqlite3.connect('files.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO files (filename) VALUES (?)', (filename,))
    conn.commit()
    conn.close()

def get_all_files():
    """Retrieve all files from the database."""
    conn = sqlite3.connect('files.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM files')
    files = cursor.fetchall()
    conn.close()
    return [{"id": file[0], "name": file[1]} for file in files]

def get_file_path(filename):
    """Get the full path for the uploaded file."""
    return os.path.join("uploads", filename)

def extract_text_from_pdf(file_path):
    """Extract text from the PDF file."""
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def ask_question(file_id, question):
    """Process the question and return an answer based on the PDF content."""
    # Get the file information from the database
    conn = sqlite3.connect('files.db')
    cursor = conn.cursor()
    cursor.execute('SELECT filename FROM files WHERE id = ?', (file_id,))
    result = cursor.fetchone()
    conn.close()

    if result is None:
        return "File not found."

    filename = result[0]
    file_path = get_file_path(filename)

    # Extract text from the PDF
    pdf_text = extract_text_from_pdf(file_path)

    # Set up LangChain for question answering
    embeddings = OpenAIEmbeddings()  # Ensure you have your OpenAI API key set
    vectordb = Chroma.from_texts([pdf_text], embeddings)
    qa_chain = RetrievalQA.from_chain_type(llm=OpenAI(), chain_type="stuff", retriever=vectordb.as_retriever())

    # Process the question
    answer = qa_chain.run(question)
    return answer
