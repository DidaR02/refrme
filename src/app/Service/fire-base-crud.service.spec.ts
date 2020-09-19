import { TestBed } from '@angular/core/testing';

import { FireBaseCrudService } from './fire-base-crud.service';

describe('FireBaseCrudService', () => {
  let service: FireBaseCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireBaseCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
