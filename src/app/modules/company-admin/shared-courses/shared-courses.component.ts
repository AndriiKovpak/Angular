import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  Component,
  Inject,
  HostListener,
  NgZone,
  ViewChild,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { NotificationService } from '../../core/services/notification.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { AddNewEmployeeComponent } from '../add-new-employee/add-new-employee.component';

@Component({
  selector: 'app-shared-courses',
  templateUrl: './shared-courses.component.html',
  styleUrls: ['./shared-courses.component.scss'],
})
export class SharedCoursesComponent {
  registerForm!: FormGroup;
  submitted = false;
  selectedYears!: any[];

  baseUrl: string = environment.apiBase;
  isValid: boolean = false;
  languagePreference: string = 'en';
  userInfo: any = {};
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SharedCoursesComponent>,
    private dataService: CrudService,
    private noti: NotificationService,
    public translate: TranslateService,
    private _ngZone: NgZone,
    private toaster: ToastrService,
    private langService: LanguageService
  ) {
    this.userInfo = localStorage.getItem('userDetails');
    this.languagePreference = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
      ? this.userInfo?.languagePreference
      : 'en';
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      courseId: [''],
    });

    this.getCustomCoursesSelectList();
  }
  CustomCourses: any[] = [];
  getCustomCoursesSelectList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetCustomCourseSelectList)
      .then((x: any) => {
        if (x) {

          this.CustomCourses = x;
          this.CustomCourses.forEach((element: any) => {
            element.text = this.langService.simplifyData(
              element.text,
              this.languagePreference
            );
          });
        }
      })
      .catch((x) => {});
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  validateEmail(email: string) {
    const regularExpression = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return regularExpression.test(String(email).toLowerCase());
  }

  onSubmit2(val: string): void {
    if (val == '') {
      this.isValid = true;
      return;
    } else this.isValid = false;

    let email = val.split(',');
    email.forEach((element) => {
      if (element.includes(';')) {
        let semiColonSplit = element.split(';');
        email = email.filter((x) => x != element);
        semiColonSplit.forEach((x) => {
          email.push(x);
        });
      }
    });

    // email.forEach((val) => {
    //   if (this.validateEmail(val)) {
    //     this.dataService
    //       .post(this.baseUrl + ApiEndpointType.CreateInviteUserProfile, {
    //         email: val,
    //         baseUri: this.baseUrl,
    //       })
    //       .then((res: any) => {
    //         if (res) this.noti.showSuccess(res.message, 'SUCCESS');
    //       })
    //       .catch((err) => {
    //         this.noti.showError(err.error, 'ERROR');
    //       });
    //   } else {
    //     this.noti.showError(val + 'this is not valid Email Id', 'ERROR');
    //   }
    // });
    this.dialogRef.close();
  }
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  verifiedEmail: any[] = [];
  notAccptedEmail: boolean = false;
  verfiyEmail(val: string) {
    let data: any = {
      Email: val.trim(),
    };
    this.dataService
      .post(this.baseUrl + ApiEndpointType.VerifyCompanyAdminEmail, data)
      .then((x: any) => {
        if (x == null) {
          this.notAccptedEmail = true;
          this.toaster.error(
            'Rejected – Email(' +
              val +
              ') Not Registered with MyEX (Check Spelling).',
            'ERROR'
          );
        } else {
          this.SelectedCompanyAdminList.push(x.companyID);
          this.notAccptedEmail = false;
          this.toaster.success('Accepted - Valid Email.', 'SUCCESS');
        }
      })
      .catch((x) => {
        if (x) this.toaster.error(x.error, 'ERROR');
      });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    //copy

    this.selectedYears;
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    let email = this.registerForm.value.email.split(',');
    email.forEach((element: string) => {
      if (element.includes(';')) {
        let semiColonSplit = element.split(';');
        email = email.filter((x: any) => x != element);
        semiColonSplit.forEach((x) => {
          email.push(x);
        });
      }
    });
    email.forEach((val: any) => {
      this.verfiyEmail(val);
    });

    if (
      this.SelectedCompanyAdminList.length > 0 &&
      this.SelectedCourseList.length > 0
    ) {
      this.ShareCustomCourses();
    }
  }
  SelectedCompanyAdminList: any[] = [];
  SelectedCourseList: any[] = [];
  ShareCustomCourses() {
    let data: any = {
      SelectedCompanyAdminList: this.SelectedCompanyAdminList,
      SelectedCourseList: this.SelectedCourseList,
    };
    this.dataService
      .post(this.baseUrl + ApiEndpointType.ShareCustomCourses, data)
      .then((x) => {})
      .catch((x) => {});
  }
  selectAll(checkAll: any, select: any, values: any) {
    if (values) {
      this.SelectedCourseList = [];
      values.forEach((element: any) => {
        this.SelectedCourseList.push(element);
      });
    }
  }
  change(val: any) {
    if (val.isUserInput) {
      this.SelectedCourseList.push(val.source.value);
    }
  }
}
