import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseFileBatch } from './case-file-batch';

describe('CaseFileBatch', () => {
  let component: CaseFileBatch;
  let fixture: ComponentFixture<CaseFileBatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseFileBatch],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseFileBatch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
