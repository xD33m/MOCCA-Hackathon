import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/image-service.service.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-image-generator',
  imports: [FormsModule, CommonModule, MatInputModule, MatButtonModule],
  templateUrl: './image-generator.component.html',
  styleUrl: './image-generator.component.scss',
})
export class ImageGeneratorComponent implements OnInit {
  prompt: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  get currentImageUrl(): string {
    return this.imageService.currentImageUrl();
  }
  constructor(private imageService: ImageService) {}

  ngOnInit() {}

  onSubmit() {
    if (!this.prompt.trim()) {
      this.errorMessage = 'Prompt cannot be empty.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.imageService.generateImage(this.prompt).subscribe({
      next: () => {
        this.isLoading = false;
        this.prompt = '';
      },
      error: (error: string) => {
        this.isLoading = false;
        this.errorMessage = 'Error generating image';
        console.error(error);
      },
    });
  }
}
