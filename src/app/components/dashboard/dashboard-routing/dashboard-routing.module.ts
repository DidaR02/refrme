import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/Service/guard/auth.guard';
import { DashboardComponent } from '../dashboard.component';
import { SalesApplicationFormComponent } from '../../sales-application-form/sales-application-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent, canActivateChild: [AuthGuard]},
  { path: 'newsales', component: SalesApplicationFormComponent}
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
export const routingComponents = [
  SalesApplicationFormComponent
]