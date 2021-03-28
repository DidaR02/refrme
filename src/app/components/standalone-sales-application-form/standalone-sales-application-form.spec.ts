import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandaloneSalesApplicationFormComponent } from './standalone-sales-application-form.component';

describe('StandaloneSalesApplicationFormComponent', () => {
  let component: StandaloneSalesApplicationFormComponent;
  let fixture: ComponentFixture<StandaloneSalesApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandaloneSalesApplicationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandaloneSalesApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
