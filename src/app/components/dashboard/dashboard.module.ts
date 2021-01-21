import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component'
import { NavigationPanelModule } from '../navigation-panel/navigation-panel.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    //BrowserModule,
    NavigationPanelModule
  ],
  bootstrap: [DashboardComponent],
  exports: [DashboardComponent],
  providers: []
})
export class DashboardModule { }
