// src/app/services/image.service.ts
import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  public currentImageUrl: WritableSignal<string> = signal('');
  private imageUrls: string[] = [];
  private readonly storageKey = 'generatedImages';

  constructor(private http: HttpClient) {
    this.loadImagesFromStorage();
  }

  private loadImagesFromStorage() {
    const savedImages = localStorage.getItem(this.storageKey);
    const imageUrls: string[] = [
      'https://via.assets.so/game.jpg?id=1&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=2&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=3&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=4&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=5&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=6&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=7&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=8&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=9&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=10&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=11&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=12&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=13&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=14&w=680&h=382&tc=blue&bg=#cecece',
      'https://via.assets.so/game.jpg?id=15&w=680&h=382&tc=blue&bg=#cecece',
    ];
    // if(savedImages) {
    //   this.imageUrls = JSON.parse(savedImages);
    // }
    if (imageUrls) {
      this.imageUrls = imageUrls;
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

    return this.http.post('/api/generate-image', { prompt }).pipe(
      map((response: any) => {
        const imageUrl: string = response.imageUrl;
        this.imageUrls.unshift(imageUrl);
        this.saveImagesToStorage();
        return imageUrl;
      }),
      catchError((error: string) => {
        console.error('Error generating image:', error);
        return error;
      })
    );
  }
}
