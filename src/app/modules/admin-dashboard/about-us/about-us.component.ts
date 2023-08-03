import { LanguageService } from './../../core/_helpers/languge-filter.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AuthService } from '../../core/guards/auth.service';
import { AddAboutusComponent } from '../../core/modal/add-aboutus/add-aboutus.component';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit, AfterViewInit {
  //for paging
  pageIndex: number = 1;
  pageSize: number = 10;
  count: number = 5;
  activePage: number = 0;
  length: number = 2;
  lang: string = 'en';

  activeInactiveList: any[] = [];
  isActive: boolean = true;

  //dataSource = new MatTableDataSource();
  baseUrl: string = environment.apiBase;
  adminUsersData: any;
  statusList: any;
  paginationArray: number[] = [5];
  rowData!: any;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayTestColumns: string[] = [
    'name',
    'designation',
    'image',
    'description',
    'specification',
    'edit',
  ];
  userInfo: any;
  constructor(
    public dataService: CrudService,
    public ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog,
    private toaster: ToastrService,
    private changeDetectorRefs: ChangeDetectorRef,
    private authService: AuthService,
    private langService: LanguageService,
    private translation: TranslationService,
  ) { }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInformation();
    this.translation.onLanguageChange.subscribe((l: string) => {
      this.lang = l
    })
    this.GetAboutUsList();
  }

  name: string = '';
  description: string = '';
  designation: string = '';

  onBlurMethod(val: string, value: string) {
    switch (val) {
      case 'name':
        this.name = value;
        this.GetAboutUsList();
        break;
      case 'description':
        this.description = value;
        this.GetAboutUsList();
        break;
      case 'designation':
        this.designation = value;
        this.GetAboutUsList();
        break;

      default:
        break;
    }
  }

  public getServerData(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.pageIndex == 0) this.pageIndex = 1;
    this.GetAboutUsList();
  }

  //get the list of admin users
  GetAboutUsList() {
    let paging: any = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      Name: this.name,
      description: this.description,
      desigination: this.designation,
      active: this.isActive
    };

    this.dataService
      .post(this.baseUrl + ApiEndpointType.GetListUsersAboutUs, paging)
      .then((x: any) => {
        if (x?.length > 0) {
          this.count = x.length;
          this.length = this.count;
          this.dataSource.data = x.map((element: any) => {
            return {
              ...element,
              name: this.langService.convertLangValueObject(element.name),
              designation: this.langService.convertLangValueObject(element.designation),
              description: this.langService.convertLangValueObject(element.description),
              miniDescription: this.langService.convertLangValueObject(element.miniDescription)
            }
          })
          this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource.data = [];
        }
      });
  }

  openModal() {
    const dialogRef = this.dialog.open(AddAboutusComponent, {});
    dialogRef.afterClosed().subscribe(x => {
      this.GetAboutUsList()
    })
  }

  AddopenModal(element: any) {
    const dialogRef = this.dialog.open(AddAboutusComponent, {
      data: element,
    });
    dialogRef.afterClosed().subscribe((x) => {
      this.GetAboutUsList();
      this.changeDetectorRefs.detectChanges();
    });
  }

  deleteTestQuestionAns(val: any) {
    if (confirm('Are you sure to delete this record?')) {
      this.dataService
        .post(`${this.baseUrl + ApiEndpointType.DeleteAboutUs}`, val.id )
        .then((x: any) => {
          if (x && x.message) this.toaster.success(x.message, 'SUCCESS');
          this.GetAboutUsList();
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    }
  }
}
