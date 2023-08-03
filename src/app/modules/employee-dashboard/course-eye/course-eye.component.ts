import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AuthService } from '../../core/guards/auth.service';
import { CustomCertificateComponent } from '../../core/modal/custom-certificate/custom-certificate.component';
import { TranslationService } from '../../core/services/translation.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';

@Component({
  selector: 'app-course-eye',
  templateUrl: './course-eye.component.html',
  styleUrls: ['./course-eye.component.scss'],
})
export class CourseEyeComponent implements OnInit {
  userInfo: any;
  baseUrl: string = environment.apiBase;
  upcomingUserTrainingPlans: any[] = [];
  course: any;
  selectedCourseId: any;
  clickedCourseId: number = 0;
  state$!: Observable<object>;
  params!: Params;
  lang: string = 'en';
  roleAdmin: boolean = false;
  spanishPuchased: boolean = false;
  canSyncToEx: boolean = false;

  constructor(
    private crudService: CrudService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private langService: LanguageService,
    private translationService: TranslationService,
    public translate: TranslateService,
    private authService: AuthService,
    private toast: ToastrService,
  ) { }

  async ngOnInit(): Promise<void> {
    const id: Observable<string> = this.activatedRoute.params.pipe(
      map((p) => p.id)
    );
    this.userInfo = this.authService.getUserInformation();
    await this.checkSpanishPuchase(this.userInfo.userId);
    this.lang =
      this.spanishPuchased
        ? localStorage.getItem('lang')
          ? localStorage.getItem('lang')
          : this.userInfo?.languagePreference
            ? this.userInfo?.languagePreference
            : 'en'
        : 'en';
    id.subscribe((x) => {
      this.clickedCourseId = +x;
      this.userInfo = JSON.parse(localStorage.getItem('userDetails') ?? '');
      this.roleAdmin = (this.userInfo.role as string || "").toLowerCase().split(',').includes('companyadmin');
      this.GetAllUpcomingUserTrainingPlanByUser();
    });
    this.translationService.onLanguageChange.subscribe(x => {
      this.lang = this.spanishPuchased ? x : 'en';
      this.translate.setDefaultLang(this.spanishPuchased ? x : 'en');
    })
  }

  async checkSpanishPuchase(userId: string) {
    await this.crudService
      .getAll(
        this.baseUrl + ApiEndpointType.GetCompanyByUserMainPage + '/' + userId
      )
      .then((x: any) => {
        if (x) {
          this.spanishPuchased = x.purchasedSpanishLanguageCourse;
        }
      })
      .catch((y: any) => { });
  }

  syncToExsafety() {
    this.crudService
      .post(this.baseUrl + ApiEndpointType.SyncToExsafety + '/' + this.selectedCourseId.companyCourseID , {})
      .then((x: any) => {
        if(x.success) {
          this.toast.success(x.message, 'SUCCESS')
        } else {
          this.toast.error(x.message, 'ERROR')
        }
      })
  }

  //upcoming User training plans
  GetAllUpcomingUserTrainingPlanByUser() {
    this.crudService
      .getAll(
        this.baseUrl +
        ApiEndpointType.GetAllUpcomingUserTrainingPlanByUser +
        '/' +
        this.userInfo.userId
      )
      .then((x: any) => {
        this.selectedCourseId = x.userTrainingPlanModelList.find(
          (x: any) => x.credentialID == this.clickedCourseId
        );
        this.selectedCourseId.companyCourse = this.selectedCourseId.companyCourse.find((x: any) => x.langcode.trim().toLowerCase() == 'en'.trim().toLowerCase()).value
        this.selectedCourseId.strDeuOverDueDate = this.selectedCourseId.strDeuOverDueDate.find((x: any) => x.langcode.trim().toLowerCase() == 'en'.trim().toLowerCase()).value
        this.getCourseById();
      })
      .catch((x) => { });
  }

  courseFound: any;
  //get course by Id
  getCourseById() {
    if (this.selectedCourseId)
      this.crudService
        .getAll(this.baseUrl + ApiEndpointType.GetCourseByID + '/' + this.selectedCourseId.courseID)
        .then((x: any) => {
          if (x && x.courseModel) {
            this.canSyncToEx = x.passed;
            this.courseFound = {
              ...x.courseModel,
              courseLink: this.langService.convertLangValueObject(x.courseModel.courseLink),
              description: this.langService.convertLangValueObject(x.courseModel.description),
              handoutLink: this.langService.convertLangValueObject(x.courseModel.handoutLink),
              imageLink: this.langService.convertLangValueObject(x.courseModel.imageLink),
              name: this.langService.convertLangValueObject(x.courseModel.name),
              videoID: this.langService.convertLangValueObject(x.courseModel.videoID),
            };
          }
        })
        .catch((x) => { });
  }

  get dashboardlink() {
    return this.roleAdmin ? '/companyadmin/dashboard' : '/employee-home/companies';
  }

  returnLink(val: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://player.vimeo.com/video/' + val
    );
  }

  openDialog() {
    if (this.courseFound.handoutLink) {
      const dialogRef = this.dialog.open(CustomCertificateComponent, {
        width: '90vw',
        maxWidth: '90vw',
        data: {
          url: this.courseFound.handoutLink[this.lang],
          title: "ViewHandout"
        }
      });
      dialogRef.afterClosed().subscribe((x) => { });
    }
  }
}
