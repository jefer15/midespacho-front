import { Component, inject, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CaseService } from '../../../../core/services/case';

@Component({
  selector: 'app-case-file-batch',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './case-file-batch.html',
  styleUrl: './case-file-batch.css',
})
export class CaseFileBatch {
  private fb = inject(FormBuilder);
  private _caseService = inject(CaseService);
  private dialogRef = inject(MatDialogRef<CaseFileBatch>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { caseId: number; caseNumber: string }) { }

  uploading = signal(false);
  isDragOver = false;
  selectedFiles: File[] = [];

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
  });

  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragOver = true; }
  onDragLeave() { this.isDragOver = false; }
  onDrop(e: DragEvent) {
    e.preventDefault(); this.isDragOver = false;
    this.selectedFiles = [...this.selectedFiles, ...Array.from(e.dataTransfer?.files ?? [])];
  }
  onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) this.selectedFiles = [...this.selectedFiles, ...Array.from(input.files)];
  }
  removeFile(i: number) { this.selectedFiles.splice(i, 1); }

  formatBytes(b: number) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  submit() {
    if (this.form.invalid || !this.selectedFiles.length) return;
    this.uploading.set(true);
    const { title, description } = this.form.value;
    this._caseService.uploadBatch(this.data.caseId, this.selectedFiles, title!, description ?? '').subscribe({
      next: () => { this.uploading.set(false); this.dialogRef.close(true); },
      error: () => this.uploading.set(false),
    });
  }

  close() { this.dialogRef.close(false); }
}
