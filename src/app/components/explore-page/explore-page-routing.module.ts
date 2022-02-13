import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExplorePageComponent } from './explore-page.component';

const routes: Routes = [
  {
    path: '', component: ExplorePageComponent
  }
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ExplorePageRoutingModule { }
