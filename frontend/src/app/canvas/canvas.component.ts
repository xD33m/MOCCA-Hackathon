import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Output,
  output,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-canvas',
  template: '<div class="bg"><canvas #canvas></canvas></div>',
  styles: [
    'canvas { border: 1px solid #000; background: transparent}',
    '.bg { background: #fff; }',
  ],
})
export class CanvasComponent implements AfterViewInit {
  base64Image = output<string>();
  @ViewChild('canvas') public canvas: ElementRef | undefined;

  @Input() public width = 512;
  @Input() public height = 512;

  private cx: CanvasRenderingContext2D | null | undefined;

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas?.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx!.lineWidth = 3;
    this.cx!.lineCap = 'round';
    this.cx!.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }

  public clearCanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas?.nativeElement;
    this.cx?.clearRect(0, 0, canvasEl.width, canvasEl.height);
    this.base64Image.emit('');
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove').pipe(
            // we'll stop (and unsubscribe) once the user releases the mouse
            // this will trigger a 'mouseup' event
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
            // pairwise lets us get the previous value to draw a line from
            // the previous point to the current point
            pairwise()
          );
        })
      )
      .subscribe((res: any) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top,
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top,
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
        this.createBase64Image();
      });
  }

  private drawOnCanvas(
    prevPos: { x: number; y: number },
    currentPos: { x: number; y: number }
  ) {
    if (!this.cx) {
      return;
    }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  private createBase64Image() {
    const canvasEl: HTMLCanvasElement = this.canvas?.nativeElement;
    const dataUrl = canvasEl.toDataURL('image/png');
    const base64Image = dataUrl.replace(/^data:image\/png;base64,/, '');
    this.base64Image.emit(base64Image);
  }
}
