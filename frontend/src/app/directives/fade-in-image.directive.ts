import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFadeInImage]',
})
export class FadeInImageDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Define a imagem invisível inicialmente
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity 2s');
  }

  @HostListener('load') onLoad() {
    // Aplica o efeito fade-in após a imagem ser carregada
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
  }
}
