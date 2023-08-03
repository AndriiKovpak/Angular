import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AuthService } from '../../core/guards/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';

@Component({
  selector: 'app-take-test',
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.scss'],
})
export class TakeTestComponent implements OnInit {
  lang: string = 'en';
  baseUrl: string = environment.apiBase;
  userInfo: any;
  companyCourseID: number = 0;
  applicationUserID: string = '';
  spanishPuchased: boolean = false;
  constructor(
    private data: CrudService,
    private activated: ActivatedRoute,
    private authService: AuthService,
    private toaster: ToastrService,
    private router: Router,
    private langService: LanguageService,
    private translation: TranslationService,
    private translate: TranslateService
  ) { }

  async ngOnInit(): Promise<void> {
    this.userInfo = this.authService.getUserInformation();
    await this.checkSpanishPuchase(this.userInfo.userId);
    if (this.userInfo) this.applicationUserID = this.userInfo.userId;
    this.lang =
      this.spanishPuchased
        ? localStorage.getItem('lang')
          ? localStorage.getItem('lang')
          : this.userInfo?.languagePreference
            ? this.userInfo?.languagePreference
            : 'en'
        : 'en';
    this.translation.onLanguageChange.subscribe((l: string) => {
      if (this.spanishPuchased) {
        this.translate.setDefaultLang(l);
        this.lang = l
      } else {
        this.lang = 'en';
      }
    });
    const id: Observable<string> = this.activated.params.pipe(map((p) => p.id));
    let value: number = 0;
    id.subscribe((x: any) => {
      value = x;
    });
    if (value > 0) {
      this.companyCourseID = +value;
      this.getTestQuestionAndAns(value);
    }
  }

  async checkSpanishPuchase(userId: string) {
    await this.data
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
  values: any;
  getTestQuestionAndAns(val: any) {
    this.data
      .getAll(
        `${this.baseUrl + ApiEndpointType.GetAllTestQuestionByCompanyCourse
        }/${val}`
      )
      .then((x) => {
        this.values = x;
        this.setData();
        this.getTestQuestion(0);
      })
      .catch((x) => { console.error(x) });
  }
  setData() {
    this.values.courseModel.description =
      this.langService.convertLangValueObject(this.values.courseModel.description);
    this.values.courseModel.name =
      this.langService.convertLangValueObject(this.values.courseModel.name);
    this.values.testQuestionAnswerModelList.forEach((element: any) => {
      element.testQuestion =
        this.langService.convertLangValueObject(element.testQuestion);
      element.answer =
        this.langService.convertLangValueObject(element.answer);
    })
    this.values.testQuestionModelList.forEach((element: any) => {
      element.question =
        this.langService.convertLangValueObject(element.question)
    })
  }
  getTheFirstQuestion: any = null;

  getTestQuestion(val: any = 0) {
    this.getTheFirstQuestion = this.values.testQuestionModelList[val];
    this.getTestAnswers(0);
  }
  presentTestAnswers: any;

  getTestAnswers(val: any) {
    this.presentTestAnswers = this.values.testQuestionAnswerModelList.filter(
      (x: any) => x.testQuestionID == this.getTheFirstQuestion.testQuestionID
    );
    //return this.presentTestAnswers;
  }
  SelectedTestQuestionAnswerList: any[] = [];
  handleChange(event: any, ans: any) {
    let index = this.SelectedTestQuestionAnswerList.findIndex(q => q.testQuestionID === ans.testQuestionID);
    if(index < 0) {
      this.SelectedTestQuestionAnswerList.push(ans);
    } else {
      this.SelectedTestQuestionAnswerList[index] = ans;
    }
  }
  checked(val: any) {
    if (this.SelectedTestQuestionAnswerList.length > 0) {
      let data = this.SelectedTestQuestionAnswerList.filter(
        (x) => x.testQuestionAnswerID == val.testQuestionAnswerID
      );
      if (data.length > 0) return true;
      else return false;
    } else return false;
  }
  i: number = 0;
  getNextQuestion() {
    if (this.SelectedTestQuestionAnswerList.length < this.i + 1){
      this.toaster.error('Please select test question answer.', 'ERROR');
      return;
    }
    this.i = this.i + 1; // increase i by one
    // this.i = this.i % this.values.testQuestionModelList.length; // if we've gone too high, start from `0` again
    this.getTestQuestion(this.i);
    // return this.values.testQuestionModelList[this.i]; // give us back the item of where we are now
  }
  prevItem() {
    if (this.i === 0) {
      // i would become 0
      this.i = this.values.testQuestionModelList.length; // so put it at the other end of the array
    }
    this.i = this.i - 1; // decrease by one
    this.getTestQuestion(this.i);
    //return this.values.testQuestionModelList[this.i]; // give us back the item of where we are now
  }
  submitTest() {
    if (this.SelectedTestQuestionAnswerList.length < this.i + 1) {
      this.toaster.error('Please select test question answer.', 'ERROR');
      return;
    }
    if (confirm('Are you sure you want to finish this test?')) {
      let data: any = {
        applicationUserID: this.applicationUserID,
        companyCourseID: this.companyCourseID,
        testQuestionAnswerModelList: this.SelectedTestQuestionAnswerList.map(
          (elem) => {
            return {
              ...elem,
              answer: elem.answer.en,
              testQuestion: elem.testQuestion.en,
            }
          }
        ),
      };

      this.data
        .post(this.baseUrl + ApiEndpointType.saveusertest, data)
        .then((x: any) => {
          if (x && x.message) this.toaster.success(x.message, 'SUCCESS');

          this.router.navigate([
            '/employee-home/testResult',
            this.companyCourseID,
          ]);
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    }
  }
}
