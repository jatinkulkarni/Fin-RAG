import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploadSuccess = false;
  loading = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadSuccess = false;
  }

  onUpload() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.loading = true;
    this.http.post('http://localhost:8000/upload', formData).subscribe({
      next: (res: any) => {
        localStorage.setItem('doc_id', res.doc_id);
        this.uploadSuccess = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.loading = false;
      },
    });
  }
}
