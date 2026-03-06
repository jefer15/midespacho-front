import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Case, CreateCaseDto, FileBatch, PaginatedCases, UpdateCaseDto } from '../../models/case.models';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  private readonly apiUrl = `${environment.uri}/cases`;
  private http = inject(HttpClient);

  getAll(page = 1, pageSize = 10, search = ''): Observable<PaginatedCases> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    if (search?.trim()) params = params.set('search', search.trim());
    return this.http.get<PaginatedCases>(this.apiUrl, { params });
  }

  getOne(id: number): Observable<Case> {
    return this.http.get<Case>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateCaseDto): Observable<Case> {
    return this.http.post<Case>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateCaseDto): Observable<Case> {
    return this.http.patch<Case>(`${this.apiUrl}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadBatch(caseId: number, files: File[], title: string, description: string): Observable<FileBatch> {
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    files.forEach(f => form.append('files', f));
    return this.http.post<FileBatch>(`${this.apiUrl}/${caseId}/batches`, form);
  }

  deleteBatch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/batches/${id}`);
  }

  deleteFile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/files/${id}`);
  }

}
