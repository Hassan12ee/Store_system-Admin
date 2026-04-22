import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-image-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-image-edit.component.html',
  styleUrl: './product-image-edit.component.scss'
})
export class ProductImageEditComponent {

 @Input() images: string[] = [];
  @Input() mainIndex: number = 0;

  @Output() mainChanged = new EventEmitter<number>();
  @Output() imageDeleted = new EventEmitter<number>();
  @Output() imagesAdded = new EventEmitter<File[]>();

  dropActive = false;
  lightboxImage: string | null = null;

  get displayThumbs() {
    const imgs = this.images.filter((_, i) => i !== this.mainIndex);
    return imgs.slice(0, 4);
  }

  get extraCount() {
    return this.images.length - (1 + this.displayThumbs.length);
  }

  /** Make image main */
  setMain(index: number) {
    this.mainIndex = index;
    this.mainChanged.emit(index);
  }

  /** Delete image */
  deleteImage(index: number) {
    this.imageDeleted.emit(index);
  }

  /** Upload from input */
  uploadImages(event: any) {
    const files: File[] = Array.from(event.target.files);
    this.imagesAdded.emit(files);
  }

  /** Drag & Drop logic */
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dropActive = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dropActive = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dropActive = false;

    const files = Array.from(event.dataTransfer?.files ?? []);
    this.imagesAdded.emit(files as File[]);
  }

  /** Lightbox */
  openLightbox(img: string) {
    this.lightboxImage = img;
  }

  closeLightbox() {
    this.lightboxImage = null;
  }
}