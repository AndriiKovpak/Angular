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
import { CrudService } from '../../genric-service/crudservice';
import { LanguageService } from '../../_helpers/languge-filter.service';

@Component({
  selector: 'app-admin-tests-add',
  templateUrl: './admin-tests-add.component.html',
  styleUrls: ['./admin-tests-add.component.scss'],
})
export class AdminTestsAddComponent implements OnInit {
  languagePreference: string = 'en';
  TestForm!: FormGroup;
  baseUrl: string = environment.apiBase;
  buttontext: string = '';
  selectedId: number = 0;
  listData: any[] = [];
  userInfo: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dataService: CrudService,
    public toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private langService: LanguageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.userInfo = localStorage.getItem('userDetails');
    this.languagePreference = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
      ? this.userInfo?.languagePreference
      : 'en';
    this.GetTestQuestionSelectList();
    if (this.data?.testId == 0) {
      this.buttontext = 'Add';
    } else {
      if (this.data?.testId){
      this.selectedId = this.data.testId;
      this.getTestData();
      this.buttontext = 'Update';}
    }

    this.buttontext = 'Add';

  }
  getTestData() {

    this.dataService
      .getAll(`${this.baseUrl + ApiEndpointType.TestById}/${this.data.testId}`)
      .then((x) => {
        this.data = x;
        this.initializeForm();
        this.patchValue();
      })
      .catch((x) => {});
  }
  initializeForm() {
    this.TestForm = this.formBuilder.group({
      numberOfQuestions: new FormControl(0, [Validators.required]),
      course: new FormControl(null),
      question: new FormControl('', [Validators.required]),
      answer: new FormControl('', [Validators.required]),
      testID: new FormControl(null),
      courseID: new FormControl(0, [Validators.required]),
      isDeleted: new FormControl(null),
      passingScore: new FormControl(0),
    });
  }
  get f() {
    return this.TestForm.controls;
  }
  ModalClose() {
    const dialogRef = this.dialog.closeAll();
  }

  UpdateELearning() {
    if (this.data?.testId &&this.data.testId !== 0) {
      let data: any = {
        course: this.data?.course.name,
        courseID: 0,
        isDeleted: this.data?.isDeleted,
        numberOfQuestions: 0,
        passingScore: this.data?.passingScore,
        testID: this.TestForm.value.courseID,
      };
      data.courseID = this.data.courseID;
      data.numberOfQuestions = this.TestForm.value.numberOfQuestions;
      this.dataService
        .post(this.baseUrl + ApiEndpointType.UpadateTests, data)
        .then((x: any) => {
          if (x) this.toaster.success(x.message, 'SUCCESS');
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    }
    let data: any = {
      course: this.data?.course?.name,
      courseID: this.TestForm.value.courseID,
      isDeleted: false,
      numberOfQuestions:this.TestForm.value.numberOfQuestions,
      passingScore: 0,
      testID:0,
      question:this.langService.createFormat(this.TestForm.controls.question.value,this.languagePreference),
      answer:this.langService.createFormat(this.TestForm.controls.answer.value,this.languagePreference)

    };
    // this.TestForm.controls.question =this.langService.createFormat(this.TestForm.controls.question.value,this.languagePreference)
      this.dataService
        .post(this.baseUrl + ApiEndpointType.SaveTestsWithQuestion, data)
        .then((x: any) => {
          if (x) this.toaster.success(x.message, 'SUCCESS');
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    this.ModalClose();
  }

  coursesValid: boolean = false;
  Save() {
    this.TestForm.controls.courseID.value == 0
      ? (this.coursesValid = true)
      : (this.coursesValid = false);
    if (this.TestForm.invalid) return;
    this.UpdateELearning();
  }
  dropDownData: any[] = [];
  GetTestQuestionSelectList() {
    let url = ApiEndpointType.GetTestSelectList
    if (this.data =='custom'){
url=ApiEndpointType.GetCustomCourseSelectList
    }
    this.dataService
      .getAll(this.baseUrl +url)
      .then((x: any) => {
        let data = JSON.stringify(x);
        this.dropDownData = JSON.parse(data);
        if (x) {
          this.dropDownData.forEach((element: any) => {
            element.text = this.langService.simplifyData(
              element.text,
              this.languagePreference
            );
          });

          this.listData = this.dropDownData;
        }

        // if (this.data) this.patchValue();
      })
      .catch((x) => {});
  }
  patchValue() {
    this.TestForm = this.formBuilder.group({
      numberOfQuestions: new FormControl(this.data.numberOfQuestions, [
        Validators.required,
      ]),
      courseID: new FormControl(this.data.testID, [Validators.required]),
    });
    this.selectedId = this.data.testID;
  }
  //{"testID":null,"numberOfQuestions":1,"courseID":1,"course":null,"isDeleted":null,"passingScore":0}
}
