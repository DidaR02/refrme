import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/Service/guard/auth.guard';
import { DashboardComponent } from './dashboard.component';
import { SalesApplicationFormComponent } from '../sales-application-form/sales-application-form.component';

const routes: Routes = [
  { path: '', component: DashboardComponent,
    children: [{
      path: 'newsales',
      component: SalesApplicationFormComponent
    },
    {
      path: 'viewsales',
      loadChildren: ()=> import('../view-sales-application/view-sales-application.module').then(viewSales => viewSales.ViewSalesApplicationModule)
    }],
    canActivateChild: [AuthGuard]}
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }