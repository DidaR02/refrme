import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { SalesApplicationService } from './SalesApplicationService.service';
import { SortableHeaderDirective, SortEvent } from './sortable.directive';

import { SaleApplication } from '../../Models/SalesApplicationModel';

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

  @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;

  constructor(public service: SalesApplicationService) {
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
}