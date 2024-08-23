import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClickOutsideDirective } from './click-outside.directive';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,ClickOutsideDirective,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  
  constructor(private router: Router) {}

  isMenuOpened: boolean = false;
  toggleMenu() {
    this.isMenuOpened = !this.isMenuOpened;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  clickedOutside() {
    if(this.isMenuOpened== true){
      this.isMenuOpened= false;
    }
  }
}
