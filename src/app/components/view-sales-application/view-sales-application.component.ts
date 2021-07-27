import { Component, OnInit, QueryList,ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SaleApplication } from '../../models/salesApplicationModels/SalesApplicationModel';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { FireBaseCrudService } from 'src/app/service/authentication/fire-base-crud.service';

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

  constructor(public fsCrud: FireBaseCrudService) {

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
}
