import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ExcelService } from '../../core/excel/excel.service';
import { CrudService } from '../../core/genric-service/crudservice';
import { AdminUpdatePasswordComponent } from '../../core/modal/admin-update-password/admin-update-password.component';
import { AdminUsersAddComponent } from '../../core/modal/admin-users-add/admin-users-add.component';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { userGrid } from '../users/model/userGrid.model';
import {AuthService} from "../../core/guards/auth.service";
import {concatMap, filter, first, skip} from "rxjs/operators";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit {
  //for paging
  pageIndex: number = 0;
  pageSize: number = 10;
  count: number = 5;
  activePage: number = 0;
  length: number = 2;

  //dataSource = new MatTableDataSource();
  baseUrl: string = environment.apiBase;
  adminUsersData: any;
  statusList: any;
  paginationArray: number[] = [5];
  rowData!: any;
  dataSource = new MatTableDataSource();
  usersActive: string = 'All';

  constructor(
    public dataService: CrudService,
    public ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    public translate: TranslateService,
    private router: Router,
    private toaster: ToastrService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.GetAllUsers();
  }

  displayedColumns: string[] = [
    'FullName',
    'Company',
    'Email',
    'City',
    'UserStatus',
    'Licence',
    'PhoneNumber',
    'Role',
    'State',
    'Street',
    'SubscriptionDueDate',
    'Title',
    'ZipCode',
    'edit',
  ];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild('MatPaginator') paginator!: MatPaginator;


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
      UserStatus: this.obj.UserStatus,
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
      .post(this.baseUrl + ApiEndpointType.GetAllUsersList, paging)
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
              data.UserStatus = element.userStatusName;
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
              data.SelectedDepartmentIds = element.selectedDepartmentIds;

              this.rowData.push(data);
            });
          }
          if (this.count <= 10) this.paginationArray = [10];
              else if (this.count <= 25) this.paginationArray = [10, 25];
              else if (this.count <= 50) this.paginationArray = [10, 25, 50];
              else if (this.count <= 100) this.paginationArray = [10, 25, 50, 100];
              else if (this.count > 100)
                this.paginationArray = [10, 25, 50, 100, this.count];
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
   //navigate to employee home

  impersonate(user: userGrid) { //Impersonate
    this.authService.impersonate(user.Id)
      .subscribe(res => {
        localStorage.setItem('userDetails', JSON.stringify(res));

        if (localStorage.getItem('EX')) {
          let data = JSON.parse(localStorage.getItem('EX') ?? '');
          if (data != '') {
            this.router.navigate(['/employee-home/course', { id: data.id2.split('-')[1] }]);
          }
          return;
        }
        if (res && res.role) {
          if (
            res.role
              .split(',')
              .filter((x: any) => x.trim().toLowerCase() == 'user')[0]
              ?.trim()
              .toLowerCase() == 'user'
          )
            this.router.navigate(['/employee-home/companies']);
          else if (
            res.role
              .split(',')
              .filter((x: any) => x.trim().toLowerCase() == 'admin')[0]
              ?.trim()
              .toLowerCase() == 'admin'
          )
            this.router.navigate(['/admin/dashboard-admin']);
          else this.router.navigate(['/companyadmin/main-page']);
        }

    });

  }

   navigateTourl(val:string){
    this.dataService.getAll(`${this.baseUrl+ApiEndpointType.NavigateToDashboard}/${val}`)
    .then((res:any)=>{
      localStorage.setItem('userDetails', JSON.stringify(res));

      if (res && res.languagePreference) {
        this.translate.setDefaultLang(res.languagePreference);
        localStorage.setItem(
          'lang',
          res.languagePreference.trim().toLowerCase()
        );
      } else localStorage.setItem('lang', 'en');



      ///////////////
      if (res && res.role) {
        if (
          res.role
            .split(',')
            .filter((x: any) => x.trim().toLowerCase() == 'user')[0]
            ?.trim()
            .toLowerCase() == 'user'
        )
         {

           const url = `${environment.baseUri}employee-home/companies`;
           //this.router.navigate(['/employee-home/companies']);
           window.location.href = url;
           window.location.reload();

          }
        else if (
          res.role
            .split(',')
            .filter((x: any) => x.trim().toLowerCase() == 'admin')[0]
            ?.trim()
            .toLowerCase() == 'admin'
        )
         {
            const url = `${environment.baseUri}admin/dashboard-admins`;
            //this.router.navigate(['/employee-home/companies']);
            window.location.href = url;
            window.location.reload();

          //  this.router.navigate(['/admin/dashboard-admin']);

          }
        else {
            const url = `${environment.baseUri}companyadmin/main-page`;
            //this.router.navigate(['/employee-home/companies']);
            window.location.href = url;
            window.location.reload();
         // this.router.navigate(['/companyadmin/main-page']);

        }
      }

    })
    .catch()
  }
  openModal() {
    this.dialog.open(AdminUsersAddComponent);
  }

  exportToExcel() {
    let data = this.rowData;
    data.forEach((element: any) => {
      delete element['Id'];
    });
    this.excelService.downloadFile(data, 'Users');
  }

  EditUser(element: any) {
    const dialogRef = this.dialog.open(AdminUsersAddComponent, {
      data: element,
    });
    dialogRef.afterClosed().subscribe((x) => {
      this.GetAllUsers();
    });
  }
  UpdatePassword(val: any) {
    const dialogRef = this.dialog.open(AdminUpdatePasswordComponent, {
      data: val,
    });
  }

  obj: any = {
    name: '',
    Company: '',
    Email: '',
    UserStatus: '',
    PhoneNumber: '',
    Title: '',
    Role: '',
    SubscriptionDueDate: '',
    Street: '',
    City: '',
    ZipCode: '',
    State: '',
  };

  onChange(val: string, value: string) {
    switch (val) {
      case 'FullName':
        this.obj.name = value;
        break;
      case 'Company':
        this.obj.Company = value;
        break;
      case 'Email':
        this.obj.Email = value;
        break;
      case 'UserStatus':
        this.obj.UserStatus = this.usersActive;
        break;
      case 'PhoneNumber':
        this.obj.PhoneNumber = value;
        break;
      case 'Title':
        this.obj.Title = value;
        break;
      case 'Role':
        this.obj.Role = value;
        break;
      case 'SubscriptionDueDate':
        this.obj.SubscriptionDueDate = new Date(value).toDateString();
        break;
      case 'Street':
        this.obj.Street = value;
        break;
      case 'City':
        this.obj.City = value;
        break;
      case 'ZipCode':
        this.obj.ZipCode = value;
        break;
      case 'State':
        this.obj.State = value;
        break;
      default:
        break;
    }
  }
}
