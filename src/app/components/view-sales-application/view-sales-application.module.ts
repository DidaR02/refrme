import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewSalesApplicationComponent } from './view-sales-application.component'
import { SortableHeaderDirective } from './sortable.directive';


@NgModule({
  declarations: [ViewSalesApplicationComponent,SortableHeaderDirective],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [ViewSalesApplicationComponent],
  bootstrap: [ViewSalesApplicationComponent]
})
export class ViewSalesApplicationModule { }
