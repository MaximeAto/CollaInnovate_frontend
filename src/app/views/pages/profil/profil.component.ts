import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [ImageCropperComponent,CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {

  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

  coverImage = 'assets/images/pexels-pixabay-206388.jpg';
  profileImage = 'assets/images/pexels-pixabay-415829.jpg'; // Placeholder for profile
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  aspectRatio = 16 / 9; // Aspect ratio for the cover image
  roundCropper = false;

  onCoverImageChange(event: any): void {
    this.imageChangedEvent = event;
    this.aspectRatio = 16 / 9;
    this.roundCropper = false;
    this.showCropper = true;
  }

  onProfileImageChange(event: any): void {
    this.imageChangedEvent = event;
    this.aspectRatio = 1 / 1; // Circular crop for profile image
    this.roundCropper = true;
    this.showCropper = true;
  }

  onImageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  cropperReady() {
    // Cropper ready
  }

  saveCroppedImage() {
    if (this.roundCropper) {
      this.profileImage = this.croppedImage;
    } else {
      this.coverImage = this.croppedImage;
    }
    this.showCropper = false;
  }
}
