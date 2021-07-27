import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/models/userDetails/IUser';
import { PartialAccess, UserAccess } from 'src/app/models/userDetails/IUserAccess';
import { DataTypeConversionService} from '../../service/shared/dataType-conversion.service'
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { UserManagerService } from 'src/app/service/authentication/userManager.service';
import { Event } from '@angular/router';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
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
  disableView: string[];
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
  displaySalesApplications: string;
  canReferUsers: string;
  salesTally: string[];
  collectionsTarget: string[];
  canViewUserDetailsPOPI: string;
  brandAffiliateChoice: string[];
  partialAccess: PartialAccess[];
  form: FormGroup;
  Data: Array<any> = [
    { name: 'Sales Applications', value: 'salesAplications' },
    { name: 'View Sales Applications', value: 'viewSalesApplications' },
    { name: 'DashBoard', value: 'dashboard' },
    { name: 'userProfile', value: 'userProfile' },
    { name: 'Projects', value: 'projects' }
  ];
  constructor(
    public dataTypeConv: DataTypeConversionService,
    public authService: AuthenticationService,
    public userManagerService: UserManagerService,
    private fb: FormBuilder
  ) { }

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
    disableView: this.fb.array([]),
    canDelete: new FormControl(),
    isAdmin: new FormControl(),
    adminAccessLevel: new FormControl(),
    canShareFeed: new FormControl(),
    canConnectPeers: new FormControl(),
    canChat: new FormControl(),
    canSubmitAllApplications: new FormControl(),
    displaySalesApplications: new FormControl(),
    canReferUsers: new FormControl(),
    salesTally: new FormControl(),
    collectionsTarget: new FormControl(),
    canViewUserDetailsPOPI: new FormControl(),
    brandAffiliateChoice: new FormControl(),
    partialAccess: new FormControl()
  });

  onCheckboxChange(e: any) {
  const checkArray: FormArray = this.form.get('checkArray') as FormArray;

  if (e.target.checked) {
    checkArray.push(new FormControl(e.target.value));
  } else {
    let i: number = 0;
    checkArray.controls.forEach((item: any) => {
      if (item.value == e.target.value) {
        checkArray.removeAt(i);
        return;
      }
      i++;
    });
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
    this.displaySalesApplications = userAccess.displaySalesApplications;
    this.canReferUsers = userAccess.canReferUsers;
    this.salesTally = userAccess.salesTally;
    this.collectionsTarget = userAccess.collectionsTarget;
    this.canViewUserDetailsPOPI = userAccess.canViewUserDetailsPOPI;
    this.brandAffiliateChoice = userAccess.brandAffiliateChoice;
    this.partialAccess = userAccess.partialAccess;

    this.setupControlModel();
  }

  setupControlModel(){
    this.manageUserGroups.patchValue(
      {
        firstName: this.selectedUser?.firstName?.toString(),
        lastName: this.selectedUser?.lastName?.toString(),
        canAddFile: this.dataTypeConv.getStringBoolean(this.canAddFile?.toString()),
        canCreateFolder: this.dataTypeConv.getStringBoolean(this.canCreateFolder?.toString()),
        canDownload: this.dataTypeConv.getStringBoolean(this.canDownload?.toString()),
        canShare: this.dataTypeConv.getStringBoolean(this.canShare?.toString()),
        canLogin: this.dataTypeConv.getStringBoolean(this.canLogin?.toString()),
        canDelete: this.dataTypeConv.getStringBoolean(this.canDelete?.toString()),
        isAdmin: this.dataTypeConv.getStringBoolean(this.isAdmin?.toString()),
        adminAccessLevel: this.dataTypeConv.getAdminAccess(this.adminAccessLevel?.toString()),
        canShareFeed: this.dataTypeConv.getStringBoolean(this.canShareFeed?.toString()),
        canConnectPeers: this.dataTypeConv.getStringBoolean(this.canConnectPeers?.toString()),
        canChat: this.dataTypeConv.getStringBoolean(this.canChat?.toString()),
        canViewUserDetailsPOPI: this.dataTypeConv.getStringBoolean(this.canViewUserDetailsPOPI?.toString()),
        canSubmitAllApplications: this.dataTypeConv.getStringBoolean(this.canSubmitAllApplications?.toString()),
        displaySalesApplications: this.dataTypeConv.getStringBoolean(this.displaySalesApplications?.toString()),
        canReferUsers: this.dataTypeConv.getStringBoolean(this.canReferUsers?.toString()),
        // please create new methods
        salesTally: this.dataTypeConv.getAdminAccess(this.salesTally?.toString()),
        collectionsTarget: this.dataTypeConv.getAdminAccess(this.collectionsTarget?.toString()),
        brandAffiliateChoice: this.dataTypeConv.getAdminAccess(this.brandAffiliateChoice?.toString()),
        partialAccess:  this.dataTypeConv.getAdminAccess(this.partialAccess?.toString())

      }
    );
  }

  async submitUserDetails(){
    const userDetails = this.manageUserGroups.value;
    if(userDetails)
    {
      this.selectedUser.firstName = userDetails.firstName;
      this.selectedUser.lastName = userDetails.lastName;
      this.userAccess.canAddFile = userDetails.canAddFile;
      this.userAccess.canCreateFolder = userDetails.canCreateFolder;
      this.userAccess.canDownload = userDetails.canDownload;
      this.userAccess.canShare = userDetails.canShare;
      this.userAccess.canLogin = userDetails.canLogin;
      this.userAccess.disableView = userDetails.disableView;
      this.userAccess.canDelete = userDetails.canDelete;
      this.userAccess.isAdmin = userDetails.isAdmin;
      this.userAccess.adminAccessLevel = userDetails.adminAccessLevel;
      this.userAccess.canShareFeed = userDetails.canShareFeed;
      this.userAccess.canConnectPeers = userDetails.canConnectPeers;
      this.userAccess.canChat = userDetails.canChat;
      this.userAccess.canSubmitAllApplications = userDetails.canSubmitAllApplications;
      this.userAccess.displaySalesApplications = userDetails.displaySalesApplications;
      this.userAccess.canReferUsers = userDetails.canReferUsers;
      this.userAccess.salesTally = userDetails.salesTally;
      this.userAccess.collectionsTarget = userDetails.collectionsTarget;
      this.userAccess.canViewUserDetailsPOPI = userDetails.canViewUserDetailsPOPI;
      this.userAccess.brandAffiliateChoice = userDetails.brandAffiliateChoice;
      this.userAccess.partialAccess = userDetails.partialAccess;
      this.userAccess.disableView = userDetails.disableView;

      await this.authService.SetFsUserData(this.selectedUser);
      await this.authService.SetDbUserData(this.selectedUser);
      this.authService.userAccess = this.userAccess;
      await this.authService.SetUserAccess(this.authService.userAccess.uid);

      this.saveComplete = true
    }
  }

  resetMsg()
  {
    this.saveComplete = false;
  }
}
