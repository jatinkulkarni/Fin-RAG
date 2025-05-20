import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  question: string = '';
  answer: string = '';
  loading = false;

  constructor(private http: HttpClient) {}

  askQuestion() {
    const docId = localStorage.getItem('doc_id');
    if (!docId || !this.question) return;

    const formData = new FormData();
    formData.append('doc_id', docId);
    formData.append('question', this.question);

    this.loading = true;
    this.http.post('http://localhost:8000/query', formData).subscribe({
      next: (res: any) => {
        this.answer = res.answer;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching answer', err);
        this.answer = 'An error occurred.';
        this.loading = false;
      },
    });
  }
}
