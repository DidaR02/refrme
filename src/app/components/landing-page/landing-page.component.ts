import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageDisplayList } from 'src/app/models/Settings/IPageDisplaySettings';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { FireBaseCrudService } from 'src/app/service/authentication/fire-base-crud.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(public authService: AuthenticationService,
    public router: Router,
    public fsCrud: FireBaseCrudService) {

    // let displayPageList = JSON.parse(localStorage.getItem('displayPages') as PageDisplayList | any);
    // if (!displayPageList || displayPageList.length < 1)
    // {
    //   this.fsCrud.getDisaplayPages();
    // }
  }

  ngOnInit(): void {
  }

  redirectToLogin()
  {
    this.router.navigate(['login']);
  }

  redirectToRegister()
  {
    this.router.navigate(['join']);
  }

  redirectToHome()
  {
    this.router.navigate(['home']);
  }
}
