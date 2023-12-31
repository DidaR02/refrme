import { Component, OnInit, QueryList,ViewChild, ViewChildren, AfterViewInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SaleApplication } from '../../Models/salesApplicationModels/SalesApplicationModel';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { FireBaseCrudService } from 'src/app/Service/authentication/fire-base-crud.service';
import { DisableView, PageDisplayList } from 'src/app/Models/Settings/IPageDisplaySettings';
import { SignedInUser } from 'src/app/Models/userDetails/ISignedInUser';
import { User, UserAccess } from 'src/app/Models/userDetails/IUser';
import { AuthenticationService } from 'src/app/Service/authentication/authentication.service';
import { UserManagerService } from 'src/app/Service/authentication/userManager.service';
import { DataTypeConversionService } from 'src/app/Service/shared/dataType-conversion.service';

@Component({
  selector: 'app-view-sales-application',
  templateUrl: './view-sales-application.component.html',
  styleUrls: ['./view-sales-application.component.scss']
})
export class ViewSalesApplicationComponent implements OnInit, AfterViewInit {

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
  viewAllSalesApplications: boolean = false;
  private signedInUser: SignedInUser;
  private pageName: string = "viewSalesApplications";

  constructor(
    public authService: AuthenticationService,
    public convertDataType: DataTypeConversionService,
    public userManagerService: UserManagerService,
    public fsCrud: FireBaseCrudService) {
    this.getUserInfo();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<SaleApplication>();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getSalesApplicationList();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getSalesApplicationList();
  }

  async applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getInitialsFromFirstname(name: string) {

    if (name)
    {
      return name.trim().substring(0, 1).toUpperCase();
    }

    return name;
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

        });

        if (this.viewAllSalesApplications === false)
        {
          this.salesApplications = this.salesApplications.filter(x => x.AgentPromoCode === this.user?.promocode)
        }

          this.dataSource = new MatTableDataSource(this.salesApplications);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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
          let isViewApplicationsDisabled: DisableView[] = this.userAccess?.disableView;

          if (this.displayPages.length < 1)
          {
            this.fsCrud.getDisaplayPages();
          }

          if (this.displayPages.length > 1)
          {
            let getAllowedPage = this.displayPages.find(x => x.PageName === this.pageName)

            for (var i = 0; i < isViewApplicationsDisabled.length; i++)
            {
              if (getAllowedPage?.PageId.toString() === isViewApplicationsDisabled[i]?.PageId)
              {
                this.viewPage = false;
                break;
              }
            }
          }
        }

          if (this.userAccess?.viewAllSalesApplications)
          {
            this.viewAllSalesApplications = this.convertDataType.getBoolean(this.userAccess.viewAllSalesApplications?.toString())
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
          promocode: this.userManagerService.user?.promocode,
          referalPromoCode: this.userManagerService.user?.referalPromoCode
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
