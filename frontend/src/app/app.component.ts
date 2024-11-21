import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DaVinciDialogue';

  constructor(private http: HttpClient) {
    this.http.get('/api/hello').subscribe(data => {
      console.log(data);
    });
  }
}
