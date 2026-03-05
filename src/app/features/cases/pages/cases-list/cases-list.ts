import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CaseService } from '../../../../core/services/case';
import { Case } from '../../../../core/models/case.models';
import { CaseForm } from '../../components/case-form/case-form';

@Component({
  selector: 'app-cases-list',
  imports: [
    CommonModule,
    DatePipe,
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
  ],
  templateUrl: './cases-list.html',
  styleUrl: './cases-list.css',
})
export class CasesList implements OnInit {
  private _caseService = inject(CaseService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  displayedColumns = ['caseNumber', 'clientName', 'attorney', 'subject', 'status', 'dueDate', 'actions'];
  dataSource = new MatTableDataSource<Case>();
  loading = signal(true);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  statusMap: Record<string, { label: string; classes: string }> = {
    active:       { label: 'Active',       classes: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
    under_review: { label: 'Under Review', classes: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
    closed:       { label: 'Closed',       classes: 'bg-slate-500/15 text-slate-400 border border-slate-500/30' },
    archived:     { label: 'Archived',     classes: 'bg-rose-500/15 text-rose-400 border border-rose-500/30' },
  };

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this._caseService.getAll().subscribe({
      next: (cases) => {
        this.dataSource.data = cases;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  openCreateDialog() {
    const ref = this.dialog.open(CaseForm, {
      width: '560px',
      panelClass: 'dark-dialog',
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  viewCase(id: number) {
    this.router.navigate(['/cases', id]);
  }

  getStatus(status: string) {
    return this.statusMap[status] ?? this.statusMap['active'];
  }
}
