import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoiceCommandService {
  private recognition: SpeechRecognition | null = null;
  public isListening = false;
  command$ = new BehaviorSubject('');

  constructor(private ngZone: NgZone) {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition!.lang = 'en-GB';
      this.recognition!.continuous = false;
      this.recognition!.interimResults = false;

      this.recognition!.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        this.ngZone.run(() => this.handleCommand(transcript));
      };

      this.recognition!.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  }

  startListening(): void {
    if (this.recognition) {
      this.isListening = true;
      console.log('Speech recognition started.');
      this.recognition.start();
    }
  }

  stopListening(): void {
    if (this.recognition) {
      this.isListening = false;
      console.log('Speech recognition stopped.');
      this.recognition.stop();
    }
  }

  private handleCommand(command: string): void {
    console.log('Recognized command:', command);
    this.command$.next(command);
    this.stopListening();
  }
}
