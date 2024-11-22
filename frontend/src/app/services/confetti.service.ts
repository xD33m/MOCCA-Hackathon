import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
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
