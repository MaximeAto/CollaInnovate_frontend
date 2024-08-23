import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appActiveLink]',
  standalone: true
})
export class ActiveLinkDirective {

  constructor(private el: ElementRef, private renderer: Renderer2, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveLink();
    });
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    console.log('Link clicked:', this.el.nativeElement); // Debug log
    const links = this.el.nativeElement.parentElement.querySelectorAll('a');
    links.forEach((link: HTMLElement) => {
      this.renderer.removeClass(link, 'active');
    });
    this.renderer.addClass(this.el.nativeElement, 'active');
  }

  private updateActiveLink() {
    const links = this.el.nativeElement.parentElement.querySelectorAll('a');
    links.forEach((link: HTMLElement) => {
      this.renderer.removeClass(link, 'active');
      if (link.getAttribute('routerLink') === this.router.url) {
        console.log('Active link found:', link); // Debug log
        this.renderer.addClass(link, 'active');
      }
    });
  }
}
