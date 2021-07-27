import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesApplicationFormComponent } from './sales-application-form.component'
import { FormsModule, ReactiveFormsModule  } from '@angular/forms'; // Reactive form services

@NgModule({
  declarations: [SalesApplicationFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [],
  bootstrap: [SalesApplicationFormComponent]
})
export class SalesApplicationFormModule { }
