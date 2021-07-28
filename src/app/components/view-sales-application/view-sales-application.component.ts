import { Component, OnInit, QueryList,ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SaleApplication } from '../../models/salesApplicationModels/SalesApplicationModel';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { FireBaseCrudService } from 'src/app/service/authentication/fire-base-crud.service';
import { DisableView, PageDisplayList } from 'src/app/models/Settings/IPageDisplaySettings';
import { SignedInUser } from 'src/app/models/userDetails/ISignedInUser';
import { User } from 'src/app/models/userDetails/IUser';
import { UserAccess } from 'src/app/models/userDetails/IUserAccess';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { UserManagerService } from 'src/app/service/authentication/userManager.service';
import { DataTypeConversionService } from 'src/app/service/shared/dataType-conversion.service';

@Component({
  selector: 'app-view-sales-application',
  templateUrl: './view-sales-application.component.html',
  styleUrls: ['./view-sales-application.component.scss']
})
export class ViewSalesApplicationComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'surname', 'email'];
  dataSource!: MatTableDataSource<SaleApplication>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  salesApplications: SaleApplication[] = [];

  public showOverlay = false;
  user: User;
  private userAccess: UserAccess;
  viewPage: boolean = true;
  displayPages: PageDisplayList[] = [];
  private signedInUser: SignedInUser;

  private pageName: string = "viewSalesApplications";

  constructor(
    public authService: AuthenticationService,
    public convertDataType: DataTypeConversionService,
    public userManagerService: UserManagerService,
    public fsCrud: FireBaseCrudService) {
    this.getUserInfo();
  }

  ngAfterViewInit() {
    this.getSalesApplicationList();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async getSalesApplicationList() {
    let salesList = this.fsCrud.getSalesApplicationList();

    salesList.snapshotChanges().subscribe(
      dataList => {
        this.salesApplications = [];
        dataList.forEach(saleApplication => {
          let a: any = saleApplication.payload.toJSON();
          a['saleApplicationId'] = saleApplication.key;
          this.salesApplications.push(a as SaleApplication);

          this.dataSource = new MatTableDataSource(this.salesApplications);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      (error) => {
        throw error
      }
    );
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
              if (getAllowedPage?.PageId === dashBoardAccess[i]?.PageId)
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
