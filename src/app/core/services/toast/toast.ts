import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private snackBar = inject(MatSnackBar);

  success(message: string) {
    this.snackBar.open(`✓  ${message}`, '', {
      duration: 3000,
      panelClass: ['toast-success'],
    });
  }

  error(message: string) {
    this.snackBar.open(`✕  ${message}`, 'Dismiss', {
      duration: 5000,
      panelClass: ['toast-error'],
    });
  }

  info(message: string) {
    this.snackBar.open(message, '', {
      duration: 2500,
      panelClass: ['toast-info'],
    });
  }
}
