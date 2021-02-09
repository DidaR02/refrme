import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/Service/guard/auth.guard';
import { ViewSalesApplicationComponent } from './view-sales-application.component';

const routes: Routes = [
  { path: '', redirectTo: '/viewsales', pathMatch: 'full'},
  { path: 'viewsales', component: ViewSalesApplicationComponent},
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ViewSalesApplicationRoutingModule { }