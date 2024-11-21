import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../services/image-service.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-history',
  imports: [FormsModule, CommonModule],
  templateUrl: './image-history.component.html',
  styleUrl: './image-history.component.scss'
})
export class ImageHistoryComponent {
  imageUrls: string[] = [];

  constructor(private imageService: ImageService) {
    this.imageUrls = this.imageService.getImages().slice(1);
  }

  clearHistory() {
    this.imageService.clearHistory();
    this.imageUrls = [];
  }
}
