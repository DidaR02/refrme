import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesApplicationFormComponent } from './sales-application-form.component'
import { FormsModule, ReactiveFormsModule  } from '@angular/forms'; // Reactive form services
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [SalesApplicationFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [],
  bootstrap: [SalesApplicationFormComponent]
})
export class SalesApplicationFormModule { }
