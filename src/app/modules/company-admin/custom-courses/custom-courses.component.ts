import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ExcelService } from '../../core/excel/excel.service';
import { CrudService } from '../../core/genric-service/crudservice';
import { AdminCoursesAddComponent } from '../../core/modal/admin-courses-add/admin-courses-add.component';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { EditTestModalComponent } from "../../core/modal/edit-test-modal/edit-test-modal.component";
import { getPagenation as getPagination } from '../../core/_helpers/pagenation-array';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-custom-courses',
  templateUrl: './custom-courses.component.html',
  styleUrls: ['./custom-courses.component.scss']
})
export class CustomCoursesComponent implements OnInit {

  //for paging
  pageIndex: number = 0;
  pageSize: number = 10;
  length: number = 2;

  baseUrl: string = environment.apiBase;
  originData: any;
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
    private toaster: ToastrService,
    private changeDetectorRefs: ChangeDetectorRef,
    private langService: LanguageService,
    private translateService: TranslationService,
  ) { }
  ngOnInit(): void {
    this.GetAllCourses();
    this.userInfo = localStorage.getItem('userDetails');
    this.lang = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
        ? this.userInfo?.languagePreference
        : 'en';
    this.translateService.onLanguageChange.subscribe((l: string) => {
      this.lang = l;
    })
  }

  answer: string = '';
  question: string = '';

  onBlurMethod(val: string, value: string) {
    switch (val) {
      case 'name':
        this.answer = value;
        this.pageIndex = 0;
        this.GetAllCourses();
        break;
      case 'Video':
        this.question = value;
        this.pageIndex = 0;
        this.GetAllCourses();
        break;
      case 'top':
        this.answer = value;
        this.question = value;
        this.pageIndex = 0;
        this.GetAllCourses();
        break;
      default:
        break;
    }
  }
  
  GetAllCourses() {
    let paging: any = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      Answer: this.answer,
      Questions: this.question,
    };

    this.dataService
      .post(this.baseUrl + ApiEndpointType.CustomCoursesPagination, paging)
      .then((x: any) => {
        if (x.courseModelList.length > 0) {
          this.dataSource = x.courseModelList.map((elem: any) => {
            return {
              ...elem,
              id: elem.courseID,
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
          this.paginationArray = getPagination(this.length);
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
    'edit',
  ];

  public getServerData(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.GetAllCourses();
  }

  toHoursString(minutes: number) {
    const hours = Math.floor(minutes / 60);
    // const minutesString = (minutes % 60).toString().padStart(2,'0'); // if we decide to use 0:00 format
    return `${hours} HR ${minutes % 60} MIN`;
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
        isCustomCourse: true,
      }
    })
    dialogRef.afterClosed().subscribe((x) => {
      this.GetAllCourses();
      this.changeDetectorRefs.detectChanges();
    });
  }

  openEditTestModal(element: any) {
    this.dialog.open(EditTestModalComponent, {
      data: { id: element.id }
    });
  }

  deleteTestQuestionAns(val: any) {
    if (confirm('Are you sure to delete this record?')) {
      this.dataService
        .getAll(`${this.baseUrl + ApiEndpointType.DeleteCourses}/${val.courseID}/true`)
        .then((x: any) => {
          if (x && x.message) {
            this.toaster.success(x.message, 'SUCCESS');
            this.GetAllCourses();
          }

          // this.getCompaniesGridData();
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    }
  }
}

