import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CaseService } from '../../../../core/services/case';

@Component({
  selector: 'app-case-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './case-form.html',
  styleUrl: './case-form.css',
})
export class CaseForm {
  private fb = inject(FormBuilder);
  private _caseService = inject(CaseService);
  private dialogRef = inject(MatDialogRef<CaseForm>);

  saving = signal(false);

  form = this.fb.group({
    caseNumber: ['', Validators.required],
    clientName: ['', Validators.required],
    attorney: ['', Validators.required],
    subject: [''],
    court: [''],
    status: ['active'],
    description: [''],
    openingDate: [null as Date | null],
    dueDate: [null as Date | null],
  });

  subjects = ['Civil', 'Criminal', 'Labor', 'Commercial', 'Family', 'Administrative'];
  statuses = [
    { value: 'active', label: 'Active' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'closed', label: 'Closed' },
    { value: 'archived', label: 'Archived' },
  ];

  submit() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const raw = this.form.value;
    this._caseService.create({
      caseNumber: raw.caseNumber!,
      clientName: raw.clientName!,
      attorney: raw.attorney!,
      subject: raw.subject ?? undefined,
      court: raw.court ?? undefined,
      status: raw.status ?? 'active',
      description: raw.description ?? undefined,
      openingDate: raw.openingDate ? (raw.openingDate as Date).toISOString().split('T')[0] : undefined,
      dueDate: raw.dueDate ? (raw.dueDate as Date).toISOString().split('T')[0] : undefined,
    }).subscribe({
      next: () => { this.saving.set(false); this.dialogRef.close(true); },
      error: () => this.saving.set(false),
    });
  }

  close() { this.dialogRef.close(false); }
}
