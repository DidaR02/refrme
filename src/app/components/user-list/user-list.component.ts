import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { User, PartialAccess, UserAccess  } from 'src/app/Models/userDetails/IUser';
import { UserManagerService } from 'src/app/Service/authentication/userManager.service';
import { Event } from '@angular/router';
import { DisableView, PageDisplayList, PageDisplayListChecked } from 'src/app/Models/Settings/IPageDisplaySettings';
import { SignedInUser } from 'src/app/Models/userDetails/ISignedInUser';
import { AuthenticationService } from 'src/app/Service/authentication/authentication.service';
import { DataTypeConversionService } from 'src/app/Service/shared/dataType-conversion.service';
import { FireBaseCrudService } from 'src/app/service/authentication/fire-base-crud.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {

  @Input() userList: User[];
  @Input() userAccess: UserAccess;
  selectedUser: User;
  canDownload: string;
  canShare: string;
  canLogin: string;
  canAddFile: string;
  canCreateFolder: string;
  disableView: DisableView[] = [];
  canDelete: string;
  isAdmin: string;
  adminAccessLevel: string;
  firstName: string;
  lastName: string;
  saveComplete: boolean = false;
  canShareFeed: string;
  canConnectPeers: string;
  canChat: string;
  canSubmitAllApplications: string;
  viewAllSalesApplications: string;
  canReferUsers: string;
  salesTally: string[];
  collectionsTarget: string[];
  canViewUserDetailsPOPI: string;
  brandAffiliateChoice: string[];
  partialAccess: PartialAccess[];
  form: FormGroup;

  public showOverlay = false;
  user: User;
  viewPage: boolean = true;

  displayPages: PageDisplayList[] = [];
  displayPagesChecked: PageDisplayListChecked[] = [];
  private signedInUser: SignedInUser;
  private pageName: string = "userList";

  constructor(
    public convertDataType: DataTypeConversionService,
    public authService: AuthenticationService,
    public userManagerService: UserManagerService,
    private fb: FormBuilder,
    public fsCrud: FireBaseCrudService) {

    this.getDisplayPageList();
    this.getUserInfo();
  }

  ngOnInit(): void {
    this.saveComplete = false;
  }

  public manageUserGroups= new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    canAddFile: new FormControl(),
    canCreateFolder: new FormControl(),
    canDownload: new FormControl(),
    canShare: new FormControl(),
    canLogin: new FormControl(),
    displayPagesChecked: this.fb.array([]),
    canDelete: new FormControl(),
    isAdmin: new FormControl(),
    adminAccessLevel: new FormControl(),
    canShareFeed: new FormControl(),
    canConnectPeers: new FormControl(),
    canChat: new FormControl(),
    canSubmitAllApplications: new FormControl(),
    viewAllSalesApplications: new FormControl(),
    canReferUsers: new FormControl(),
    salesTally: new FormControl(),
    collectionsTarget: new FormControl(),
    canViewUserDetailsPOPI: new FormControl(),
    brandAffiliateChoice: new FormControl(),
    partialAccess: new FormControl()
  });

  onCheckboxChange(e: any) {

    if (e.target.checked) {

      this.displayPagesChecked.forEach(page => {
          if (page.PageId.toString() === e.target.value) {
            page.IsChecked = true;
          }
      });
    } else {

      this.displayPagesChecked.forEach(page => {
            if (page.PageId.toString() === e.target.value) {
              page.IsChecked = false;
            }
        });
    }
  }

  getDisplayPageList(){
    let displayPageList = JSON.parse(localStorage.getItem('displayPages') as PageDisplayList | any);
    if (!displayPageList || displayPageList.length < 1)
    {
      this.fsCrud.getDisaplayPages();
      displayPageList = JSON.parse(localStorage.getItem('displayPages') as PageDisplayList | any);
    }
    else
    {
      this.displayPages = displayPageList;
    }

    if (this.displayPages.length > 1)
    {
      this.displayPages.forEach(pageItem => {

        var page: PageDisplayListChecked = {
          PageId: pageItem.PageId,
          PageName: pageItem.PageName,
          IsChecked: false
        }

        this.displayPagesChecked.push(page)
      })
    }
  }

  onSelect(user: User, userAccess: UserAccess): void {
    this.saveComplete = false;

    this.selectedUser = user;
    this.canDownload = userAccess.canDownload;
    this.canShare = userAccess.canShare;
    this.canLogin = userAccess.canLogin;
    this.disableView = userAccess.disableView;
    this.canDelete = userAccess.canDelete;
    this.isAdmin = userAccess.isAdmin;
    this.adminAccessLevel = userAccess.adminAccessLevel;
    this.canAddFile = userAccess.canAddFile;
    this.canCreateFolder = userAccess.canCreateFolder;
    this.canShareFeed = userAccess.canShareFeed;
    this.canConnectPeers = userAccess.canConnectPeers;
    this.canChat = userAccess.canChat;
    this.canSubmitAllApplications = userAccess.canSubmitAllApplications;
    this.viewAllSalesApplications = userAccess.viewAllSalesApplications;
    this.canReferUsers = userAccess.canReferUsers;
    this.salesTally = userAccess.salesTally;
    this.collectionsTarget = userAccess.collectionsTarget;
    this.canViewUserDetailsPOPI = userAccess.canViewUserDetailsPOPI;
    this.brandAffiliateChoice = userAccess.brandAffiliateChoice;
    this.partialAccess = userAccess.partialAccess;

    this.setCheckBoxes(this.disableView);
    this.setupControlModel();
  }

  setCheckBoxes(disableViewList: DisableView[]) {
    if (disableViewList && disableViewList.length > 0) {

      for (var item = 0; item <= disableViewList.length - 1; item++)
      {
        this.displayPagesChecked.forEach(page => {
          if (page.PageId.toString() === disableViewList[item]?.PageId.toString()) {
            page.IsChecked = true;
          }
        });
      }
    }
  }

  setupControlModel(){
    this.manageUserGroups.patchValue(
      {
        firstName: this.selectedUser?.firstName?.toString(),
        lastName: this.selectedUser?.lastName?.toString(),
        canAddFile: this.convertDataType.getStringBoolean(this.canAddFile?.toString()),
        canCreateFolder: this.convertDataType.getStringBoolean(this.canCreateFolder?.toString()),
        canDownload: this.convertDataType.getStringBoolean(this.canDownload?.toString()),
        canShare: this.convertDataType.getStringBoolean(this.canShare?.toString()),
        canLogin: this.convertDataType.getStringBoolean(this.canLogin?.toString()),
        canDelete: this.convertDataType.getStringBoolean(this.canDelete?.toString()),
        isAdmin: this.convertDataType.getStringBoolean(this.isAdmin?.toString()),
        adminAccessLevel: this.convertDataType.getAdminAccess(this.adminAccessLevel?.toString()),
        canShareFeed: this.convertDataType.getStringBoolean(this.canShareFeed?.toString()),
        canConnectPeers: this.convertDataType.getStringBoolean(this.canConnectPeers?.toString()),
        canChat: this.convertDataType.getStringBoolean(this.canChat?.toString()),
        canViewUserDetailsPOPI: this.convertDataType.getStringBoolean(this.canViewUserDetailsPOPI?.toString()),
        canSubmitAllApplications: this.convertDataType.getStringBoolean(this.canSubmitAllApplications?.toString()),
        viewAllSalesApplications: this.convertDataType.getStringBoolean(this.viewAllSalesApplications?.toString()),
        canReferUsers: this.convertDataType.getStringBoolean(this.canReferUsers?.toString()),
        displayPagesChecked: this.displayPagesChecked,
        // please create new methods
        salesTally: this.convertDataType.getAdminAccess(this.salesTally?.toString()),
        collectionsTarget: this.convertDataType.getAdminAccess(this.collectionsTarget?.toString()),
        brandAffiliateChoice: this.convertDataType.getAdminAccess(this.brandAffiliateChoice?.toString()),
        partialAccess: this.convertDataType.getAdminAccess(this.partialAccess?.toString())
      }
    );
  }

  async submitUserDetails(){

    this.setDisableView();

    const userDetails = this.manageUserGroups.value;

    if(userDetails)
    {
      this.selectedUser.firstName = userDetails.firstName;
      this.selectedUser.lastName = userDetails.lastName;

      await this.authService.SetFsUserData(this.selectedUser);
      await this.authService.SetDbUserData(this.selectedUser);

      if (this.viewPage)
      {
        this.userAccess.canAddFile = userDetails.canAddFile;
        this.userAccess.canCreateFolder = userDetails.canCreateFolder;
        this.userAccess.canDownload = userDetails.canDownload;
        this.userAccess.canShare = userDetails.canShare;
        this.userAccess.canLogin = userDetails.canLogin;
        this.userAccess.canDelete = userDetails.canDelete;
        this.userAccess.isAdmin = userDetails.isAdmin;
        this.userAccess.adminAccessLevel = userDetails.adminAccessLevel;
        this.userAccess.canShareFeed = userDetails.canShareFeed;
        this.userAccess.canConnectPeers = userDetails.canConnectPeers;
        this.userAccess.canChat = userDetails.canChat;
        this.userAccess.canSubmitAllApplications = userDetails.canSubmitAllApplications;
        this.userAccess.viewAllSalesApplications = userDetails.viewAllSalesApplications;
        this.userAccess.canReferUsers = userDetails.canReferUsers;
        this.userAccess.salesTally = userDetails.salesTally;
        this.userAccess.collectionsTarget = userDetails.collectionsTarget;
        this.userAccess.canViewUserDetailsPOPI = userDetails.canViewUserDetailsPOPI;
        this.userAccess.brandAffiliateChoice = userDetails.brandAffiliateChoice;
        this.userAccess.partialAccess = userDetails.partialAccess;
        this.userAccess.disableView = this.disableView;

        this.authService.userAccess = this.userAccess;
        await this.authService.SetUserAccess(this.authService.userAccess.uid);
      }

      this.saveComplete = true
    }
  }

  private setDisableView() {

    this.disableView = this.disableView ? this.disableView : [];
    this.displayPagesChecked.forEach(checkedItem => {

      const existView = this.disableView?.find(dv => dv?.PageId.toString() === checkedItem.PageId.toString());
      const existViewIndex = this.disableView?.findIndex(dv => dv?.PageId.toString() === checkedItem.PageId.toString());

      if (checkedItem.IsChecked && !existView?.PageId) {

        this.disableView.push({ PageId: checkedItem.PageId.toString() } as DisableView);
      }
      if (checkedItem.IsChecked === false && checkedItem.PageId.toString() === existView?.PageId?.toString()) {
        this.disableView.splice(existViewIndex, 1);
      }
    });
  }

  resetMsg()
  {
    this.saveComplete = false;
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
          this.viewPage = false
          return;
        }
        //if user cant view dashboard, redirect user to no access page.
        if(this.userAccess?.disableView)
        {
          let userList: DisableView[] = this.userAccess?.disableView;

          if (this.displayPages.length < 1)
          {
            this.fsCrud.getDisaplayPages();
          }

          if (this.displayPages.length > 1)
          {
            let getAllowedPage = this.displayPages.find(x => x.PageName === this.pageName)

            for (var i = 0; i < userList.length; i++)
            {
              if (getAllowedPage?.PageId.toString() === userList[i]?.PageId)
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
