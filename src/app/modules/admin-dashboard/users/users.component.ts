import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { AdminUpdatePasswordComponent } from '../../core/cell-renders/admin-update-password/admin-update-password.component';
import { AdminUserEditComponent } from '../../core/cell-renders/admin-user-edit/admin-user-edit.component';
import { ExcelService } from '../../core/excel/excel.service';
import { RecordTypeFilterComponent } from '../../core/filter/record-type-filter/record-type-filter.component';
import { CrudService } from '../../core/genric-service/crudservice';
import { AdminUsersAddComponent } from '../../core/modal/admin-users-add/admin-users-add.component';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { userGrid } from './model/userGrid.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  //variables took for ag grid and took it as any because in the documentation
  // they did not provided the type
  gridApi: any;
  gridColumnApi: any;
  frameworkComponents: any;
  defaultColDef: any[] = [];
  rowData: any[] = [];

  dataSource = new MatTableDataSource();
  baseUrl: string = environment.apiBase;
  adminUsersData: any;
  statusList: any;
  paginationArray: number[] = [5];

  usersColumns = [
    { field: 'FullName', sortable: true, filter: true, search: true },
    { field: 'Company', sortable: true, filter: true },
    { field: 'Email', sortable: true, filter: true },
    { field: 'PhoneNumber', sortable: true, filter: true },
    { field: 'Title', sortable: true, filter: true },
    { field: 'Role', sortable: true, filter: true },
    { field: 'SubscriptionDueDate', sortable: true, filter: true },
    { field: 'Licence(Qty)', sortable: true, filter: true },
    { field: 'Street', sortable: true, filter: true },
    { field: 'City', sortable: true, filter: true },
    { field: 'ZipCode', sortable: true, filter: true, search: true },
    { field: 'State', sortable: true, filter: true, search: true },
    {
      field: 'Edit',
      cellRenderer: 'buttonRenderer',
      resizable: true,
      sortable: true,
      minWidth: 175,
      cellRendererParams: {
        clicked: function (field: any) {},
      },
    },
    {
      field: 'Update Password',
      cellRenderer: 'updatePassRendere',
      resizable: true,
      sortable: true,
      minWidth: 250,
      cellRendererParams: {
        clicked: function (field: any) {},
      },
    },
  ];

  //this is used to filter the individual column
  fullNameFilter = new FormControl('');
  emailFilter = new FormControl('');
  phoneFilter = new FormControl('');
  titleFilter = new FormControl('');
  roleFilter = new FormControl('');
  SubscriptionDueDateFilter = new FormControl('');
  StreetFilter = new FormControl('');
  CityFilter = new FormControl('');
  zipcodeFilter = new FormControl('');
  stateFilter = new FormControl('');

  obj: any = {
    fullName: '',
    email: '',
    title: '',
    Company: '',
    PhoneNumber: '',
    Role: '',
    SubscriptionDueDate: '',
    Street: '',
    City: '',
    ZipCode: '',
    State: '',
  };
  //filters of individual  columns
  filters() {
    // filter for fullName
    this.stateFilter.valueChanges.subscribe((fullName) => {
      this.obj.State = fullName;
      this.GetAllUsers();
    });

    // filter for fullName
    this.stateFilter.valueChanges.subscribe((fullName) => {
      this.obj.ZipCode = fullName;
      this.GetAllUsers();
    });

    // filter for fullName
    this.stateFilter.valueChanges.subscribe((fullName) => {
      this.obj.Street = fullName;
      this.GetAllUsers();
    });

    // filter for fullName
    this.stateFilter.valueChanges.subscribe((fullName) => {
      this.obj.City = fullName;
      this.GetAllUsers();
    });

    // filter for fullName
    this.fullNameFilter.valueChanges.subscribe((fullName) => {

      this.obj.fullName = fullName;
      //   this.filterValues.fullName = fullName;
      // this.dataSource.filter = JSON.stringify(this.filterValues);
      this.GetAllUsers();
    });

    // filter for email
    this.emailFilter.valueChanges.subscribe((email) => {
      this.obj.email = email;
      // this.filterValues.email = email;
      this.GetAllUsers();
      //   this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    //filter for title
    this.titleFilter.valueChanges.subscribe((title) => {
      this.obj.title = title;
      //   this.filterValues.title = title;
      this.GetAllUsers();
      //  this.dataSource.filter = JSON.stringify(this.filterValues);
    });
  }

  //the columns that we need to display in table
  columnsToDisplay = [
    'FullName',
    'Company',
    'Email',
    'PhoneNumber',
    'Title',
    'Role',
    'SubscriptionDueDate',
    'Licence(Qty)',
    'Street',
    'City',
    'ZipCode',
    'State',
    'Edit',
  ];
  filterValues = {
    FullName: '',
    Company: '',
    Email: '',
    Title: '',
    Role: '',
    SubscriptionDueDate: '',
    Street: '',
    City: '',
    ZipCode: '',
    State: '',
  };

  //for paging
  pageIndex: number = 1;
  pageSize: number = 10;
  count: number = 5;
  activePage: number = 0;

  constructor(
    public dataService: CrudService,
    public ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog,
    private excelService: ExcelService
  ) {
    this.frameworkComponents = {
      buttonRenderer: AdminUserEditComponent,
      updatePassRendere: AdminUpdatePasswordComponent,
    };
  }

  ngOnInit(): void {
    this.GetAllUsers();
  }

  onGridReady(params: { api: any; columnApi: any }) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  openModal() {
    const dialogRef = this.dialog.open(AdminUsersAddComponent);
  }

  //get the list of admin users
  GetAllUsers() {
    this.ngxLoader.start();

    let paging: any = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    };
    this.dataService
      .post(this.baseUrl + ApiEndpointType.GetAllUsersList, paging)
      .then((x) => {
        this.ngxLoader.stop();
        this.adminUsersData = x;
        if (this.adminUsersData) {
          this.count = Number(this.adminUsersData.count);
          this.rowData = [];
          this.adminUsersData.userModelList.forEach((element: any) => {
            let data = new userGrid();
            data.Id = element.id;
            let firstName =
              element.firstName == null ? '' : element.firstName + ' ';
            let lastName = element.lastName == null ? '' : element.lastName;
            element['username'] = firstName + lastName;
            data.FullName = firstName + lastName;
            data.Company = element.companyName;
            data.Email = element.email;
            data.City = element.city;
            data.isEligibleForAMT = element.isEligibleForAMT;
            data.Licence = element.noOfLicense;
            data.PhoneNumber = element.phoneNumber;
            data.Role = element.role;
            data.State = element.state;
            data.Street = element.street;
            data.SubscriptionDueDate = element.subscriptionDueDate;
            data.Title = element.title;
            data.ZipCode = element.zipCode;
            this.rowData.push(data);
          });
        }
      });
  }

  exportToExcel() {
    let data = this.rowData;
    data.forEach((element: any) => {
      delete element['Id'];
    });
    this.excelService.downloadFile(data, 'Users');
  }

  i: number = 0;
  displayActivePage(activePageNumber: number) {
    this.activePage = activePageNumber;
    this.pageIndex = activePageNumber;
    ++this.i;
    if (this.i != 1) if (this.i != 2) this.GetAllUsers();
  }
}
