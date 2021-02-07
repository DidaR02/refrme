import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesApplicationFormComponent } from './sales-application-form.component';

describe('SalesApplicationFormComponent', () => {
  let component: SalesApplicationFormComponent;
  let fixture: ComponentFixture<SalesApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesApplicationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
