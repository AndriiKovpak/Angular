import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../genric-service/crudservice';
import { LanguageService } from '../../_helpers/languge-filter.service';

@Component({
  selector: 'app-admin-test-questions-add',
  templateUrl: './admin-test-questions-add.component.html',
  styleUrls: ['./admin-test-questions-add.component.scss'],
})
export class AdminTestQuestionsAddComponent implements OnInit {
  languagePreference: string = 'en';
  TestQuestions!: FormGroup;
  baseUrl: string = environment.apiBase;
  buttontext: string = '';
  selectedId: number = 0;
  listData: any[] = [];
  userInfo: any = {};
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dataService: CrudService,
    public ngxLoader: NgxUiLoaderService,
    public toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private langService: LanguageService
  ) {}

  ngOnInit(): void {
    this.userInfo = localStorage.getItem('userDetails');
    this.languagePreference = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
      ? this.userInfo?.languagePreference
      : 'en';
    this.GetTestQuestionSelectList();
    this.initializeForm();

    if (this.data.testId == 0) this.buttontext = 'Add';
    else {
      //  this.getTestData()
      this.buttontext = 'Update';
    }
  }
  getTestData() {
    this.dataService
      .getAll(`${this.baseUrl + ApiEndpointType.TestById}/${this.data.testId}`)
      .then((x) => {})
      .catch((x) => {});
  }
  initializeForm() {
    this.TestQuestions = this.formBuilder.group({
      question: new FormControl('', [Validators.required]),
      course: new FormControl('', [Validators.required]),
    });
  }

  get f() {
    return this.TestQuestions.controls;
  }

  ModalClose() {
    const dialogRef = this.dialog.closeAll();
  }

  UpdateELearning() {

    let data: any = {
      course: null,
      isDeleted: null,
      question: '',
      test: null,
      testID: 0,
      testQuestionID: null,
    };
    data.testID = this.TestQuestions.controls.course.value;

    data.question =this.langService.addDataAccordingToLanguage(this.data.element[0].name,this.languagePreference,this.TestQuestions.controls.question.value)   ;
    if (this.data) {
      data.course = '';
      data.isDeleted = false;
      data.testQuestionID = this.data.testQuestionID;
      data.test = this.data.test;
      this.dataService
        .post(this.baseUrl + ApiEndpointType.UpdateTestQuestions, data)
        .then((x: any) => {
          if (x && x.message) this.toaster.success(x.message, 'SUCCESS');
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    } else
      this.dataService
        .post(this.baseUrl + ApiEndpointType.Testquestions, data)
        .then((x: any) => {
          if (x && x.message) this.toaster.success(x.message, 'SUCCESS');
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    this.ModalClose();
  }

  coursesValid: boolean = false;
  Save() {

    this.TestQuestions.controls.course.value == 0
      ? (this.coursesValid = true)
      : (this.coursesValid = false);
    if (this.TestQuestions.invalid) return;

    this.UpdateELearning();
  }

  GetTestQuestionSelectList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetTestSelectList)
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
  patchValue() {

    this.TestQuestions = this.formBuilder.group({
      question: new FormControl(this.data.question, [Validators.required]),
      course: new FormControl('', [Validators.required]),
    });
    this.selectedId = this.data.testId;
  }
  //{"testQuestionID":null,"question":"what is your name raka?","testID":21,"test":null,"course":null,"isDeleted":null}
}
