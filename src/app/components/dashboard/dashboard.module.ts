import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
//import { DashboardComponent } from './dashboard.component';
//import { SalesApplicationFormModule } from '../sales-application-form/sales-application-form.module';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms'; // Reactive form services
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [
    //DashboardRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    //SalesApplicationFormModule
  ],
  bootstrap: [],
  exports: [],
  providers: [],
  entryComponents: []
})
export class DashboardModule { }
