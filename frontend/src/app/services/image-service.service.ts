// src/app/services/image.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageUrls: string[] = [];
  private readonly storageKey = 'generatedImages';

  constructor(private http: HttpClient) {
    this.loadImagesFromStorage();
  }

  private loadImagesFromStorage() {
    const savedImages = localStorage.getItem(this.storageKey);
    if (savedImages) {
      this.imageUrls = JSON.parse(savedImages);
    }
  }

  private saveImagesToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.imageUrls));
  }

  getImages(): string[] {
    return this.imageUrls;
  }

  generateImage(prompt: string): Observable<string> {
    if (!prompt.trim()) {
      return of('Prompt cannot be empty.');
    }

    return this.http.post('/api/generate-image', { prompt }).pipe(map(
      (response: any) => {
        const imageUrl: string = response.imageUrl;
        this.imageUrls.unshift(imageUrl);
        this.saveImagesToStorage();
        return imageUrl;
      }),
      catchError((error: string) => {
        console.error('Error generating image:', error);
        return error;
      }));
  }

  clearHistory() {
    this.imageUrls = [];
    localStorage.removeItem(this.storageKey);
  }
}
