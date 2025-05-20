from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from rag_engine import process_pdf, answer_query

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

storage = {}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    contents = await file.read()
    save_path = f"uploads/{file.filename}"
    with open(save_path, "wb") as f:
        f.write(contents)
    
    index, chunks = process_pdf(save_path)
    storage[file.filename] = (index, chunks)

    return {"doc_id": file.filename}

@app.post("/query")
async def query(doc_id: str = Form(...), question: str = Form(...)):
    index_data = storage.get(doc_id)
    if not index_data:
        return {"error": "Document not found"}
    index = index_data[0]
    chunks = index_data[1]
    context = answer_query(index, chunks, question)
    return {"answer": context["answer"], "used_chunks": context["chunks"]}
