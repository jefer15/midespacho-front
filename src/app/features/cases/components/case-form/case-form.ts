import { Component, inject, signal, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CaseService } from '../../../../core/services/case/case';
import { CaseFormData, CreateCaseDto, UpdateCaseDto } from '../../../../core/models/case.models';
import { ToastService } from '../../../../core/services/toast/toast';

@Component({
  selector: 'app-case-form',
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatDatepickerModule, MatNativeDateModule,
  ],
  templateUrl: './case-form.html',
  styleUrl: './case-form.css',
})
export class CaseForm implements OnInit {
  private fb = inject(FormBuilder);
  private _caseService = inject(CaseService);
  private dialogRef = inject(MatDialogRef<CaseForm>);
  private toast = inject(ToastService);
  public data = inject<CaseFormData>(MAT_DIALOG_DATA);

  saving = signal(false);
  isEdit = false;

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

  subjects = ['Civil', 'Criminal', 'Labor', 'Commercial', 'Familiar', 'Administrativo'];
  statuses = [
    { value: 'active', label: 'Activo' },
    { value: 'under_review', label: 'En revisión' },
    { value: 'closed', label: 'Cerrado' },
    { value: 'archived', label: 'Archivado' },
  ];

  ngOnInit() {
    this.isEdit = this.data?.mode === 'edit';
    if (this.isEdit && this.data?.case) {
      this.form.patchValue({
        caseNumber: this.data.case.caseNumber,
        clientName: this.data.case.clientName,
        attorney: this.data.case.attorney,
        subject: this.data.case.subject,
        court: this.data.case.court,
        status: this.data.case.status,
        description: this.data.case.description,
        openingDate: this.data.case.openingDate ? new Date(this.data.case.openingDate) : null,
        dueDate: this.data.case.dueDate ? new Date(this.data.case.dueDate) : null,
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const raw = this.form.value;
    const dto = {
      caseNumber: raw.caseNumber!,
      clientName: raw.clientName!,
      attorney: raw.attorney!,
      subject: raw.subject || undefined,
      court: raw.court || undefined,
      status: raw.status ?? 'active',
      description: raw.description || undefined,
      openingDate: raw.openingDate ? (raw.openingDate as Date).toISOString().split('T')[0] : undefined,
      dueDate: raw.dueDate ? (raw.dueDate as Date).toISOString().split('T')[0] : undefined,
    };

    const request$ = this.isEdit
      ? this._caseService.update(this.data.case!.id, dto)
      : this._caseService.create(dto);

    const successMsg = this.isEdit
      ? "Expediente actualizado exitosamente"
      : "Expediente creado exitosamente";

    request$.subscribe({
      next: () => {
        this.toast.success(successMsg);
        this.saving.set(false);
        this.dialogRef.close(true);
      },
      error: () => {
        this.toast.error("Error al guardar el expediente");
        this.saving.set(false);
      },
    });
  }

  close() { this.dialogRef.close(false); }
}
