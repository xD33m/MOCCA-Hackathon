// src/app/services/image.service.ts
import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Image } from '../models/image';
@Injectable({
  providedIn: 'root',
})
export class ImageService {
  public currentImage: WritableSignal<Image> = signal({
    prompt: '',
    url: '',
  });
  private imageUrls: WritableSignal<Image[]> = signal([]);
  private readonly storageKey = 'generatedImages';

  constructor(private apiService: ApiService) {
    this.loadImagesFromStorage();
  }

  private loadImagesFromStorage() {
    const savedImages = localStorage.getItem(this.storageKey);
    if (savedImages) {
      this.imageUrls.set(JSON.parse(savedImages));
    }
  }

  private saveImagesToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.imageUrls()));
  }

  getImages(): Image[] {
    return this.imageUrls();
  }

  generateImage(prompt: string): Observable<string> {
    if (!prompt.trim()) {
      return of('Prompt cannot be empty.');
    }

    return this.apiService.generateImage(prompt).pipe(
      map((response: any) => {
        const imageUrl: string = response.imageUrl;
        this.imageUrls.set([{ url: imageUrl, prompt }, ...this.imageUrls()]);
        this.saveImagesToStorage();
        this.currentImage.set({ url: imageUrl, prompt });
        return imageUrl;
      }),
      catchError((error: string) => {
        console.error('Error generating image:', error);
        return error;
      })
    );
  }

  generateImageFromDrawing(base64Image: string): Observable<string> {
    return this.apiService.generateImageFromDrawing(base64Image).pipe(
      map((response: any) => {
        const imageUrl = response.imageUrl;
        const imageToSave = { url: imageUrl, prompt: 'ChatGPTs Creation' };
        this.imageUrls.set([imageToSave, ...this.imageUrls()]);
        this.saveImagesToStorage();
        this.currentImage.set(imageToSave);
        return imageUrl;
      }),
      catchError((error: string) => {
        console.error('Error generating image from drawing:', error);
        return error;
      })
    );
  }

  clearImages() {
    this.imageUrls.set([]);
    this.saveImagesToStorage();
  }
}
