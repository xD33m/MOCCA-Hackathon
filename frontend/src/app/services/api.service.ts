import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {
    this.http.get('/api/hello').subscribe((data) => {
      console.log(data);
    });
  }

  sendMessage(message: string) {
    return this.http.post<string>('/api/chat', { message });
  }

  generateImage(prompt: string) {
    return this.http.post('/api/generate-image', { prompt });
  }

  generateImageFromDrawing(image: string) {
    return this.http.post('/api/generate-image-from-drawing', { image });
  }
}
