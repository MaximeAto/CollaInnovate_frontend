import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  show = false;
  message = 'Hello, world! This is a toast message.';

  constructor() {}

  showToast(message: string) {
    this.message = message;
    this.show = true;
    setTimeout(() => this.hide(), 3000); // Hide the toast after 3 seconds
  }

  hide() {
    this.show = false;
  }
}
