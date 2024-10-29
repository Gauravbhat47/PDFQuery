from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from typing import List
from database import create_db, add_file, get_file_path, get_all_files, ask_question

# Set OpenAI API key
os.environ["OPENAI_API_KEY"] = "your-api-key"  # Replace with your actual OpenAI API key

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   #["http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1:8000"],  # Adjust to your frontend's origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Create the database if it doesn't exist
create_db()

# Define request model for asking questions
class QuestionRequest(BaseModel):
    file_id: int
    question: str

# Route for uploading files
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_location = f"uploads/{file.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())
        add_file(file.filename)
        return {"file_id": len(get_all_files()), "file_name": file.filename}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Explicit OPTIONS route for /upload to handle CORS preflight
@app.options("/upload")
async def options_upload():
    return {"status": "OK"}

# Route for asking questions
@app.post("/ask")
async def ask_question_endpoint(question_request: QuestionRequest):
    answer = ask_question(question_request.file_id, question_request.question)
    return {"answer": answer}

# Route for downloading files
@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = get_file_path(filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

# Route for listing all files
@app.get("/files", response_model=List[str])
async def list_files():
    return get_all_files()
