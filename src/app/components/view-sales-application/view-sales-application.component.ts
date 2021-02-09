import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import {Country} from '../../Models/country';
import {CountryService} from './country.service';
import {SortableHeaderDirective, SortEvent} from './sortable.directive';

@Component({
  selector: 'app-view-sales-application',
  templateUrl: './view-sales-application.component.html',
  styleUrls: ['./view-sales-application.component.css']
})
export class ViewSalesApplicationComponent implements OnInit {

  ngOnInit(): void {
  }
  countries: Observable<Country[]>;
  total: Observable<number>;

  @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;

  constructor(public service: CountryService) {
    this.countries = service.countries$;
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