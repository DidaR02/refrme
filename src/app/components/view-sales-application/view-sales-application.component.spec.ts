import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalesApplicationComponent } from './view-sales-application.component';

describe('ViewSalesApplicationComponent', () => {
  let component: ViewSalesApplicationComponent;
  let fixture: ComponentFixture<ViewSalesApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSalesApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalesApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
