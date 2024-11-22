import {
  Component,
  ElementRef,
  OnInit,
  output,
  Renderer2,
} from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FloatingImageComponent } from '../floating-image/floating-image.component';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../services/image-service.service';

@Component({
  selector: 'app-christmas',
  standalone: true,
  imports: [MatSlideToggleModule, FloatingImageComponent, FormsModule],
  templateUrl: './christmas.component.html',
  styleUrls: ['./christmas.component.scss'],
})
export class ChristmasComponent implements OnInit {
  isChristmasEnabled = output<boolean>();
  chistmasEnabled: boolean = false;
  images = this.getNumberArray(1, 20);
  private animationFrameId: number | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {}

  getNumberArray(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
  }

  toggleRgb(): void {
    const rgbText: HTMLElement =
      this.el.nativeElement.querySelector('.rgb-text');

    if (this.chistmasEnabled && rgbText) {
      this.activateRgbEffect(rgbText);
      this.imageService.loadChristmas.set(true);
    } else {
      this.deactivateRgbEffect();
      this.imageService.loadChristmas.set(false);
    }
  }

  private activateRgbEffect(rgbText: HTMLElement): void {
    const textContent = rgbText.innerText;
    rgbText.innerHTML = '';

    // Wrap each character in a span
    Array.from(textContent).forEach((char) => {
      const span = this.renderer.createElement('span');
      const textNode = this.renderer.createText(char);
      this.renderer.appendChild(span, textNode);
      this.renderer.appendChild(rgbText, span);
    });

    const nodes = rgbText.querySelectorAll('span');
    const hues: number[] = Array.from(nodes).map((_, i, arr) =>
      Math.round(i * (360 / arr.length))
    );

    const animate = () => {
      hues.forEach((h, i) => {
        hues[i] = (h + 1) % 360; // Increment hue and wrap around at 360
        (nodes[i] as HTMLElement).style.color = `hsl(${hues[i]}, 100%, 50%)`;
      });
      this.animationFrameId = window.requestAnimationFrame(animate);
    };

    this.animationFrameId = window.requestAnimationFrame(animate);
  }

  private deactivateRgbEffect(): void {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    const rgbText: HTMLElement =
      this.el.nativeElement.querySelector('.rgb-text');
    if (rgbText) {
      rgbText.style.color = '';
      rgbText.innerHTML = 'Christmas Mode!';
    }
  }
}
