import { Component } from '@angular/core';
import { UploadComponent } from './upload/upload.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UploadComponent, ChatComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend-angular';
}
