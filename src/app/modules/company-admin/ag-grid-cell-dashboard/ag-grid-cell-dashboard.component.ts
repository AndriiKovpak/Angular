import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { RecordTypeFilterComponent } from '../../core/filter/record-type-filter/record-type-filter.component';
import { CrudService } from '../../core/genric-service/crudservice';
import { TranslationService } from '../../core/services/translation.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { TotalValueRenderer } from '../total-value-renderer/total-value-renderer.component.ts.component';
import { dashboardGrid } from './model/dashboardGrid.model';

@Component({
  selector: 'app-ag-grid-cell-dashboard',
  templateUrl: './ag-grid-cell-dashboard.component.html',
  styleUrls: ['./ag-grid-cell-dashboard.component.scss']
})
export class AgGridCellDashboardComponent {

  //variables took for ag grid and took it as any because in the documentation
  // they did not provided the type
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any[] = [];
  frameworkComponents: any;
  defaultColDef: any[] = [];
  rowData!: any[];

  //for paging
  pageIndex: number = 0;
  pageSize: number = 12;
  count: number = 5;
  activePage: number = 0;

  baseUrl: string = environment.apiBase
  adminUsersData: any;
  statusList: any;

  //this is used to get user stats
  userStats: any;

  constructor(public dataService: CrudService,
    public ngxLoader: NgxUiLoaderService,
    public translationService: TranslationService,
    public translate: TranslateService) {
    this.translationService.onLanguageChange.subscribe(lang => {
      this.translate.setDefaultLang(lang ?? 'en');
    })

  let userDetails:any=   JSON.parse(localStorage.getItem("userDetails")!)
  if( userDetails && userDetails.languagePreference)
  this.translate.setDefaultLang(userDetails.languagePreference);


    this.displayActivePage(1);

    //columns need to display
    this.columnDefs =
      [
        { field: 'Employee', sortable: true, filter: true, resizable: true,  width: 150 },
        { field: 'Email', sortable: true, filter: true, resizable: true ,  width: 180},
        { field: 'Title', sortable: true, filter: true, resizable: true,  width: 86 },
        {
          field: 'Status', sortable: true, filter: "recordTypeFilter",
          width: 99, resizable: true,
        },
        { field: 'CoursesOverdue', sortable: true, filter: true, resizable: true ,  width: 179},
        { field: 'SafetySensitive', sortable: true, filter: true, resizable: true,width: 179 },
        { field: 'EligibleForAMT', sortable: true, filter: true, resizable: true, width: 179},
        { field: 'ViewEmployee', sortable: true, minWidth: 175, cellRenderer: 'buttonRenderer', resizable: true,width: 79 },
      ];

      //components that is used to cell rendering
    this.frameworkComponents = {
      buttonRenderer: TotalValueRenderer,
      recordTypeFilter: RecordTypeFilterComponent
    };

    // this.defaultColDef = {
    //   editable: true,
    //   sortable: true,
    //   flex: 1,
    //   minWidth: 100,
    //   filter: true,
    //   resizable: true,
    // };
  }

  //this function is used when the grid is ready
  onGridReady(params: { api: any; columnApi: any; }) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  //get the list of admin users
  GetAllCompanyAdminUsers() {
    //this.ngxLoader.start();
    let paging: any =
    {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }

    this.dataService.post(this.baseUrl + ApiEndpointType.GetAllCompanyAdminUserswithPagingAndFilters, paging).then(x => {
      this.ngxLoader.stop();
      this.adminUsersData = x

      if (this.adminUsersData && this.adminUsersData.userModelList) {
        this.count = Number(this.adminUsersData.count)
        this.rowData = []
        this.adminUsersData.userModelList.forEach((element: any) => {
          let data = new dashboardGrid();
          data.Employee = element.fullName;
          data.Email = element.email;
          data.Title = element.title;
          data.Status = element.userStatusName;
          data.CoursesOverdue = element.dueDateCalculation;
          data.SafetySensitive = element.strSafetySensitiveType;
          data.EligibleForAMT = element.strEligibleForAMT;
          this.rowData.push(data);
        });
      }
    }).catch(x => { })
  }

  //this function is used to do paging with server side
  public getServerData(event: PageEvent) {
    this.pageIndex = event.pageIndex
    // this.pageSize=event.pageSize
    this.GetAllCompanyAdminUsers();
  }

  displayActivePage(activePageNumber: number) {
    this.activePage = activePageNumber
    this.pageIndex = activePageNumber
    this.GetAllCompanyAdminUsers();
    this.getUserStatus()
  }

//this function is used get stats of the used
  getUserStatus() {
    this.dataService.getAll(this.baseUrl + ApiEndpointType.GetCompanyStat).then(x => {

      this.userStats = x;
      if(this.userStats)
      {
        !this.userStats.subscriptionRenewalDate?this.userStats.subscriptionRenewalDate=0:this.userStats.subscriptionRenewalDate
      }
    }).catch(x => {
    })
  }

}
