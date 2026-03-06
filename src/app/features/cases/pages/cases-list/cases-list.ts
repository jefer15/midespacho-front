import { Component, OnInit, OnDestroy, inject, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CaseService } from '../../../../core/services/case/case';
import { Case } from '../../../../core/models/case.models';
import { CaseForm } from '../../components/case-form/case-form';
import { MatChipsModule } from '@angular/material/chips';
import { ToastService } from '../../../../core/services/toast/toast';

@Component({
  selector: 'app-cases-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: './cases-list.html',
  styleUrl: './cases-list.css',
})
// export class CasesList implements OnInit, OnDestroy {
//   private _caseService = inject(CaseService);
//   private router = inject(Router);
//   private dialog = inject(MatDialog);
//   private toast = inject(ToastService);
//   private destroy$ = new Subject<void>();

//   displayedColumns = ['caseNumber', 'clientName', 'attorney', 'subject', 'status', 'dueDate', 'actions'];
//   dataSource = signal<Case[]>([]);

//   totalItems = signal(0);
//   currentPage = signal(1);
//   pageSize = signal(10);
//   loading = signal(true);
//   deletingId = signal<number | null>(null);

//   searchControl = new FormControl('');

//   readonly deletableStatuses = ['closed', 'archived'];

//   statusMap: Record<string, { label: string; classes: string }> = {
//     active: {
//       label: 'Activo',
//       classes: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
//     },
//     under_review: {
//       label: 'En revisión',
//       classes: 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
//     },
//     closed: {
//       label: 'Cerrado',
//       classes: 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
//     },
//     archived: {
//       label: 'Archivado',
//       classes: 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
//     }
//   };

//   ngOnInit() {
//     this.load();
//     this.searchControl.valueChanges.pipe(
//       debounceTime(400),
//       distinctUntilChanged(),
//       takeUntil(this.destroy$),
//     ).subscribe(() => {
//       this.currentPage.set(1);
//       this.load();
//     });
//   }

//   ngOnDestroy() {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   load() {
//     this.loading.set(true);

//     this._caseService.getAll(
//       this.currentPage(),
//       this.pageSize(),
//       this.searchControl.value ?? ''
//     )
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (res) => {
//           this.dataSource.set(res.data);
//           this.totalItems.set(res.total);
//           this.loading.set(false);
//         },
//         error: () => this.loading.set(false),
//       });
//   }

//   onPageChange(event: PageEvent) {
//     this.currentPage.set(event.pageIndex + 1);
//     this.pageSize.set(event.pageSize);
//     this.load();
//   }

//   create() {
//     this.dialog.open(CaseForm, {
//       width: '560px',
//       panelClass: 'dark-dialog',
//       data: { mode: 'create' },
//     }).afterClosed().subscribe(result => { if (result) this.load(); });
//   }

//   edit(row: Case) {
//     this.dialog.open(CaseForm, {
//       width: '560px',
//       panelClass: 'dark-dialog',
//       data: { mode: 'edit', case: row },
//     }).afterClosed().subscribe(result => { if (result) this.load(); });
//   }

//   viewCase(id: number) { this.router.navigate(['/cases', id]); }

//   canDelete(status: string): boolean {
//     return this.deletableStatuses.includes(status);
//   }

//   deleteCase(row: Case) {
//     if (!this.canDelete(row.status)) return;
//     this.deletingId.set(row.id);
//     this._caseService.remove(row.id).subscribe({
//       next: () => {
//         this.deletingId.set(null);
//         this.toast.success('Expediente eliminado exitosamente');
//         this.load();
//       },
//       error: () => {
//         this.deletingId.set(null);
//         this.toast.error('Error al eliminar expediente');
//       }
//     });
//   }

//   getStatus(status: string) {
//     return this.statusMap[status] ?? this.statusMap['active'];
//   }
// }
export class CasesList implements OnInit, OnDestroy {

  private caseService = inject(CaseService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  private destroy$ = new Subject<void>();

  displayedColumns = [
    'caseNumber',
    'clientName',
    'attorney',
    'subject',
    'status',
    'dueDate',
    'actions'
  ];

  cases = signal<Case[]>([]);
  totalItems = signal(0);
  currentPage = signal(1);
  pageSize = signal(10);

  loading = signal(true);
  deletingId = signal<number | null>(null);

  searchControl = new FormControl('');

  readonly deletableStatuses = ['closed', 'archived'];

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
    }
  };

  ngOnInit() {
    this.load();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage.set(1);
        this.load();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get dataSource() {
    return this.cases();
  }

  load() {
    this.loading.set(true);

    this.caseService
      .getAll(
        this.currentPage(),
        this.pageSize(),
        this.searchControl.value ?? ''
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.cases.set(res.data);
          this.totalItems.set(res.total);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.toast.error('Error cargando casos');
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  create() {
    this.dialog.open(CaseForm, {
      width: '560px',
      panelClass: 'dark-dialog',
      data: { mode: 'create' }
    })
      .afterClosed()
      .subscribe(result => {
        if (result) this.load();
      });
  }

  edit(row: Case) {
    this.dialog.open(CaseForm, {
      width: '560px',
      panelClass: 'dark-dialog',
      data: { mode: 'edit', case: row }
    })
      .afterClosed()
      .subscribe(result => {
        if (result) this.load();
      });
  }

  viewCase(id: number) {
    this.router.navigate(['/cases', id]);
  }

  canDelete(status: string): boolean {
    return this.deletableStatuses.includes(status);
  }

  deleteCase(row: Case) {

    if (!this.canDelete(row.status)) return;

    this.deletingId.set(row.id);

    this.caseService
      .remove(row.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.deletingId.set(null);
          this.toast.success('Expediente eliminado exitosamente');
          this.load();
        },
        error: () => {
          this.deletingId.set(null);
          this.toast.error('Error al eliminar expediente');
        }
      });
  }

  getStatus(status: string) {
    return this.statusMap[status] ?? this.statusMap['active'];
  }
}