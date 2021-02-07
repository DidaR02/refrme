import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule, routingComponents } from './dashboard-routing/dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SalesApplicationFormComponent } from '../sales-application-form/sales-application-form.component'
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule  } from '@angular/forms'; // Reactive form services
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [DashboardComponent, SalesApplicationFormComponent, routingComponents],
  imports: [
    DashboardRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [DashboardComponent],
  exports: [],
  providers: [],
  entryComponents: []
})
export class DashboardModule { }
