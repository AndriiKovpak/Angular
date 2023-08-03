import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  Component, ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {map, startWith, take} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { NotificationService } from '../../core/services/notification.service';
import { TranslationService } from '../../core/services/translation.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import {ICreateUserByUsername} from "../models/ICreateUserByUsername";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {Observable} from "rxjs";
import {CompanyAdminService} from "../service/company-admin.service";
import {UserService} from "../../core/services/user.service";
import {ISelectListItem} from "../../core/models/ISelectListItem";
import {startsWith} from "ag-grid-community/dist/lib/utils/string";

@Component({
  selector: 'app-add-new-employee',
  templateUrl: './add-new-employee.component.html',
  styleUrls: ['./add-new-employee.component.scss'],
})
export class AddNewEmployeeComponent {
  registerForm!: FormGroup;
  submitted = false;
  selectByEmail: boolean = true;
  baseUrl: string = environment.apiBase;
  safetySensitiveSelectedValue: string = '1';
  eligibleForAmtSelectedValue: string = 'Yes';


  selectedDepartmentNames: string[] = [];
  filteredDepartmentNames!: Observable<string[]>;
  allDepartments: ISelectListItem[] = [];
  // allDepartmentNames: string[] = [];

  departmentControl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('departmentInput') departmentInput!: ElementRef<HTMLInputElement>;
  @ViewChild('autocompleteTrigger') matACTrigger!: MatAutocompleteTrigger;

  // userModel: ICreateUserByUsername = {
  //   eligibleForAmtAwards: false,
  //   firstName: '',
  //   isSafetySensitive: false,
  //   password: '',
  //   selectedDepartmentIds: [],
  //   username: '',
  //   title: '',
  //   lastName: ''
  // };

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddNewEmployeeComponent>,
    private dataService: CrudService,
    private noti: NotificationService,
    public translate: TranslateService,
    public translationService: TranslationService,
    private _ngZone: NgZone,
    private companyAdminService: CompanyAdminService,
    private userService: UserService,
  ) {
    let userDetails: any = JSON.parse(
      localStorage.getItem('userDetails') ?? ''
    );
    if (userDetails && userDetails.languagePreference)
      this.translate.setDefaultLang(userDetails.languagePreference);

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      title: ['', []],
      safetySensitive: ['1', [Validators.required]],
    });
  }

  selectOption(event: any) {
    this.selectByEmail = event.value;
  }

  ngOnInit(): void {
    this.switchLanguage();
    this.userService.getUserInfo().subscribe(userInfo => {
      if (userInfo) {
        const departmentList = this.companyAdminService.GetDepartmentSelectListByCompany(userInfo.companyId);
        departmentList.subscribe(departments => {
          this.allDepartments = departments;
        })
      }
    });
    this.filteredDepartmentNames = this.departmentControl.valueChanges.pipe(
      startWith(null),
      map((departmentName: string | null) =>
        departmentName ? this._filter(departmentName) : this.allDepartments.map(x => x.text)
      )
    )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allDepartments.filter(
      (department) => department.text.toLowerCase().indexOf(filterValue) >= 0
    ).map(x => x.text);
  }

  switchLanguage() {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  validateEmail(email: string) {
    const regularExpression = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return regularExpression.test(String(email).toLowerCase());
  }

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.selectByEmail) {
      this.createUserByEmail();
    } else {
      this.createUserByUsername();
    }
  }

  createUserByUsername() {
    if (!this.registerForm.controls.username.valid || !this.registerForm.controls.password.valid) {
      return;
    }

    const userModel: ICreateUserByUsername = {
      username: this.registerForm.controls.username.value.trim(),
      password: this.registerForm.controls.password.value.trim(),
      firstName: this.registerForm.controls.firstName.value.trim(),
      lastName: this.registerForm.controls.lastName.value.trim(),
      title: this.registerForm.controls.title.value.trim(),
      isSafetySensitive: this.registerForm.controls.safetySensitive.value.trim() == "1",
      selectedDepartmentIds: this.allDepartments.filter(department => this.selectedDepartmentNames.includes(department.text))
        .map(department => department.value)
    }

    this.dataService
    .post(this.baseUrl + ApiEndpointType.CreateInviteUserNameProfile, userModel)
    .then((res: any) => {
      if (res) {
        this.dialogRef.close(true);
        this.noti.showSuccess(res.message, 'SUCCESS');
      }
    })
    .catch((err) => {
      this.noti.showError(err.error, 'ERROR');
    });
  }

  addDepartment(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add
    if ((value || '').trim()) {
      this.selectedDepartmentNames.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.departmentControl.setValue(null);
  }

  removeDepartment(department: string): void {
    // let data: any = this.allDepartments.find((x) => x.text == department);
    // if (data) {
    //   this.userModel.selectedDepartmentIds =
    //     this.userModel.selectedDepartmentIds.filter(
    //       (x: any) => x != data.value
    //     );
    // }
    const index = this.selectedDepartmentNames.indexOf(department);
    if (index >= 0) {
      this.selectedDepartmentNames.splice(index, 1);
    }
  }

  selectedDepartment(event: MatAutocompleteSelectedEvent): void {
    const newValue = event.option.viewValue;
    // let data: any = this.allDepartments.find(
    //   (x) => x.text == event.option.viewValue
    // );
    // if (data) {
    //   this.userModel.selectedDepartmentIds.push(data.value);
    // }

    if (this.selectedDepartmentNames.includes(newValue)) {
      this.selectedDepartmentNames = [...this.selectedDepartmentNames.filter((departmentName) => departmentName !== newValue)];
    } else {
      this.selectedDepartmentNames.push(newValue);
    }
    this.departmentInput.nativeElement.value = '';
    this.departmentControl.setValue(null);

    // keep the autocomplete opened after each item is picked.
    requestAnimationFrame(() => {
      this.openAuto(this.matACTrigger);
    });
  }

  openAuto(trigger: MatAutocompleteTrigger) {
    trigger.openPanel();
    this.departmentInput.nativeElement.focus();
  }

  toggleDepartmentList(trigger: MatAutocompleteTrigger) {
    if (trigger.panelOpen) {
      trigger.closePanel();
    } else {
      trigger.openPanel();
      this.departmentInput.nativeElement.focus();
    }
  }

  closeDepartmentList(trigger: MatAutocompleteTrigger) {
    trigger.closePanel();
  }

  createUserByEmail() {
    if (!this.registerForm.controls.email.valid) {
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
      this.dataService
        .post(this.baseUrl + ApiEndpointType.CreateInviteUserProfile, {
          email: val.trim(),
          baseUri: environment.baseUri,
        })
        .then((res: any) => {
          if (res) {
            this.dialogRef.close(true);
            this.noti.showSuccess(res.message, 'SUCCESS');
          }
        })
        .catch((err) => {
          this.noti.showError(err.error, 'ERROR');
        });
    });
  }
}
