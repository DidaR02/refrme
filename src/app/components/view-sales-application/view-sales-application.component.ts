import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { SalesApplicationService } from './SalesApplicationService.service';
import { SortableHeaderDirective, SortEvent } from './sortable.directive';

import { SaleApplication } from '../../Models/SalesApplicationModel';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditSalesApplicationComponent } from '../edit-sales-application/edit-sales-application.component';

@Component({
  selector: 'app-view-sales-application',
  templateUrl: './view-sales-application.component.html',
  styleUrls: ['./view-sales-application.component.css']
})
export class ViewSalesApplicationComponent implements OnInit {

  ngOnInit(): void {
    
  }
  salesApplications: Observable<SaleApplication[]>;
  total: Observable<number>;

  public isHidden: Boolean = true;
  xPosTabMenu: Number;
  yPosTabMenu: Number;

  @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;

  constructor(public service: SalesApplicationService, public matDialog: MatDialog) {
    this.salesApplications = service.salesApplications$;
    this.total = service.total$;
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  rightClick(event) {
    event.stopPropagation();
    this.xPosTabMenu = event.clientX;
    this.yPosTabMenu = event.clientY;
    this.isHidden = false;
    return false;
  }

  closeRightClickMenu() {
    this.isHidden = true;
  }

  openModal(saleApplicationId: any) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "edit-sales-component";
    dialogConfig.data = {
      name: "Close",
      title: "Are you sure you want to close?",
      description: "Pretend this is a convincing argument on why you shouldn't close :)",
      actionButtonText: "Close",
      saleAppId: saleApplicationId
    }
    
    const modalDialog = this.matDialog.open(EditSalesApplicationComponent, dialogConfig);
  }
}