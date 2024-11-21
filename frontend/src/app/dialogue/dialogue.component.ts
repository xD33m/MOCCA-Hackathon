import { Component } from '@angular/core';
import { ImageGeneratorComponent } from '../image-generator/image-generator.component.js';
import { ImageHistoryComponent } from '../image-history/image-history.component.js';

@Component({
  selector: 'app-dialogue',
  imports: [ImageGeneratorComponent, ImageHistoryComponent],
  templateUrl: './dialogue.component.html',
  styleUrl: './dialogue.component.scss'
})
export class DialogueComponent {

}
