import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/image-service.service.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-generator',
  imports: [FormsModule, CommonModule],
  templateUrl: './image-generator.component.html',
  styleUrl: './image-generator.component.scss'
})
export class ImageGeneratorComponent implements OnInit {
  prompt: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  imageUrl: string = "";

  constructor(private imageService: ImageService) { }

  ngOnInit() {
    this.imageUrl = this.imageService.getImages()?.[0] ?? "https://preview.redd.it/swjlpm53dcp61.jpg?auto=webp&s=d50c5025e673641c28f0cb45cf0be387c1cf828f";
  }

  onSubmit() {
    if (!this.prompt.trim()) {
      this.errorMessage = 'Prompt cannot be empty.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.imageService.generateImage(this.prompt).subscribe({
      next: (imageUrl: string) => {
        this.isLoading = false;
        this.prompt = '';
      },
      error: (error: string) => {
        this.isLoading = false;
        this.errorMessage = 'Error generating image. Please try again.';
        console.error(error);
      }
    });
  }
}
