import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms'; // Reactive form services
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutingModule } from './dashboard-routing.module'
import { DashboardComponent } from './dashboard.component';
import { ViewSalesApplicationModule } from '../view-sales-application/view-sales-application.module';
import { RightClickMenuComponent } from '../right-click-menu/right-click-menu.component';

@NgModule({
  declarations: [
    DashboardComponent,
    //RightClickMenuComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ViewSalesApplicationModule
  ],
  bootstrap: [],
  exports: [],
  providers: [],
  entryComponents: []
})
export class DashboardModule { }
