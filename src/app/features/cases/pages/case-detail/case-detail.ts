import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CaseService } from '../../../../core/services/case/case';
import { Case, CaseFile, FileBatch } from '../../../../core/models/case.models';
import { CaseFileBatch } from '../../components/case-file-batch/case-file-batch';
import { ToastService } from '../../../../core/services/toast/toast';

@Component({
  selector: 'app-case-detail',
  imports: [
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './case-detail.html',
  styleUrl: './case-detail.css',
})
export class CaseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private _caseService = inject(CaseService);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  caseData = signal<Case | null>(null);
  loading = signal(true);
  deletingBatchId = signal<number | null>(null);
  deletingFileId = signal<number | null>(null);

  readonly editableStatuses = ['active', 'under_review'];

  statusMap: Record<string, { label: string; classes: string }> = {
    active: {
      label: 'Activo',
      classes: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
    },
    under_review: {
      label: 'En revisión',
      classes: 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
    },
    closed: {
      label: 'Cerrado',
      classes: 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
    },
    archived: {
      label: 'Archivado',
      classes: 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
    },
  };

  totalFiles = computed(() =>
    this.caseData()?.batches?.reduce((acc: number, b: FileBatch) => acc + (b.files?.length ?? 0), 0) ?? 0
  );

  canEdit = computed(() =>
    this.editableStatuses.includes(this.caseData()?.status ?? '')
  );

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  load(id: number) {
    this.loading.set(true);
    this._caseService.getOne(id).subscribe({
      next: (c) => { this.caseData.set(c); this.loading.set(false); },
      error: () => { this.loading.set(false); this.router.navigate(['/cases']); },
    });
  }

  openUploadDialog() {
    const c = this.caseData();
    if (!c) return;
    this.dialog.open(CaseFileBatch, {
      width: '560px',
      panelClass: 'dark-dialog',
      data: { caseId: c.id, caseNumber: c.caseNumber },
    }).afterClosed().subscribe(result => {
      if (result) this.load(c.id);
    });
  }

  deleteBatch(batchId: number) {
    const c = this.caseData();
    if (!c) return;
    this.deletingBatchId.set(batchId);
    this._caseService.deleteBatch(batchId).subscribe({
      next: () => {
        this.caseData.set({ ...c, batches: c.batches.filter(b => b.id !== batchId) });
        this.deletingBatchId.set(null);
        this.toast.success('Archivos eliminados exitosamente');
      },
      error: () => {
        this.deletingBatchId.set(null);
        this.toast.error('Error al eliminar archivos');
      },
    });
  }

  deleteFile(fileId: number) {
    const c = this.caseData();
    if (!c) return;
    this.deletingFileId.set(fileId);
    this._caseService.deleteFile(fileId).subscribe({
      next: () => {
        this.caseData.set({
          ...c,
          batches: c.batches.map(b => ({
            ...b,
            files: b.files.filter((f: CaseFile) => f.id !== fileId),
          })),
        });
        this.deletingFileId.set(null);
        this.toast.success('Archivo eliminado exitosamente');
      },
      error: () => {
        this.deletingFileId.set(null);
        this.toast.error('Error al eliminar archivo');
      },
    });
  }

  getStatus(status: string) { return this.statusMap[status] ?? this.statusMap['active']; }

  formatBytes(b: number) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  iconForMime(mime: string) {
    if (mime?.includes('pdf')) return 'picture_as_pdf';
    if (mime?.includes('image')) return 'image';
    if (mime?.includes('word') || mime?.includes('document')) return 'description';
    if (mime?.includes('sheet') || mime?.includes('excel')) return 'table_chart';
    return 'insert_drive_file';
  }

  goBack() { this.router.navigate(['/cases']); }
}
