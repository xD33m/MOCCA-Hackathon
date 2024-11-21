import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogueComponent } from './dialogue/dialogue.component';

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, FormsModule, DialogueComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'DaVinciDialogue';
  message: string = '';
  chats: { user: string; message: string }[] = [];
  responseLoading: boolean = false;

  prompt: string = '';
  imageUrl: string | null = null;
  constructor(private http: HttpClient) {
    this.http.get('/api/hello').subscribe((data) => {
      console.log(data);
    });
  }

  sendMessage() {
    if (!this.message || this.message.trim() === '') {
      return;
    }
    this.responseLoading = true;

    this.chats.push({ user: 'User', message: this.message });
    this.http.post<string>('/api/chat', { message: this.message }).subscribe({
      next: (data: string) => {
        this.chats.push({ user: 'ChatGPT', message: data });
        this.message = '';
        this.responseLoading = false;
      },
      error: (err: any) => {
        console.error('Error sending message', err);
        this.responseLoading = false;
      },
    });
  }

  onSubmit() {
    this.http.post('/api/generate-image', { prompt: this.prompt }).subscribe(
      (response: any) => {
        this.imageUrl = response.imageUrl;
      },
      (error) => {
        console.error('Error generating image:', error);
      }
    );
  }
}
