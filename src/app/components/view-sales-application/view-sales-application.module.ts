import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewSalesApplicationComponent } from './view-sales-application.component';
import { SortableHeaderDirective } from './sortable.directive';
import { ViewSalesApplicationRoutingModule } from './view-sales-application-routing.module';

@NgModule({
  declarations: [
    ViewSalesApplicationComponent,
    SortableHeaderDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ViewSalesApplicationRoutingModule
  ],
  exports: [
    CommonModule,
    ViewSalesApplicationComponent
  ],
  bootstrap: [
    ViewSalesApplicationComponent]
})
export class ViewSalesApplicationModule { }
