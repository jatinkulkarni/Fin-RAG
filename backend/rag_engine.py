import fitz  # PyMuPDF
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import pipeline

# Load models once
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
qa_model = pipeline("text2text-generation", model="google/flan-t5-base")

def process_pdf(file_path, chunk_size=500, overlap=50):
    doc = fitz.open(file_path)
    text = "\n".join([page.get_text() for page in doc])

    words = text.split()
    chunks = [
        " ".join(words[i:i + chunk_size])
        for i in range(0, len(words), chunk_size - overlap)
    ]

    embeddings = embed_model.encode(chunks, show_progress_bar=True)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings))

    return index, chunks

def answer_query(index, chunks, query, k=5):
    query_emb = embed_model.encode([query])
    distances, indices = index.search(np.array(query_emb), k)
    context = "\n".join([chunks[i] for i in indices[0]])

    prompt = f"Context: {context}\n\nQuestion: {query}\nAnswer:"
    result = qa_model(prompt, max_new_tokens=150)[0]['generated_text']

    return {
        "answer": result,
        "chunks": context
    }
