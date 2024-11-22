import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-floating-image',
  template: `
    <img
      [src]="imageSrc"
      [style.transform]="transform"
      class="floating-image"
    />
  `,
  styles: [
    `
      .floating-image {
        position: fixed;
        width: 60px;
        height: 60px;
        pointer-events: none;
        transform-origin: center center;
      }
    `,
  ],
})
export class FloatingImageComponent implements OnInit {
  imageSrc: string = 'assets/your-image.png';
  posX: number = 0;
  posY: number = 0;
  velocityX: number = 1;
  velocityY: number = 1;
  windowWidth: number = window.innerWidth - 60;
  windowHeight: number = window.innerHeight - 120;

  currentRotation: number = 0;
  rotationTarget: number = 0;
  isRotating: boolean = false;
  rotationIncrement: number = 180;
  rotationSpeed: number = 1;

  imageList: string[] = [
    'assets/images/image-1.webp',
    'assets/images/image-2.webp',
    'assets/images/image-3.png',
  ];

  ngOnInit() {
    this.imageSrc =
      this.imageList[Math.floor(Math.random() * this.imageList.length)];
    this.initializeProperties();
    this.animate();
  }

  initializeProperties() {
    this.windowWidth = window.innerWidth - 60;
    this.windowHeight = window.innerHeight - 120;
    this.posX = Math.random() * this.windowWidth;
    this.posY = Math.random() * this.windowHeight;
    this.velocityX = Math.random() * 2 - 1;
    this.velocityY = Math.random() * 2 - 1;
    this.currentRotation = 0;
  }

  get transform() {
    return `translate(${this.posX}px, ${this.posY}px) rotate(${this.currentRotation}deg)`;
  }

  animate() {
    const step = () => {
      this.posX += this.velocityX;
      this.posY += this.velocityY;

      if (this.posX <= 0 || this.posX >= this.windowWidth) {
        this.velocityX *= -1;
        this.startRotation();
      }

      if (this.posY <= 0 || this.posY >= this.windowHeight) {
        this.velocityY *= -1;
        this.startRotation();
      }

      if (this.isRotating) {
        if (
          Math.abs(this.currentRotation - this.rotationTarget) <=
          this.rotationSpeed
        ) {
          this.currentRotation = this.rotationTarget % 360;
          this.isRotating = false;
        } else {
          const rotationDirection =
            this.rotationTarget > this.currentRotation ? 1 : -1;
          this.currentRotation += rotationDirection * this.rotationSpeed;
          this.currentRotation = (this.currentRotation + 360) % 360;
        }
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  startRotation() {
    const rotationIncrement =
      this.rotationIncrement *
      (Math.random() < 0.5 ? 1 : -1) *
      Math.random() *
      1.5;
    this.rotationTarget = (this.currentRotation + rotationIncrement) % 360;
    this.isRotating = true;
  }

  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth - 60;
    this.windowHeight = window.innerHeight - 120;
  }
}
