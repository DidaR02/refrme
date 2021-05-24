import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalesApplicationComponent } from './edit-sales-application.component';

describe('EditSalesApplicationComponent', () => {
  let component: EditSalesApplicationComponent;
  let fixture: ComponentFixture<EditSalesApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSalesApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSalesApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
