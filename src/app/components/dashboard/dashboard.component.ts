import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';
import { PageDisplayList } from 'src/app/models/Settings/IPageDisplaySettings';
import { SignedInUser } from 'src/app/models/userDetails/ISignedInUser';
import { User } from 'src/app/models/userDetails/IUser';
import { UserAccess } from 'src/app/models/userDetails/IUserAccess';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { FireBaseCrudService } from 'src/app/service/authentication/fire-base-crud.service';
import { UserManagerService } from 'src/app/service/authentication/userManager.service';
import { DataTypeConversionService } from 'src/app/service/shared/dataType-conversion.service';

declare var gnMenu: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public showOverlay = false;
  user: User;
  private userData: any;
  private userAccess: UserAccess;
  viewDashboard: boolean = true;
  displayPages: PageDisplayList[] = []
  private signedInUser: SignedInUser;

  constructor(private router: Router,
    public authService: AuthenticationService,
    public convertDataType: DataTypeConversionService,
    public userManagerService: UserManagerService,
    public fsCrud: FireBaseCrudService) {

    let displayPageList = JSON.parse(localStorage.getItem('displayPages') as PageDisplayList | any);
    if (!displayPageList || displayPageList.length < 1)
    {
      this.getDisaplayPages();
    }
    else
    {
      this.displayPages = displayPageList;
    }
    this.getUserInfo();
  }

   ngOnInit() {
    new gnMenu(document.getElementById('gn-menu'), undefined);
  }

   // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.showOverlay = true;
    }
    if (event instanceof NavigationEnd) {
      this.showOverlay = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.showOverlay = false;
    }
    if (event instanceof NavigationError) {
      this.showOverlay = false;
    }
  }

  async clickNavigateHandler(url: string)
  {
    if(url.length > 0)
    {
      switch(url){
        case "newSales": {
          this.router.navigate(['dashboard/newsales']);
          break;
        }
        case "viewSales": {
          this.router.navigate(['dashboard/viewsales']);
          break;
        }
        case "manageAccounts": {
          this.router.navigate(['dashboard/manageAccounts']);
          break;
        }
        case "userProfile": {
            this.router.navigate(['dashboard/userProfile']);
          break;
        }
      }
    }
  }

async getDisaplayPages()
  {
  await this.fsCrud.getDisaplayPages();
  }

  async getUserInfo()
  {
    await this.userManagerService.createSignInUser();

    if(this.authService.isLoggedIn)
    {
      if(!this.userAccess)
      {
        await this.authService.getLocalUserData();
        await this.userManagerService.createSignInUser();
      }

      if(this.authService.userAccess)
      {
        this.userAccess = this.authService.userAccess;
      }

      if(this.userAccess)
      {
        if(!this.convertDataType.getBoolean(this.userAccess.canLogin?.toString()))
        {
          this.viewDashboard = false
          return;
        }
        //if user cant view dashboard, redirect user to no access page.
        if(this.userAccess?.disableView)
        {
          let dashBoardAccess: any[] = this.userAccess?.disableView;

          if (this.displayPages.length < 1)
          {
            await this.getDisaplayPages();
          }
          if (this.displayPages.length > 0)
          {
            for (var i = 0; i <= this.displayPages.length; i++)
            {
              console.log(this.displayPages[i]);
            }
          }

          for (var entries in dashBoardAccess) {
            console.log(entries);
            if (entries === "dashboard")
            {
              this.viewDashboard = false
            }
          };
        }
      }

      if(this.userManagerService.user){
        this.user = {
          uid: this.userManagerService.user?.uid,
          displayName: this.userManagerService.user?.displayName,
          email: this.userManagerService.user?.email,
          emailVerified: this.userManagerService.user?.emailVerified,
          photoURL: this.userManagerService.user?.photoURL,
          firstName: this.userManagerService.user?.firstName,
          lastName: this.userManagerService.user?.lastName,
          promocode: this.userManagerService.user?.promocode
        };

        this.signedInUser = {
          Uid: this.userManagerService.user?.uid,
          User: this.user,
          UserAccess: this.userAccess
        };

        localStorage.setItem('signedInUser', JSON.stringify(this.signedInUser));
        }
        else
        {
          if(!this.signedInUser || !this.signedInUser.Uid || !this.signedInUser.User || !this.signedInUser.User.uid || !this.signedInUser.UserAccess)
          {
            this.userManagerService.createSignInUser();
          }
        }
    }
  }
}
