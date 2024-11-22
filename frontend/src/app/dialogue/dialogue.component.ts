import { Component, EventEmitter, Output } from '@angular/core';
import { VoiceCommandService } from '../services/voice-command.service';
import { ChristmasComponent } from '../christmas/christmas.component';
import { ImageGeneratorComponent } from '../image-generator/image-generator.component';
import { ImageHistoryComponent } from '../image-history/image-history.component';

@Component({
  selector: 'app-dialogue',
  imports: [ImageGeneratorComponent, ImageHistoryComponent, ChristmasComponent],
  templateUrl: './dialogue.component.html',
  styleUrl: './dialogue.component.scss',
})
export class DialogueComponent {
  @Output() commandChange = new EventEmitter<string>();

  constructor(public voiceService: VoiceCommandService) {
    this.voiceService.command$.subscribe((command) => {
      this.commandChange.emit(command);
    });
  }

  toggleListening(): void {
    if (this.voiceService.isListening) {
      this.voiceService.stopListening();
    } else {
      this.voiceService.startListening();
    }
  }
}
