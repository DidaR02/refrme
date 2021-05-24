import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NavigationPanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  bootstrap: [NavigationPanelComponent],
  exports: [NavigationPanelComponent],
  providers: []
})
export class NavigationPanelModule { }
