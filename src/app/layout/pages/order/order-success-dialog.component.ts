import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'order-success-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  template: `
    <h2 mat-dialog-title>Order Submitted Successfully</h2>
    <mat-dialog-content>
      <div *ngIf="data">
        <p><strong>Order ID:</strong> {{ data.order_id }}</p>
        <p><strong>User ID:</strong> {{ data.user_id }}</p>
        <p><strong>Address ID:</strong> {{ data.address_id }}</p>
        <div *ngIf="data.login_info">
          <p><strong>Site URL:</strong> {{ data.login_info.site_url }}</p>
          <p><strong>Phone:</strong> {{ data.login_info.phone }}</p>
          <p><strong>Password:</strong> {{ data.login_info.password }}</p>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      text-align: center;
    }
    mat-dialog-content {
      min-width: 300px;
    }
  `]
})
export class OrderSuccessDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}