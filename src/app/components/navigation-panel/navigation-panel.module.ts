import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [NavigationPanelComponent],
  imports: [
    CommonModule,
    //BrowserModule
  ],
  bootstrap: [NavigationPanelComponent],
  exports: [NavigationPanelComponent],
  providers: []
})
export class NavigationPanelModule { }
