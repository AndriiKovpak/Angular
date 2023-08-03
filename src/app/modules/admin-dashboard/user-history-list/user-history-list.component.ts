import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ExcelService } from '../../core/excel/excel.service';
import { CrudService } from '../../core/genric-service/crudservice';
import { AdminUpdatePasswordComponent } from '../../core/modal/admin-update-password/admin-update-password.component';
import { AdminUsersAddComponent } from '../../core/modal/admin-users-add/admin-users-add.component';
import { TranslationService } from '../../core/services/translation.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { userGrid } from '../users/model/userGrid.model';

@Component({
  selector: 'app-user-history-list',
  templateUrl: './user-history-list.component.html',
  styleUrls: ['./user-history-list.component.scss']
})
export class UserHistoryListComponent implements OnInit ,AfterViewInit{
//for paging
pageIndex: number = 1;
pageSize: number = 10;
count: number = 5;
activePage: number = 0;
length: number = 0;

//dataSource = new MatTableDataSource();
baseUrl: string = environment.apiBase;
adminUsersData: any;
statusList: any;
paginationArray: number[] = [5];
rowData!: any;
dataSource = new MatTableDataSource();
@ViewChild(MatPaginator) paginator!: MatPaginator;

constructor(
  public dataService: CrudService,
  public ngxLoader: NgxUiLoaderService,
  private dialog: MatDialog,
  private excelService: ExcelService,
  private toaster: ToastrService,
  private changeDetectorRefs: ChangeDetectorRef,
  public translationService: TranslationService,
    public translate: TranslateService
) {
   this.translationService.onLanguageChange.subscribe(lang => {

      this.translate.setDefaultLang(lang ?? 'en');
})
}

ngOnInit(): void {
  this.GetAllUsers();
}
displayedColumns: string[] = [
  'FullName',
  'dateTime',
  'Company',
  'Email',
  'City',
  'Licence',
  'PhoneNumber',
  'Role',
  'State',
  'Street',
  'SubscriptionDueDate',
  'Title',
  'ZipCode'
];
// dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);


ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
}

//get the list of admin users
GetAllUsers() {
  this.ngxLoader.start();
  let paging: any = {
    pageIndex: this.pageIndex,
    pageSize: this.pageSize,
    name: this.obj.name,
    Company: this.obj.Company,
    Email: this.obj.Email,
    PhoneNumber: this.obj.PhoneNumber,
    Title: this.obj.Title,
    Role: this.obj.Role,
    SubscriptionDueDate: this.obj.SubscriptionDueDate,
    Street: this.obj.Street,
    City: this.obj.City,
    ZipCode: this.obj.ZipCode,
    State: this.obj.State,
  };
  this.dataService
    .post(this.baseUrl + ApiEndpointType.GetListUsersHistory, paging)
    .then((x: any) => {
      this.ngxLoader.stop();
      if (x) {

        this.length = x.count;
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
            data.Licence = element.noOfLicenses;
            data.PhoneNumber = element.phoneNumber;
            data.Role = element.role;
            data.State = element.state;
            data.Street = element.street;
            data.SubscriptionDueDate = element.subscriptionDueDate;
            data.Title = element.title;
            data.ZipCode = element.zipCode;
            data.dateTime = element.dateTime;
            this.rowData.push(data);
            if (x.count <= 10) this.paginationArray = [10];
            else if (x.count <= 25) this.paginationArray = [10, 25];
            else if (x.count <= 50) this.paginationArray = [10, 25, 50];
            else if (x.count <= 100) this.paginationArray = [10, 25, 50, 100];
            else if (x.count > 100)
              this.paginationArray = [10, 25, 50, 100, x.count];
          });
        }
        this.dataSource.data = this.rowData;
        // this.dataSource.paginator = this.paginator;
      }
    });
}
public getServerData(event: PageEvent) {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
  this.GetAllUsers();
}
openModal() {
  const dialogRef = this.dialog.open(AdminUsersAddComponent);
}

exportToExcel() {
  let data = this.rowData;
  data.forEach((element: any) => {
    delete element['Id'];
  });
  this.excelService.downloadFile(data, 'Users');
}

AddopenModal(element: any) {
  const dialogRef = this.dialog.open(AdminUsersAddComponent, {
    data: element,
  });
  dialogRef.afterClosed().subscribe((x) => {
    this.GetAllUsers();
    this.changeDetectorRefs.detectChanges();
  });
}
deleteTestQuestionAns(val: any) {
  const dialogRef = this.dialog.open(AdminUpdatePasswordComponent, {
    data: val,
  });
}

obj: any = {
  name: '',
  Company: '',
  Email: '',
  PhoneNumber: '',
  Title: '',
  Role: '',
  SubscriptionDueDate: '',
  Street: '',
  City: '',
  ZipCode: '',
  State: '',
};

// (blur)="onBlurMethod('City')"
onBlurMethod(val: string, value: string) {

  switch (val) {
    case 'FullName':
      this.obj.name = value;
      this.GetAllUsers();
      break;
    case 'Company':
      this.obj.Company = value;
      this.GetAllUsers();
      break;
    case 'Email':
      this.obj.Email = value;
      this.GetAllUsers();
      break;
    case 'PhoneNumber':
      this.obj.PhoneNumber = value;
      this.GetAllUsers();
      break;
    case 'Title':
      this.obj.Title = value;
      this.GetAllUsers();
      break;
    case 'Role':
      this.obj.Role = value;
      this.GetAllUsers();
      break;
    case 'SubscriptionDueDate':
      this.obj.SubscriptionDueDate = new Date(value).toDateString();
      this.GetAllUsers();
      break;
    case 'Street':
      this.obj.Street = value;
      this.GetAllUsers();
      break;
    case 'City':
      this.obj.City = value;
      this.GetAllUsers();
      break;
    case 'ZipCode':
      this.obj.ZipCode = value;
      this.GetAllUsers();
      break;
    case 'State':
      this.obj.State = value;
      this.GetAllUsers();
      break;

    default:
      break;
  }
}

}
