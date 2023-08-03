import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { CompanyCourseModel } from './models/companyCourse.model';
import { CompanyDepartmentModel } from './models/companyDepartment.model';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { CompanyDepartmentCourseModel } from './models/companyDepartmentCourse.model';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss'],
})
export class AssessmentsComponent implements OnInit, AfterViewInit {
  CompanyDepartmentCourseModelList: CompanyDepartmentCourseModel[] = [];
  CompanyDepartmentModelList: CompanyDepartmentModel[] = [];
  CompanyCourseModelList: CompanyCourseModel[] = [];
  CompanyCustomCourseModelList: CompanyCourseModel[] = [];
  userInfo: any;
  baseUrl: string = environment.apiBase;
  IsCustomCoursesPurchased: boolean = false;
  languagePreference: string = 'en';

  constructor(
    public dataService: CrudService,
    public toaster: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    public translate: TranslateService,
    private langService: LanguageService
  ) {
    this.languagePreference = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
      ? this.userInfo?.languagePreference
      : 'en';
    let userDetails: any = JSON.parse(localStorage.getItem('userDetails')??'');
    if (userDetails && userDetails.languagePreference)
      this.translate.setDefaultLang(userDetails.languagePreference);
  }
  ngAfterViewInit(): void {
    this.getUserInformation();
  }

  ngOnInit(): void {}

  // get companies by user
  GetCompanyByUser() {
    this.dataService
      .getAll(
        this.baseUrl +
          ApiEndpointType.GetCompanyByUser +
          '/' +
          this.userInfo.userId
      )
      .then((x: any) => {
        if (x) {
          this.IsCustomCoursesPurchased = x.purchasedCustomCourseCreator;
        }

        //this to load the department course data
        this.loadCompanyDepartmentCourseData();

        //this to load the department  data
        this.loadCompanyDepartmentData();

        //this to load the company course data
        this.loadCompanyCourseData();

        //this to load the company custom course data
        this.loadCompanyCustomCourseData();
      });
  }

  // this function is used to get user information
  getUserInformation() {
    this.userInfo = localStorage.getItem("userDetails")
    if (this.userInfo) {
      this.userInfo = JSON.parse(this.userInfo);

      this.GetCompanyByUser();
    }
  }

  //this to load the department course data
  loadCompanyDepartmentCourseData() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetCompanyDepartmentCourses)
      .then((result: any) => {

        // if (result && result.companyDepartmentCourseModelList) {
        //   result.companyDepartmentCourseModelList.forEach((element: any) => {

        //     element.companyDepartment = this.langService.simplifyData(
        //       element.companyDepartment,
        //       this.languagePreference
        //     );
        //     element.companyCourse = this.langService.simplifyData(
        //       element.companyCourse,
        //       this.languagePreference
        //     );
        //   });

        // }
        this.CompanyDepartmentCourseModelList =
        result.companyDepartmentCourseModelList;
      });
  }

  //this to load the department  data
  loadCompanyDepartmentData() {

    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetCompanyDepartments)
      .then((result: any) => {
        if (result && result.companyDepartmentModelList) {
          result.companyDepartmentModelList.forEach((element: any) => {
            element.name = this.langService.simplifyData(
              element.name,
              this.languagePreference
            );
            element.company = this.langService.simplifyData(
              element.company,
              this.languagePreference
            );
          });
          this.CompanyDepartmentModelList = result.companyDepartmentModelList;
        }
      });
  }

  //this to load the company course data
  loadCompanyCourseData() {

    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetCompanyCourses + '/false')
      .then((result: any) => {
        if (result && result.companyCourseModelList) {
          result.companyCourseModelList.forEach((element: any) => {
            element.company = this.langService.simplifyData(
              element.company,
              this.languagePreference
            );
            element.course = this.langService.simplifyData(
              element.course,
              this.languagePreference
            );
          });
          this.CompanyCourseModelList = result.companyCourseModelList;
        }
      });
  }

  //this to load the company custom course data
  loadCompanyCustomCourseData() {

    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetCompanyCustomCourses + '/false')
      .then((result: any) => {
        if (result && result.companyCourseModelList) {
          result.companyCourseModelList.forEach((element: any) => {
            element.company = this.langService.simplifyData(
              element.company,
              this.languagePreference
            );
            element.course = this.langService.simplifyData(
              element.course,
              this.languagePreference
            );
          });
          this.CompanyCustomCourseModelList = result.companyCourseModelList;
        }
      });
  }

  //to bind checkbox dynamically of custom courses
  customCoursesCheckBox(
    CompanyCourseID?: number,
    CompanyDepartmentID?: number
  ): boolean {
    if (
      this.CompanyDepartmentCourseModelList.some(
        (x: any) =>
          x.companyCourseID == CompanyCourseID &&
          x.companyDepartmentID == CompanyDepartmentID
      )
    )
      return true;
    else return false;
  }

  //to bind checkbox dynamically of my ex courses
  myExCoursesCheckBox(
    CompanyCourseID?: number,
    CompanyDepartmentID?: number
  ): boolean {
    if (
      this.CompanyDepartmentCourseModelList.some(
        (x: any) =>
          x.companyCourseID == CompanyCourseID &&
          x.companyDepartmentID == CompanyDepartmentID
      )
    )
      return true;
    else return false;
  }

  //on change function of custom courses to save the changes
  CompanyDepartmentCourseCheckboxClicked(
    CompanyDepartmentID: number = 0,
    CompanyCourseID: number = 0,
    event?: any
  ) {
    let CompanyDepartmentCourseMod = new CompanyDepartmentCourseModel();

    if (event.target.checked) {
      if (CompanyDepartmentID > 0 && CompanyCourseID > 0) {
        CompanyDepartmentCourseMod.companyDepartmentCourseID = 0;
        CompanyDepartmentCourseMod.companyDepartmentID = CompanyDepartmentID;
        CompanyDepartmentCourseMod.companyCourseID = CompanyCourseID;
      }
      this.ngxLoader.start();
      this.dataService
        .post(
          this.baseUrl + ApiEndpointType.Companydepartmentcourses,
          CompanyDepartmentCourseMod
        )
        .then((x: any) => {
          this.ngxLoader.stop();
        })
        .catch((x) => {
          this.ngxLoader.stop();
        });
    } else {
      let companyDepartmentCourseMod: any =
        this.CompanyDepartmentCourseModelList.find(
          (x) =>
            x.companyDepartmentID == CompanyDepartmentID &&
            x.companyCourseID == CompanyCourseID
        );
      if (
        companyDepartmentCourseMod &&
        companyDepartmentCourseMod.companyDepartmentCourseID > 0
      ) {
        this.ngxLoader.start();
        this.dataService
          .getAll(
            this.baseUrl +
              ApiEndpointType.CompanydepartmentcoursesDelete +
              '/' +
              companyDepartmentCourseMod.companyDepartmentCourseID
          )
          .then((x: any) => {
            this.ngxLoader.stop();
          })
          .catch((x) => {
            this.ngxLoader.stop();
          });
      }
    }
  }
}
