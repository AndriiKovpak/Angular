import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { TranslationService } from '../../core/services/translation.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  //for paging
  pageEvent: PageEvent = new PageEvent();
  pageIndex: number = 0;
  pageSize: number = 1000;
  length: number = 2;

  //this is used for sorting and paging
  @ViewChild('MatPaginator') paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  //this is used to filter the individual column
  fullNameFilter = new FormControl('');
  emailFilter = new FormControl('');
  statusFilter = new FormControl('All');
  titleFilter = new FormControl('');
  strSafetySensitiveTypeFilter = new FormControl('All');
  strEligibleForAMTFilter = new FormControl('All');
  dataSource = new MatTableDataSource();
  baseUrl: string = environment.apiBase;
  adminUsersData: any;
  statusList: any;
  paginationArray: number[] = [5];

  //the columns that we need to display in table
  columnsToDisplay = [
    'fullName',
    'email',
    'title',
    'userStatusName',
    'dueDateCalculation',
    'strSafetySensitiveType',
    'strEligibleForAMT',
    'edit',
  ];
  filterValues = {
    fullName: '',
    email: '',
    title: '',
    userStatusName: '',
    dueDateCalculation: '',
    strSafetySensitiveType: '',
    strEligibleForAMT: '',
  };

  //this is used to get user stats
  userStats: any;

  constructor(
    public dataService: CrudService,
    public ngxLoader: NgxUiLoaderService,
    public translationService: TranslationService,
    public translate: TranslateService
  ) {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
    });
  }

  ngAfterViewInit() {
    this.ngxLoader.stop();
    //added for testing
  }

  ngOnInit() {
    this.ngxLoader.stopAll();
    this.GetAllCompanyAdminUsers();
    this.GetUserStatusSelectList();
    this.filters();
    this.getUserStatus();
  }

  //filter created to provide to mat table
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      return (
        data?.email?.toLowerCase().indexOf(searchTerms.email) !== -1 &&
        data?.title?.toLowerCase().indexOf(searchTerms.title) !== -1 &&
        data?.fullName?.toLowerCase().indexOf(searchTerms.fullName) !== -1
      );
      // && data?.userStatusName?.toLowerCase().indexOf(searchTerms.userStatusName) !== -1;
    };
    return filterFunction;
  }
  obj: any = {
    fullName: '',
    email: '',
    title: '',
    userStatusName: '',
    strEligibleForAMT: '',
    strSafetySensitiveType: '',
  };
  //filters of individual  columns
  filters() {
    // filter for fullName
    this.fullNameFilter.valueChanges.subscribe((fullName) => {
      this.obj.fullName = fullName;
      //   this.filterValues.fullName = fullName;
      // this.dataSource.filter = JSON.stringify(this.filterValues);
      this.GetAllCompanyAdminUserswithPagingAndFilters();
    });

    // filter for email
    this.emailFilter.valueChanges.subscribe((email) => {
      this.obj.email = email;
      // this.filterValues.email = email;
      this.GetAllCompanyAdminUserswithPagingAndFilters();
      //   this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    //filter for title
    this.titleFilter.valueChanges.subscribe((title) => {
      this.obj.title = title;
      //   this.filterValues.title = title;
      this.GetAllCompanyAdminUserswithPagingAndFilters();
      //  this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    //filter for userStatusName
    this.statusFilter.valueChanges.subscribe((userStatusName) => {
      this.obj.userStatusName = userStatusName;

      if (userStatusName == 'All') {
        this.obj.userStatusName = null
      }
      //   this.filterValues.userStatusName = userStatusName;
      this.GetAllCompanyAdminUserswithPagingAndFilters();
      //   this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    //filter for strEligibleForAMT
    this.strEligibleForAMTFilter.valueChanges.subscribe((strEligibleForAMT) => {
      this.obj.strEligibleForAMT = strEligibleForAMT;

      if (strEligibleForAMT == 'All') {
        this.obj.strEligibleForAMT = null;
      }

      //   this.filterValues.strEligibleForAMT = strEligibleForAMT;
      this.GetAllCompanyAdminUserswithPagingAndFilters();
      //   this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    //filter for strEligibleForAMT
    this.strSafetySensitiveTypeFilter.valueChanges.subscribe(
      (strSafetySensitiveType) => {
        this.obj.strSafetySensitiveType = strSafetySensitiveType;

        if (strSafetySensitiveType == 'All') {
          this.obj.strSafetySensitiveType = null
        }
        //   this.filterValues.strSafetySensitiveType = strSafetySensitiveType;
        this.GetAllCompanyAdminUserswithPagingAndFilters();
        //   this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );
  }

  //get the status of one column
  GetUserStatusSelectList() {
    this.ngxLoader.stop();
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetUserStatusSelectList)
      .then((x) => {
        this.statusList = x;
        this.statusList.unshift({text: 'All', value: -1, monthsCount: null})
      });
  }

  UserAdded() {
    this.pageIndex = 0;
    this.emailFilter.setValue(null, { emitEvent: false } );
    this.titleFilter.setValue(null, { emitEvent: false });
    this.fullNameFilter.setValue(null, { emitEvent: false });
    this.statusFilter.setValue('All', { emitEvent: false });
    this.strEligibleForAMTFilter.setValue('All', { emitEvent: false });
    this.strSafetySensitiveTypeFilter.setValue('All', { emitEvent: false });
    this.obj.userStatusName = null;
    this.obj.strSafetySensitiveType = null;
    this.obj.title = null;
    this.obj.strEligibleForAMT = null;
    this.obj.fullName = null;
    this.obj.email = null;
    this.GetAllCompanyAdminUserswithPagingAndFilters();
  }

  GetAllCompanyAdminUsers() {
    this.ngxLoader.stop();

    this.obj['pageIndex'] = this.pageIndex;
    this.obj['pageSize'] = this.pageSize;

    this.dataService
      .post(
        this.baseUrl +
          ApiEndpointType.GetAllCompanyAdminUserswithPagingAndFilters,
        this.obj
      )
      .then((x) => {

        this.adminUsersData = x;

        if (this.adminUsersData && this.adminUsersData.userModelList) {
          this.dataSource = new MatTableDataSource<any>(
            this.adminUsersData.userModelList
          );
          this.length = this.adminUsersData.count;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = this.createFilter();
          this.dataSource.paginator = this.paginator;

          if (this.length <= 10)
            this.paginationArray = [10];
          else if (this.length <= 25)
            this.paginationArray = [10, 25];
          else if (this.length <= 50)
            this.paginationArray = [10, 25, 50];
          else if (this.length <= 100)
            this.paginationArray = [10, 25, 50, 100];
          else if (this.length > 100)
            this.paginationArray = [10, 25, 50, 100, this.length];
        }
        this.ngxLoader.stopAll();
      })
      .catch((x) => {});
  }

  public getServerData(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.GetAllCompanyAdminUsers();
  }

  //this function is used get stats of the used
  getUserStatus() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetCompanyStat)
      .then((x) => {
        this.userStats = x;
        if (this.userStats) {
          !this.userStats.subscriptionRenewalDate
            ? (this.userStats.subscriptionRenewalDate = 0)
            : this.userStats.subscriptionRenewalDate;
        }
      })
      .catch((x) => {});
  }

  //get the list of admin users
  GetAllCompanyAdminUserswithPagingAndFilters() {
    this.pageIndex = 0;
    this.obj['pageIndex'] = this.pageIndex;
    this.obj['pageSize'] = this.pageSize;
    setTimeout(() => {
      this.ngxLoader.stopAll();
    }, 500);

    this.dataService
      .post(
        this.baseUrl +
          ApiEndpointType.GetAllCompanyAdminUserswithPagingAndFilters,
        this.obj
      )
      .then((x) => {
        this.adminUsersData = x;
        if (this.adminUsersData && this.adminUsersData.userModelList) {
          this.dataSource.data = this.adminUsersData.userModelList;
          this.length = this.adminUsersData.count;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = this.createFilter();
          this.dataSource.paginator = this.paginator;

          if (this.length <= 10)
            this.paginationArray = [10];
          else if (this.length <= 25)
            this.paginationArray = [10, 25];
          else if (this.length <= 50)
            this.paginationArray = [10, 25, 50];
          else if (this.length <= 100)
            this.paginationArray = [10, 25, 50, 100];
          else if (this.length > 100)
            this.paginationArray = [
              10,
              25,
              50,
              100,
              this.length,
            ]; }
      })
      .catch((x) => {});
  }
}
