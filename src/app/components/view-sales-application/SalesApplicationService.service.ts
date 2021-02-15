
import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from './sortable.directive';

import { FireBaseCrudService } from '../../Service/fire-base-crud.service';
import { FormBuilder} from '@angular/forms'; // Reactive form services
// import { IfStmt } from '@angular/compiler';
import { SaleApplication } from '../../Models/SalesApplicationModel';
import { Router } from "@angular/router";

interface SearchResult {
  salesApplications: SaleApplication[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(salesApplications: SaleApplication[], column: SortColumn, direction: string): SaleApplication[] {
  if (direction === '' || column === '') {
    return salesApplications;
  } else {
    return [...salesApplications].sort((a, b) => {
      const res = compare(a.UserPersonalDetails[column], b.UserPersonalDetails[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(saleApplication: SaleApplication, term: string) {
  return saleApplication.UserPersonalDetails.FirstName.toLowerCase().includes(term.toLowerCase())
    || saleApplication.UserPersonalDetails.FirstName.toLowerCase().includes(term.toLowerCase())
    || saleApplication.UserPersonalDetails.Email.toLowerCase().includes(term.toLowerCase());
}

@Injectable({providedIn: 'root'})
export class SalesApplicationService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _salesApplications$ = new BehaviorSubject<SaleApplication[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  SaleApplication: SaleApplication[];

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(public fsCrud: FireBaseCrudService, public formBuilder: FormBuilder) {
    this._getSalesApplicationsList();
  }

  get salesApplications$() { return this._salesApplications$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private async _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    await this._search$.next();
  }

  private  _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let salesApplications = sort(this.SaleApplication, sortColumn, sortDirection);
    let total: number;
    // 2. filter
    if(salesApplications){
      salesApplications = salesApplications.filter(saleApplication => matches(saleApplication, searchTerm));
      total = salesApplications.length;

    // 3. paginate
    salesApplications = salesApplications.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    }

    
    return of({salesApplications, total});
  }

  private async _getSalesApplicationsList(){

    let salesList =  await this.fsCrud.getSalesApplicationList();
     await salesList.snapshotChanges().subscribe(
      dataList => {
        this.SaleApplication = [];
        dataList.forEach(saleApplication => {
          let a = saleApplication.payload.toJSON();
          a['saleApplicationId'] = saleApplication.key;
          this.SaleApplication.push(a as SaleApplication);
        });
       this._search$.next();
      }
    );

     this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._salesApplications$.next(result.salesApplications);
      this._total$.next(result.total);
    });

    //this._search$.next();

  }
}
