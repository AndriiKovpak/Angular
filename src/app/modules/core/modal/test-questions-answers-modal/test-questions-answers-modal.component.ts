import { testGrid } from './../../../admin-dashboard/test/model/testGrid.model';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { threadId } from 'worker_threads';
import { CrudService } from '../../genric-service/crudservice';
import { ThemeService } from 'ng2-charts';
import { LanguageService } from '../../_helpers/languge-filter.service';
@Component({
  selector: 'app-test-questions-answers-modal',
  templateUrl: './test-questions-answers-modal.component.html',
  styleUrls: ['./test-questions-answers-modal.component.scss'],
})
export class TestQuestionsAnswersModalComponent implements OnInit {
  QuestionAnswerForm!: FormGroup;
  baseUrl: string = environment.apiBase;
  listData: any[] = [];
  buttontext: string = '';
  selectedId: number = 0;
  languagePreference: string = 'en';
  userInfo: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private dataService: CrudService,
    private toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private langService: LanguageService
  ) {}

  ngOnInit(): void {
    this.FormInitialize();
    this.GetTestQuestionSelectList();
    this.userInfo = localStorage.getItem('userDetails');
    this.languagePreference = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
      ? this.userInfo?.languagePreference
      : 'en';

    if (this.data.testId !== 0) {
      this.buttontext = 'Add';
    } else {
      // this.getTestData()
      this.buttontext = 'Update';
    }
  }
  getTestData() {
    this.dataService
      .getAll(`${this.baseUrl + ApiEndpointType.TestById}/${this.data.testId}`)
      .then((x) => {})
      .catch((x) => {});
  }
  patchValue() {
    this.QuestionAnswerForm = this.formBuilder.group({
      Answer: new FormControl(this.data.answer, [Validators.required]),
      TestQuestion: new FormControl(this.data.testQuestionId, [
        Validators.required,
      ]),
      IsCorrectAnswer: new FormControl(this.data.isCorrectAnswer),
    });
    this.selectedId = this.data.testId;
  }
  FormInitialize() {
    this.QuestionAnswerForm = this.formBuilder.group({
      Answer: new FormControl('', [Validators.required]),
      TestQuestion: new FormControl('', [Validators.required]),
      IsCorrectAnswer: new FormControl(false),
    });
  }
  get f() {
    return this.QuestionAnswerForm.controls;
  }
  ModalClose() {
    const dialogRef = this.dialog.closeAll();
  }

  GetTestQuestionSelectList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetTestQuestionSelectList)
      .then((x: any) => {
        if (x) {
          x.forEach((element: any) => {
            element.text = this.langService.simplifyData(
              element.text,
              this.languagePreference
            );
          });
          this.listData = x;
        }

        if (this.data) this.patchValue();
      })
      .catch((x) => {});
  }
  onTestQuestionAns(val: any) {}
  submit() {
    if (this.QuestionAnswerForm.invalid) return;


    let data: any = {
      answer: '',
      isCorrectAnswer: false,
      isDeleted: null,
      testQuestion: null,
      testQuestionAnswerID: null,
      testQuestionID: 0,
    };

    data.answer = this.langService.addDataAccordingToLanguage(this.data.element[0].name,this.languagePreference,this.QuestionAnswerForm.value.Answer) ;
    data.isCorrectAnswer = this.QuestionAnswerForm.value.IsCorrectAnswer;
    data.testQuestionID = this.QuestionAnswerForm.value.TestQuestion;

    if (this.data.testId == 0) {
      data.isDeleted = this.data.isDeleted;
      data.testQuestion = this.data.testQuestion;
      data.testQuestionAnswerID = this.data.testQuestionAnswerId;
      this.dataService
        .post(this.baseUrl + ApiEndpointType.UpdateTestQuestionAnswers, data)
        .then((x: any) => {
          if (x && x.message) this.toaster.success(x.message, 'SUCCESS');
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    } else
      this.dataService
        .post(this.baseUrl + ApiEndpointType.AddTestQuestionAnswers, data)
        .then((x: any) => {
          if (x && x.message) this.toaster.success(x.message, 'SUCCESS');
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    this.ModalClose();
  }
}
