import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { companiesGrid, dropDownList } from './model/companiesGrid.moel';
import { AdminCompaniesAddComponent } from '../../core/modal/admin-companies-add/admin-companies-add.component';
import { ExcelService } from '../../core/excel/excel.service';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent {
  gridApi: any;
  gridColumnApi: any;
  frameworkComponents: any;
  defaultColDef: any[] = [];
  rowData: any[] = [];

  baseUrl: string = environment.apiBase
  adminUsersData: any;

    //for paging
    pageIndex: number = 1;
    pageSize: number = 10;
    count: number = 5;
    activePage: number = 0;
    activeInactiveList:any[]=[];
    isActive:boolean=true;

    selectedVal:any;
  //Grid columns
  courseColumns = [
    { field: 'Name', sortable: true, filter: true ,search:true },
    { field: 'Licences', sortable: true, filter: true },
    { field: 'StripeCustomerID', sortable: true, filter: true },
    { field: 'PromoCode', sortable: true, filter: true },
    { field: 'SubscriptionDueDate', sortable: true, filter: true },
    { field: 'CustomCoursesCreator', sortable: true, filter: true },
    { field: 'edit',cellRenderer: 'buttonRenderer', resizable: true, sortable: true, minWidth: 175 }
  ];
  constructor(public dataService: CrudService,
    public ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog,
    private excelService: ExcelService
    ) {
    this.displayActivePage(1);
  }

  exportToExcel(event:any) {
    let data = this.rowData
    data.forEach((element:any) => {
      delete element['Id']
    });
    this.excelService.downloadFile(data, 'Companies')
  }

  onGridReady(params: { api: any; columnApi: any; }) {

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  openModal()
  {
    const dialogRef =  this.dialog.open(AdminCompaniesAddComponent);
  }

  getSelectedCompanyCourses(event:any) {
     //this.ngxLoader.start();


      this.isActive= this.selectedVal != 1 ? true :false
    this.getCompaniesGridData(this.isActive);
  }
  displayActivePage(activePageNumber: number) {
    this.activePage = activePageNumber
    this.pageIndex = activePageNumber
    this.getCompaniesGridData(1);
  }

  //Bind active inactive dropdown list
  ngOnInit(): void {
    this.activeInactiveList=[];
   this.dataService.getAll(this.baseUrl + ApiEndpointType.GetAllActiveInactiveCourses).then(x => {
    this.adminUsersData = x;

    this.adminUsersData.forEach((element: any) => {
      let data = new dropDownList();
        data.Text=element.text;
        data.Value=element.value;
        this.activeInactiveList.push(data);
    });
    this.selectedVal=this.adminUsersData[0].value;
    this.getCompaniesGridData(this.selectedVal);
   });
  }

getCompaniesGridData(event:any){
  let paging: any =
  {
    pageIndex: this.pageIndex,
    pageSize: this.pageSize,
  }
  this.ngxLoader.start()
  this.dataService.postWithParams(this.baseUrl + ApiEndpointType.GetCompanies+this.isActive,paging).then(x => {

    this.ngxLoader.stop();
    this.adminUsersData = x;
    if (this.adminUsersData) {
      // this.count = Number(this.adminUsersData.count)
      this.rowData = [];
      this.adminUsersData.companyModelList.forEach((element: any) => {
        let data = new companiesGrid();
        data.Name=element.name;
        data.Licences = element.noOfLicense;
        data.PromoCode = element.promoCode;
        data.StripeCustomerID = element.stripeCustomerID;
        data.SubscriptionDueDate = element.subscriptionRenualDate;
        data.Id = element.companyID;
        data.IsDeleted=element.isDeleted;
        data.PurchasedCustomCourseCreator=element.purchasedCustomCourseCreator;
        data.EmailNotifications=element.EmailNotifications;
        data.DateCreated= element.dateCreated;
        this.rowData.push(data);
      });
    }
  })
}
}
