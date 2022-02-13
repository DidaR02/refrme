import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PageDisplayList, DisableView } from "src/app/Models/Settings/IPageDisplaySettings";
import { SignedInUser } from "src/app/Models/userDetails/ISignedInUser";
import { User, UserAccess } from "src/app/Models/userDetails/IUser";
import { AuthenticationService } from "src/app/Service/authentication/authentication.service";
import { FireBaseCrudService } from "src/app/Service/authentication/fire-base-crud.service";
import { UserManagerService } from "src/app/Service/authentication/userManager.service";
import { DataTypeConversionService } from "src/app/Service/shared/dataType-conversion.service";

@Component({
  selector: 'app-edit-sales-application',
  templateUrl: './edit-sales-application.component.html',
  styleUrls: ['./edit-sales-application.component.scss']
})
export class EditSalesApplicationComponent implements OnInit {

  applicationFormState: string ="editSales";
  saleApplicationId: string;
  public showOverlay = false;
  user: User;
  private userAccess: UserAccess;
  viewPage: boolean = true;
  displayPages: PageDisplayList[] = [];
  private signedInUser: SignedInUser;
  private pageName: string = "editSalesApplications";

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditSalesApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
    public authService: AuthenticationService,
    public convertDataType: DataTypeConversionService,
    public userManagerService: UserManagerService,
    public fsCrud: FireBaseCrudService) {


    this.getUserInfo();
  }

  ngOnInit(): void {
  }

  closeModal() {
    this.dialogRef.close();
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
          this.viewPage = false
          return;
        }
        //if user cant view dashboard, redirect user to no access page.
        if(this.userAccess?.disableView)
        {
          let dashBoardAccess: DisableView[] = this.userAccess?.disableView;

          if (this.displayPages.length < 1)
          {
            this.fsCrud.getDisaplayPages();
          }

          if (this.displayPages.length > 1)
          {
            let getAllowedPage = this.displayPages.find(x => x.PageName === this.pageName)

            for (var i = 0; i < dashBoardAccess.length; i++)
            {
              if (getAllowedPage?.PageId.toString() === dashBoardAccess[i]?.PageId)
              {
                this.viewPage = false;
                break;
              }
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
}
