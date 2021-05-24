import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationTopPanelComponent } from './navigation-top-panel.component';

describe('NavigationTopPanelComponent', () => {
  let component: NavigationTopPanelComponent;
  let fixture: ComponentFixture<NavigationTopPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationTopPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationTopPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
