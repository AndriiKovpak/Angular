import { TranslateService } from '@ngx-translate/core';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ExcelService } from '../../core/excel/excel.service';
import { CrudService } from '../../core/genric-service/crudservice';
import { AdminCoursesAddComponent } from '../../core/modal/admin-courses-add/admin-courses-add.component';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { TranslationService } from '../../core/services/translation.service';
import { getPagenation } from '../../core/_helpers/pagenation-array';
import { EditTestModalComponent } from '../../core/modal/edit-test-modal/edit-test-modal.component';

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss'],
})
export class AdminCoursesComponent implements OnInit, AfterViewInit {
  //for paging
  pageIndex: number = 0;
  pageSize: number = 10;
  count: number = 5;
  length: number = 2;

  activeInactiveList: any[] = [];
  isActive: boolean = true;

  //dataSource = new MatTableDataSource();
  // baseUrl: string =
  //   'https://myex-api-myex-api-miltilingual.azurewebsites.net';
  baseUrl: string = environment.apiBase;
  adminUsersData: any;
  statusList: any;
  paginationArray: number[] = [5];
  rowData!: any;
  dataSource = new MatTableDataSource();
  userInfo: any = {};
  lang: string = 'en';
  constructor(
    public dataService: CrudService,
    public ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private toaster: ToastrService,
    private changeDetectorRefs: ChangeDetectorRef,
    private langService: LanguageService,
    private translateService: TranslationService,
  ) { }

  ngOnInit(): void {
    this.GetAllCourses();
    this.userInfo = JSON.parse(localStorage.getItem('userDetails') ?? '');
    this.lang = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
        ? this.userInfo?.languagePreference
        : 'en';
    this.translateService.onLanguageChange.subscribe((l: string) => {
      this.lang = l;
    })
  }

  @ViewChild('MatPaginator') paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  answer: string = '';
  question: string = '';
  // (blur)="onBlurMethod('City')"
  onBlurMethod(val: string, value: string) {
    switch (val) {
      case 'name':
        this.answer = value;
        this.GetAllCourses();
        break;
      case 'Video':
        this.question = value;
        this.GetAllCourses();
        break;

      default:
        break;
    }
  }

  onActiveChange() {
    this.pageIndex = 0;
    this.GetAllCourses();
  }

  // download pdf
  downloadPdfwithCheck(val: string) {

    let data: any = document.getElementById('contentToConvert');
    this.excelService.downloadpdf(data, val);
  }

  //get the list of admin users
  GetAllCourses() {
    // this.ngxLoader.start();
    let paging: any = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      Answer: this.answer,
      Questions: this.question,
      isDeleted: !this.isActive,
    };
    this.dataService
      .post(this.baseUrl + ApiEndpointType.GetAllCourses, paging)
      .then((x: any) => {
        if (x.courseModelList.length > 0) {
          this.dataSource = x.courseModelList.map((elem: any) => {
            return {
              ...elem,
              description: this.langService.convertLangValueObject(elem.description || ""),
              name: this.langService.convertLangValueObject(elem.name || ""),
              video: this.langService.convertLangValueObject(elem.videoID || ""),
              courseLink: this.langService.convertLangValueObject(elem.courseLink || ""),
              imageLink: this.langService.convertLangValueObject(elem.imageLink || ""),
              handoutLink: this.langService.convertLangValueObject(elem.handoutLink || ""),
              totalTrainingTime: elem.totalTrainingTime
            }
          })
          this.length = x.count;
          this.paginationArray = getPagenation(this.length);
        } else {
          this.dataSource.data = [];
        }
      });
  }

  displayedColumnsCourses: string[] = [
    'Name',
    'Video',
    'CourseLink',
    'TotalTrainingTime',
    'Edit',
  ];

  public getServerData(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.GetAllCourses();
  }

  openModalForLanguageSelected(element: any) {
    const dialogRef = this.dialog.open(AdminCoursesAddComponent, {
      data: {
        obj: element
      }
    });
  }
  exportToExcel(event: any) {
    let data = this.rowData;
    data.forEach((element: any) => {
      delete element['Id'];
    });
    this.excelService.downloadFile(data, 'Companies');
  }

  AddopenModal(data: any) {
    const dialogRef = this.dialog.open(AdminCoursesAddComponent, {
      data: data || {
        name: { en: "", es: "" },
        totalTrainingTime: 0,
        description: { en: "", es: "" },
        courseTotalTraningTime: "",
        video: { en: "", es: "" },
        courseLink: { en: "", es: "" },
        totalTraiing: { en: "", es: "" },
        imageLink: { en: "", es: "" },
        handoutLink: { en: "", es: "" },
        isCustomCourse: false,
      }
    });
    dialogRef.afterClosed().subscribe((x) => {
      this.GetAllCourses();
      this.changeDetectorRefs.detectChanges();
    });
  }
  deleteTestQuestionAns(elem: any, val: boolean) {
    if (confirm('Are you sure to delete this record?')) {
      this.dataService
        .getAll(`${this.baseUrl + ApiEndpointType.DeleteCourses}/${elem.courseID}/${val}`)
        .then((x: any) => {
          if (x && x.message) this.toaster.success(x.message, 'SUCCESS');
          this.GetAllCourses();
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    }
  }

  openEditTestModal(element: any) {
    this.dialog.open(EditTestModalComponent, {
      data: { id: element.courseID }
    });
  }
}
