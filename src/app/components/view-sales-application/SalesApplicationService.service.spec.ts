import { TestBed } from '@angular/core/testing';

import { SalesApplicationService } from './SalesApplicationService.service';

describe('SalesApplicationService', () => {
  let service: SalesApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
