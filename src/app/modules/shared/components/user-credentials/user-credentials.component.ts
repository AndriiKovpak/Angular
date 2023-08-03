import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CrudService } from '../../../core/genric-service/crudservice';
import { LanguageService } from '../../../core/_helpers/languge-filter.service';
import { ApiEndpointType } from '../../enums/api.routes';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { FileSaverService } from 'ngx-filesaver';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeAddCredentialsComponent } from '../../../core/modal/employee-add-credentials/employee-add-credentials.component';

@Component({
  selector: 'app-user-credentials',
  templateUrl: './user-credentials.component.html',
  styleUrls: ['./user-credentials.component.scss'],
})
export class UserCredentialsComponent implements OnInit {
  userCredentialsPageIndex: number = 0;
  userCredentialsPageSize: number = 10;
  userCredentialsCount: number = 0;
  credentialsSort: any = null;
  events: string[] = []; //
  document: string = '';
  typeId: number = 0;
  activateAfterData: boolean = false;
  baseUrl: string = environment.apiBase;
  columnsToDisplayCredentials = [
    'credentialType',
    'document',
    'date',
    'credentialTypeID',
  ];
  CredentialTypeSelectList: any[] = [];
  credentialsDataSource = new MatTableDataSource();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  @Input() currentUserId: string = '';
  @Input() activeCustomCourses: boolean = false;
  @Input() languagePreference: string = '';
  @Input() customCoursesActive: boolean = true;

  @ViewChild('MatPaginatorUserCredentials')
  MatPaginatorUserCredentials!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(
    private crudService: CrudService,
    private dialog: MatDialog,
    private _FileSaverService: FileSaverService,
    private langService: LanguageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.GetCredentialTypeSelectList();
    this.GetUserCredentials();
  }

  GetUserCredentialsServerData(event: PageEvent) {
    this.userCredentialsPageIndex = event.pageIndex;
    this.userCredentialsPageSize = event.pageSize;
    this.GetUserCredentials();
  }

  userCredentialsSortChange(sortState: Sort) {
    this.userCredentialsPageIndex = 0;
    this.credentialsSort = sortState;
    this.GetUserCredentials();
  }

  GetUserCredentials() {
    let data: any = {
      UserId: this.currentUserId,
      isActiveInActive: !this.customCoursesActive,
      start: this.range.value.start,
      end: this.range.value.end,
      document: this.document,
      typeId: this.typeId,
      sort: this.credentialsSort,
      pageIndex: this.userCredentialsPageIndex,
      pageSize: this.userCredentialsPageSize,
    };

    this.crudService
      .post(this.baseUrl + ApiEndpointType.GetUserCredentialsByUser, data)
      .then((x: any) => {
        let data = x.userCredentialModelList;
        data.forEach((element: any) => {
          element.credentialType = this.langService.simplifyData(
            element.credentialType,
            this.languagePreference
          );
        });
        data.forEach((element: any) => {
          element.name = this.langService.simplifyData(
            element.name,
            this.languagePreference
          );
        });
        this.userCredentialsCount = x.count;
        this.credentialsDataSource.data = [...data];
        this.credentialsDataSource.sort = this.sort;
        this.credentialsDataSource.paginator = this.MatPaginatorUserCredentials;
        this.customCoursesActive
        ? (this.activateAfterData = false)
        : (this.activateAfterData = true);
      })
      .catch((x) => {});
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.userCredentialsPageIndex = 0;
    this.events.push(`${type}: ${event.value}`); //
    this.GetUserCredentials();
  }

  //this function is used to download all the certificates
  downloadamtawardsreport() {
    this.crudService
      .getBlobSingleWithParams(
        `${this.baseUrl + ApiEndpointType.DownloadAllUserCredentialDocument}/${
          this.currentUserId
        }`
      )
      .then((x) => {
        if (x) {
          let fileName = 'CredentialFilesByUser_' + this.currentUserId + '.pdf';
          this._FileSaverService.save(x, fileName);
        } else {
          this.toastr.info('No certificate found.');
        }
      })
      .catch((x) => {
        this.toastr.info('No certificate found.');
      });
  }

  //this function is to download for per record
  download(element: any) {
    if (element && element.applicationUserID)
      this.crudService
        .getBlobSingleWithParams(
          `${this.baseUrl + ApiEndpointType.DownloadUserCredentialDocument}/${
            element.credentialID
          }`
        )
        .then((x) => {
          if (x) {
            let fileName =
              'CredentialFilesByCredential_' + element.credentialID + '.pdf';
            this._FileSaverService.save(x, fileName);
          } else {
            this.toastr.info('No certificate found.');
          }
        })
        .catch((x) => {
          this.toastr.info('No certificate found.');
        });
  }

  //this function is used to open the modal to add credentials
  openModal() {
    const dialogRef = this.dialog.open(EmployeeAddCredentialsComponent, {
      data: {
        data: this.CredentialTypeSelectList,
        applicationUserId: this.currentUserId,
      },
    });

    dialogRef.afterClosed().subscribe((x) => {
      if (x) {
        this.GetUserCredentials();
      }
    });
  }


  //this function is used to get data for credentials tab
  GetCredentialTypeSelectList() {
    this.crudService
      .getAll(this.baseUrl + ApiEndpointType.GetCredentialTypeSelectList)
      .then((x: any) => {
        if (x) this.CredentialTypeSelectList = x;
      })
      .catch((x) => {});
  }

  edit(element: any) {
    const dialogRef = this.dialog.open(EmployeeAddCredentialsComponent, {
      data: {
        data: this.CredentialTypeSelectList,
        applicationUserId: this.currentUserId,
        element: element,
      },
    });

    dialogRef.afterClosed().subscribe((x: any) => {
      if (x) {
        this.GetUserCredentials();
      }
    });
  }

   //this function is used to delete the company courses
   deleteCompanyCourses(val: any, type: string) {
    if (val && val > 0) {
      let active: boolean = false;
      type === 'delete' ? (active = true) : active;
      active
        ? confirm('Are you sure you want to delete this record?')
        : confirm('Are you sure you want to restore this record?');
      this.crudService
        .getAll(
          this.baseUrl +
            ApiEndpointType.deleteUserCredentials +
            '?id=' +
            val +
            '&isActiveInActive=' +
            active
        )
        .then((x: any) => {
          if (x) {
            active
              ? this.toastr.success(x.message, 'SUCCESS')
              : this.toastr.success(x.message, 'SUCCESS');

            this.GetUserCredentials();
          }
        })
        .catch((x) => {});
    }
  }

  onCustomCoursesSelection() {
    this.GetUserCredentials();
  }
}
