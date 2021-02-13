import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewSalesApplicationComponent } from './view-sales-application.component';
import { SortableHeaderDirective } from './sortable.directive';
import { ViewSalesApplicationRoutingModule } from './view-sales-application-routing.module';
import { RightClickMenuComponent } from '../right-click-menu/right-click-menu.component';

@NgModule({
  declarations: [
    ViewSalesApplicationComponent,
    SortableHeaderDirective,
    RightClickMenuComponent
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
    ViewSalesApplicationComponent,
    RightClickMenuComponent
  ],
  bootstrap: [
    ViewSalesApplicationComponent,RightClickMenuComponent]
})
export class ViewSalesApplicationModule { }
