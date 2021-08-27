import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseCrudService } from './service/authentication/fire-base-crud.service';
import { PageDisplayList } from "./models/Settings/IPageDisplaySettings"

declare var gnMenu: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  title = 'refrme';
  applicationFormState: string = "editSales";

  displayPages: PageDisplayList[] = []

  private pageName : string = "appRoot"
  constructor(private router: Router, public fsCrud: FireBaseCrudService){}
  ngOnInit() {

    let displayPageList = JSON.parse(localStorage.getItem('displayPages') as PageDisplayList | any);
    if (!displayPageList || displayPageList.length < 1) {
      this.fsCrud.getDisaplayPages();
    }
  }

  //For External Use only
  async clickNavigateHandler(url: string)
  {
    if(url.length > 0)
    {
      switch(url){
        case "newSales": {
          this.router.navigate(['newsales']);
          break;
        }
        case "viewSales": {
          this.router.navigate(['viewsales']);
          break;
        }
        case "userProfile": {
          this.router.navigate(['userProfile']);
          break;
        }
      }
    }
  }
}
