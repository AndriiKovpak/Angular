import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AuthService } from '../../core/guards/auth.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.scss'],
})
export class TestResultComponent implements OnInit {
  values: any;
  baseUrl: string = environment.apiBase;
  userInfo: any;
  languagePreference: string = 'en';

  constructor(
    private activated: ActivatedRoute,
    private data: CrudService,
    private crudData: CrudService,
    private authService: AuthService,
    private router: Router,
    private langService: LanguageService
  ) {}
  testId: any;
  ngOnInit(): void {
    this.userInfo = this.authService.getUserInformation();

    const id: Observable<string> = this.activated.params.pipe(map((p) => p.id));
    let value: number = 0;
    id.subscribe((x: any) => {
      value = x;
    });
    if (value > 0) {
      this.testId = value;
      this.getUserTestInformation();
    }
    this.languagePreference = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
      ? this.userInfo?.languagePreference
      : 'en';
  }
  getUserTestInformation() {
    this.crudData
      .getAll(
        `${this.baseUrl + ApiEndpointType.GetUserTestStatusByCompanyCourse}/${
          this.testId
        }`
      )
      .then((x) => {

        this.values = x;
        this.setData();
      })
      .catch((x) => {console.error(x)});
  }
  setData() {
    this.values.courseModel.description =
      this.values.courseModel.description.find(
        (x: any) =>
          x.langcode.trim().toLowerCase() ==
          this.languagePreference.trim().toLowerCase()
      ).value;
    this.values.courseModel.name = this.values.courseModel.name.find(
      (x: any) =>
        x.langcode.trim().toLowerCase() ==
        this.languagePreference.trim().toLowerCase()
    ).value;

    this.values.userTestQuestionAnswerStatusModelList.forEach((element: any) => {
      element.testQuestion = this.langService.simplifyData(
        element.testQuestion,
        this.languagePreference
      );
      element.testQuestionAnswer = this.langService.simplifyData(
        element.testQuestionAnswer,
        this.languagePreference
      );
      element.userSelectedTestQuestionAnswer = this.langService.simplifyData(
        element.userSelectedTestQuestionAnswer,
        this.languagePreference
      );
    })
  }
  ReturnToDashBoard() {
    if(this.userInfo?.role) {
      if((this.userInfo.role as string).toLowerCase().split(',').includes('companyadmin')){
        this.router.navigate(['/companyadmin/dashboard']);
      } else {
        this.router.navigate(['/employee-home/companies']);
      }
    } 
    else {
      this.router.navigate(['/companyadmin/main-page']);
    }
  }
}
