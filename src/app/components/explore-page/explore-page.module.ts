import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule} from "@angular/material/list";
import { MatButtonModule} from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgModule } from "@angular/core";
import { ExplorePageComponent } from "./explore-page.component";
import { ExplorePageRoutingModule } from "./explore-page-routing.module";
import { CommonModule } from "@angular/common";
import { ScrollingModule } from "@angular/cdk/scrolling";


@NgModule({
  declarations: [
    ExplorePageComponent
  ],
  imports: [
    CommonModule,
    ExplorePageRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    ScrollingModule
  ],
  providers: [],
  bootstrap: [ExplorePageComponent]
})
export class ExplorePageModule { }
