import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogueComponent } from './dialogue/dialogue.component';
import { ApiService } from './services/api.service';
import { ImageService } from './services/image-service.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, DialogueComponent],
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

  constructor(
    private apiService: ApiService,
    private imageService: ImageService
  ) {}

  sendMessage() {
    if (!this.message || this.message.trim() === '') {
      return;
    }
    this.responseLoading = true;

    this.chats.push({ user: 'User', message: this.message });
    this.apiService.sendMessage(this.message).subscribe({
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

  onSubmit(prompt: string) {
    this.prompt = prompt;
    console.log('Sending command ', prompt);

    this.apiService.generateImage(prompt).subscribe(
      (response: any) => {
        this.imageService.currentImageUrl.update(() => response.imageUrl);
      },
      (error: any) => {
        console.error('Error generating image:', error);
      }
    );
  }
}
