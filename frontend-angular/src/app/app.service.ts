import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  uploadPDF(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  askQuestion(docId: string, question: string): Observable<any> {
    const formData = new FormData();
    formData.append('doc_id', docId);
    formData.append('question', question);
    return this.http.post(`${this.baseUrl}/query`, formData);
  }
}
