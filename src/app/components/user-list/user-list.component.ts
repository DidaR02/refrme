import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/Models/userAccess/IUser';
import { UserAccess } from 'src/app/Models/userAccess/IUserAccess';
import { DataTypeConversionService} from '../../Service/shared/dataType-conversion.service'
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { UserManagerService } from 'src/app/Service/authentication/userManager.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  @Input()
  userList!: User[];
  @Input()
  userAccess!: UserAccess;
  selectedUser!: User;
  isAdmin!: string;
  canShareFeed!: string;
  canConnectPeers!: string;
  canChat!: string;
  canSubmitApplications!: string;
  canReferUsers!: string;
  salesTally!: string[];
  collectionsTarget!: string[];
  canViewUserDetailsPOPI!: string;
  brandAffiliateChoice!: string[];

  firstName!: string;
  lastName!: string;
  saveComplete: boolean = false;

  constructor(
    public dataTypeConv: DataTypeConversionService,
    public authService: AuthenticationService,
    public userManagerService: UserManagerService) { }

  ngOnInit(): void {
    this.saveComplete = false;
  }

  public manageUserGroups= new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    isAdmin: new FormControl(),
    canShareFeed: new FormControl(),
    canConnectPeers: new FormControl(),
    canChat: new FormControl(),
    canSubmitApplications: new FormControl(),
    canReferUsers: new FormControl(),
    salesTally: new FormControl(),
    collectionsTarget: new FormControl(),
    canViewUserDetailsPOPI: new FormControl(),
    brandAffiliateChoice: new FormControl(),
  });

  onSelect(user: User, userAccess: UserAccess): void {
    this.saveComplete = false;

    this.selectedUser = user;
    this.isAdmin = userAccess.isAdmin;
    this.canShareFeed = userAccess.canShareFeed;
    this.canConnectPeers = userAccess.canConnectPeers;
    this.canChat = userAccess.canChat;
    this.canSubmitApplications = userAccess.canSubmitApplications;
    this.canReferUsers = userAccess.canReferUsers;
    this.salesTally = userAccess.salesTally;
    this.collectionsTarget = userAccess.collectionsTarget;
    this.canViewUserDetailsPOPI =userAccess.canViewUserDetailsPOPI;
    this.brandAffiliateChoice = userAccess.brandAffiliateChoice;

    this.setupControlModel();
  }

  setupControlModel(){
    this.manageUserGroups.patchValue(
      {
        firstName: this.selectedUser?.firstName?.toString(),
        lastName: this.selectedUser?.lastName?.toString(),
        isAdmin: this.dataTypeConv.getStringBoolean(this.isAdmin?.toString()),
        canShareFeed: this.dataTypeConv.getStringBoolean(this.canShareFeed?.toString()),
        canConnectPeers: this.dataTypeConv.getStringBoolean(this.canConnectPeers?.toString()),
        canChat: this.dataTypeConv.getStringBoolean(this.canChat?.toString()),
        canSubmitApplications: this.dataTypeConv.getStringBoolean(this.canSubmitApplications?.toString()),
        canReferUsers: this.dataTypeConv.getStringBoolean(this.canReferUsers?.toString()),
        salesTally: this.salesTally,
        collectionsTarget: this.collectionsTarget,
        canViewUserDetailsPOPI: this.dataTypeConv.getStringBoolean(this.canViewUserDetailsPOPI?.toString()),
        brandAffiliateChoice: this.brandAffiliateChoice
      }
    );
  }

  async submitUserDetails(){
    const userDetails = this.manageUserGroups.value;
    if(userDetails)
    {
      this.selectedUser.firstName = userDetails.firstName;
      this.selectedUser.lastName = userDetails.lastName;
      this.isAdmin = userDetails.isAdmin;
      this.canShareFeed = userDetails.canShareFeed;
      this.canConnectPeers = userDetails.canConnectPeers;
      this.canChat = userDetails.canChat;
      this.canSubmitApplications = userDetails.canSubmitApplications;
      this.canReferUsers = userDetails.canReferUsers;
      this.salesTally = userDetails.salesTally;
      this.collectionsTarget = userDetails.collectionsTarget;
      this.canViewUserDetailsPOPI =userDetails.canViewUserDetailsPOPI;
      this.brandAffiliateChoice = userDetails.brandAffiliateChoice;

      this.authService.SetFsUserData(this.selectedUser);
      this.authService.SetDbUserData(this.selectedUser);
      this.authService.userAccess = this.userAccess;
      this.authService.SetUserAccess(this.authService.userAccess.uid);

      this.saveComplete = true
    }
  }

  resetMsg()
  {
    this.saveComplete = false;
  }
}
