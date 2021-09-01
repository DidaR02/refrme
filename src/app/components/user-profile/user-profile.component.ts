import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SignedInUser } from 'src/app/Models/userDetails/ISignedInUser';
import { User } from 'src/app/Models/userDetails//IUser';
import { UserAccess } from 'src/app/Models/userDetails/IUserAccess';
import { UserManagerService } from 'src/app/Service/authentication/userManager.service';
import { UserListComponent } from '../user-list/user-list.component';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { PageDisplayList, DisableView } from 'src/app/Models/Settings/IPageDisplaySettings';
import { FireBaseCrudService } from 'src/app/service/authentication/fire-base-crud.service';
import { DataTypeConversionService } from 'src/app/service/shared/dataType-conversion.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User;
  userAccess: UserAccess;
  signedInUser: SignedInUser;

  /*For UsersList*/
  p: number = 1;                      // Settup up pagination variable
  userList: User[];                 // Save students data in Student's array.
  hideWhenNoUsers: boolean = false; // Hide students data table when no student.
  noData: boolean = false;            // Showing No Student Message, when no student in database.
  preLoader: boolean = true;
  /*End UsersList*/

  viewPage = true;
  displayPages: PageDisplayList[] = [];
  private pageName: string = 'userProfile';

  filterUserList: boolean = false;

  constructor(
    public fsCrud: FireBaseCrudService,
    public authService: AuthenticationService,
    public userManagerService: UserManagerService,
    public router: Router,
    public convertDataType: DataTypeConversionService
  ) {
      // this.refreshAll();
  }

  ngOnInit() {
     this.refreshAll();
  }

  async refreshAll()
  {
    await this.getUserInfo();
    await this.GetAllUsers();
  }

  async getUserInfo()
  {
    let displayPageList = JSON.parse(localStorage.getItem('displayPages') as PageDisplayList | any);
    if (!displayPageList || displayPageList.length < 1)
    {
      this.fsCrud.getDisaplayPages();
    }
    else
    {
      this.displayPages = displayPageList;
    }

    this.userManagerService.createSignInUser();

    if(this.authService?.isLoggedIn)
    {
      if(!this.userAccess)
      {
        //this.authService.getLocalUserData();
        this.userManagerService.createSignInUser();
      }

      if(this.authService?.userAccess)
      {
        this.userAccess = this.authService?.userAccess;
      }

        if(this.userAccess?.disableView)
        {
          let userProfileAccess: DisableView[] = this.userAccess?.disableView;

          if (this.displayPages.length < 1)
          {
            this.fsCrud.getDisaplayPages();
          }

          if (this.displayPages.length > 1)
          {
            let getAllowedPage = this.displayPages.find(x => x.PageName === this.pageName)

            for (var i = 0; i < userProfileAccess.length; i++)
            {
              if (getAllowedPage?.PageId.toString() === userProfileAccess[i]?.PageId)
              {
                this.viewPage = false;
                break;
              }
              if (getAllowedPage?.PageId.toString() === "userList")
              {
                this.filterUserList = true;
                break;
              }
            }
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

  async GetAllUsers()
  {

      let users = this.userManagerService.GetAllUsers();
      console.log(this.userList);

      users.snapshotChanges().subscribe(async data => {
        this.userList = [];
        data.forEach(async currentUser => {
          let a: any = currentUser.payload.toJSON();
          a['uid'] = currentUser.key;
          this.setupUser(a as User);
        })

        if(!this.convertDataType.getBoolean(this.userAccess?.isAdmin) || this.filterUserList)
        {
          this.userList = this.userList.filter(user => user.uid === this.user.uid);
        }
      });



    return this.userList;
  }

  setupUser(user: User){

    const userData: User = {
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      emailVerified: user.emailVerified ?? false,
      firstName: user.firstName?? null,
      lastName: user.lastName?? null,
      promocode: user.promocode ?? null
    }

    this.userList.push(userData as User);
  }
  // Using valueChanges() method to fetch simple list of students data. It updates the state of hideWhenNoStudent, noData & preLoader variables when any changes occurs in student data list in real-time.
  dataState() {
    this.userManagerService.GetAllUsers().valueChanges().subscribe(data => {
      this.preLoader = false;
      if(data.length <= 0){
        this.hideWhenNoUsers = false;
        this.noData = true;
      } else {
        this.hideWhenNoUsers = true;
        this.noData = false;
      }
    })
  }
}
