export interface CaseFile {
  id: number;
  originalName: string;
  storedName: string;
  relativePath: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

export interface FileBatch {
  id: number;
  title: string;
  description: string;
  folderPath: string;
  files: CaseFile[];
  createdAt: string;
}

export interface Case {
  id: number;
  caseNumber: string;
  clientName: string;
  attorney: string;
  status: 'active' | 'under_review' | 'closed' | 'archived';
  description: string;
  court: string;
  subject: string;
  openingDate: string;
  dueDate: string;
  batches: FileBatch[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseDto {
  caseNumber: string;
  clientName: string;
  attorney: string;
  status?: string;
  description?: string;
  court?: string;
  subject?: string;
  openingDate?: string;
  dueDate?: string;
}

export interface UpdateCaseDto {
  caseNumber?: string;
  clientName?: string;
  attorney?: string;
  status?: string;
  description?: string;
  court?: string;
  subject?: string;
  openingDate?: string;
  dueDate?: string;
}
