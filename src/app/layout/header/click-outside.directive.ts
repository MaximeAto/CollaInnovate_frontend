import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, EventEmitter, ElementRef, Inject, OnDestroy, Output } from '@angular/core';
import { event } from 'jquery';
import { Subscription, filter, fromEvent } from 'rxjs';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective implements AfterViewInit,OnDestroy {
  @Output() clickOutside = new EventEmitter<any>();
  documentClickSubscription: Subscription | undefined;

  constructor(private element: ElementRef, @Inject(DOCUMENT) private document: Document) { }

  ngAfterViewInit(): void {
    this.documentClickSubscription = fromEvent(this.document, 'click').pipe(
      filter((event: Event) => {
        // Ensure the target element of the event is not inside the directive's element
        const target = event.target as HTMLElement;
        return !this.element.nativeElement.contains(target);
      })
    ).subscribe(() => {
      this.clickOutside.emit('clickOutside');

    });
  }

  ngOnDestroy(): void {
    if (this.documentClickSubscription) {
      this.documentClickSubscription.unsubscribe();
    }
  }

  isInside(elementToCheck: HTMLElement): boolean {
    return (elementToCheck === this.element.nativeElement || this.element.nativeElement.contains(elementToCheck) );
  }
  
}
