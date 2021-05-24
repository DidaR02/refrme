import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewSalesApplicationComponent } from './view-sales-application.component';

const routes: Routes = [
  { path: '', component: ViewSalesApplicationComponent},
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ViewSalesApplicationRoutingModule { }