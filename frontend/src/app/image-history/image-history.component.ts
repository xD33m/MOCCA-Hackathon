import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../services/image-service.service.js';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-image-history',
  imports: [FormsModule, CommonModule, MatButtonModule],
  templateUrl: './image-history.component.html',
  styleUrl: './image-history.component.scss',
})
export class ImageHistoryComponent {
  constructor(private imageService: ImageService) {}

  get images(): string[] {
    return this.imageService.getImages();
  }

  show(index: number) {
    this.imageService.currentImageUrl.set(this.images[index]);
  }

  clearImages() {
    this.imageService.clearImages();
  }
}
