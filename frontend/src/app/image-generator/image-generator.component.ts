import { Component, OnInit, ViewChild, input, output } from '@angular/core';
import { ImageService } from '../services/image-service.service.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Image } from '../models/image.js';
import { CanvasComponent } from '../canvas/canvas.component.js';
@Component({
  selector: 'app-image-generator',
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    CanvasComponent,
  ],
  templateUrl: './image-generator.component.html',
  styleUrl: './image-generator.component.scss',
})
export class ImageGeneratorComponent implements OnInit {
  @ViewChild(CanvasComponent) canvasComponent: CanvasComponent | undefined;
  readonly drawingEnabled = input<boolean>(false);
  resetDrawingMode = output<void>();
  base64Image: string = '';
  prompt: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  get currentImage(): Image {
    return this.imageService.currentImage();
  }
  constructor(private imageService: ImageService) {}

  ngOnInit() {}

  onSubmit() {
    if (this.drawingEnabled() && !this.base64Image) {
      this.errorMessage = 'Please draw an image first.';
      return;
    }

    if (!this.prompt.trim() && !this.drawingEnabled()) {
      this.errorMessage = 'Prompt cannot be empty.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.drawingEnabled()) {
      this.imageService.generateImageFromDrawing(this.base64Image).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (error: string) => {
          this.isLoading = false;
          this.errorMessage = 'Error generating image';
          console.error(error);
        },
        complete: () => {
          this.resetDrawingMode.emit();
        },
      });
      return;
    }

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

  updateDrawing(base64image: string) {
    this.base64Image = base64image;
  }

  clearDrawing() {
    this.canvasComponent?.clearCanvas();
  }
}
