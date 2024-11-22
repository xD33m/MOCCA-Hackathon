import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/image-service.service.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import confetti from 'canvas-confetti';
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
        this.showConfetti();
      },
      error: (error: string) => {
        this.isLoading = false;
        this.errorMessage = 'Error generating image';
        console.error(error);
      },
    });
  }

  fire(particleRatio: number, opts: any) {
    const count = 200;
    const defaults = {
      origin: { y: 0.5 },
    };
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  showConfetti() {
    setTimeout(() => {
      this.fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      this.fire(0.2, {
        spread: 60,
      });
      this.fire(0.35, {
        spread: 100,
        scalar: 0.8,
      });
      this.fire(0.1, {
        spread: 120,
        startVelocity: 25,
        scalar: 1.2,
      });
      this.fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }, 500);
  }
}
