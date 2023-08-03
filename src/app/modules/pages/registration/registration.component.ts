////
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { MustMatch } from '../../core/_helpers/must-match.validator';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { ToastrService } from 'ngx-toastr';
import { Objectpass } from '../../core/services/objectPass.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  list: any[] = [];
  EmpForm!: FormGroup;
  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;
  @ViewChild('autocompleteTrigger') matACTrigger!: MatAutocompleteTrigger;
  invitedUserId!: string;
  filteredFruits!: Observable<string[]>;
  fruits: string[] = [];
  allDepartments: any[] = [];
  allFruits: string[] = [];
  hideConfirmPassword: boolean = true;
  hidePassword: boolean = true;
  fruitCtrl = new FormControl();
  selectable = true;
  selectedDepartmentid: number[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  removable = true;
  selectedDepartmentIds: number[] = [];
  selectedValue = 0;
  baseUrl: string = environment.apiBase;
  buyData: any;
  dataIfRefreshed: any;
  constructor(
    public dataService: CrudService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public sendSata: Objectpass
  ) {}

  ngOnInit(): void {
    this.intializeForm();
    // this.route.params.subscribe((params: Params) => {
    //   if (params && params.id) {
    //     this.invitedUserId = params.id;
    //   }
    // });
    //  this.getInvitedUser(this.invitedUserId)
    this.sendSata._object.subscribe((x: any) => (this.buyData = x));

    if (this.buyData) {
      localStorage.setItem('message', JSON.stringify(this.buyData));
    }
    if (localStorage.getItem('message'))
      this.buyData = JSON.parse(localStorage.getItem('message') ?? '');
    // localStorage.setItem(,'message')
    // this.buyData=JSON.parse(localStorage.getItem('message')??'')
  }

  intializeForm() {
    this.EmpForm = this.formBuilder.group(
      {
        id: new FormControl(''),
        email: new FormControl('', [Validators.required, Validators.email]),
        title: new FormControl('', [Validators.required]),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        userStatusID: new FormControl(0),
        companyID: new FormControl(0),
        companyName: new FormControl('', [Validators.required]),
        supervisorEmail: new FormControl(''),
        isSafetySensitive: new FormControl(false),
        safetySensitiveType: new FormControl(null),
        phoneNumber: new FormControl('', [Validators.required]),
        street: new FormControl(''),
        city: new FormControl(''),
        zipCode: new FormControl(''),
        state: new FormControl(''),

        purchaseOrder: new FormControl(''),
        promoCode: new FormControl(''),

        selectedDepartmentIds: new FormControl(),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
          // Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$")
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.EmpForm.controls;
  }

  getInvitedUser(id: string) {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetInvitedUser + '/' + id)
      .then((x: any) => {
        this.EmpForm.controls.id.patchValue(x.inviteUserProfileModel.id);
        this.EmpForm.controls.email.patchValue(x.inviteUserProfileModel.email);
        this.EmpForm.controls.firstName.patchValue(
          x.inviteUserProfileModel.firstName
        );
        this.EmpForm.controls.lastName.patchValue(
          x.inviteUserProfileModel.lastName
        );
        this.EmpForm.controls.title.patchValue(x.inviteUserProfileModel.title);
        this.EmpForm.controls.phoneNumber.patchValue(
          x.inviteUserProfileModel.phoneNumber
        );
        this.EmpForm.controls.companyID.patchValue(
          x.inviteUserProfileModel.companyID
        );
        this.EmpForm.controls.companyName.patchValue(
          x.inviteUserProfileModel.companyName
        );
        this.EmpForm.controls.street.patchValue(
          x.inviteUserProfileModel.street
        );
        this.EmpForm.controls.city.patchValue(x.inviteUserProfileModel.city);
        this.EmpForm.controls.state.patchValue(x.inviteUserProfileModel.state);
        this.EmpForm.controls.zipCode.patchValue(
          x.inviteUserProfileModel.zipCode
        );
        this.GetDepartmentSelectListByCompany(
          x.inviteUserProfileModel.companyID
        );
      })
      .catch((x) => {});
  }

  GetDepartmentSelectListByCompany(val: any) {
    // this.service.getBlobSingleWithParams(`${this.baseUrl + ApiEndpointType.DownloadCompanyAdminUserCourseTraningMatrixReport}/${isCustomCourse}`)
    this.fruits = [];
    this.dataService
      .getAll(
        `${
          this.baseUrl + ApiEndpointType.GetDepartmentSelectListByCompany
        }/${val}`
      )
      .then((x: any) => {
        if (x) {
          this.allDepartments = x;
          x.forEach((element: any) => {
            this.allFruits.push(element.text);
          });
          this.selectedDepartmentid.forEach((element: any) => {
            let data = x.find((x: any) => x.value == element);
            if (data) {
              this.fruits.push(data.text);
            }
          });
          this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) =>
              fruit ? this._filter(fruit) : this.allFruits.slice()
            )
          );
        }
      })
      .catch((x) => {});
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allFruits.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  remove(fruit: string): void {
    let data: any = this.allDepartments.find((x) => x.text == fruit);
    if (data) {
      this.selectedDepartmentIds = this.selectedDepartmentIds.filter(
        (x: any) => x != data.value
      );
    }
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const newValue = event.option.viewValue;
    let data: any = this.allDepartments.find(
      (x) => x.text == event.option.viewValue
    );
    if (data) {
      if (this.selectedDepartmentIds.includes(data.value)) {
        this.selectedDepartmentIds = this.selectedDepartmentIds.filter(
          (x: any) => x != data.value
        );
      } else {
        this.selectedDepartmentIds.push(data.value);
      }
    }

    if (this.fruits.includes(newValue)) {
      this.fruits = [...this.fruits.filter((fruit) => fruit !== newValue)];
    } else {
      this.fruits.push(event.option.viewValue);
    }
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);

    // keep the autocomplete opened after each item is picked.
    requestAnimationFrame(() => {
      this.openAuto(this.matACTrigger);
    });
  }

  openAuto(trigger: MatAutocompleteTrigger) {
    trigger.openPanel();
    this.fruitInput.nativeElement.focus();
  }

  save() {

    if (this.EmpForm.invalid) {
      this.EmpForm.markAllAsTouched();
      return;
    }

    let data: any = {
      city: this.EmpForm.value.city,
      companyID: this.EmpForm.value.companyID,
      companyName: this.EmpForm.value.companyName,
      confirmPassword: this.EmpForm.value.confirmPassword,
      email: this.EmpForm.value.email,
      firstName: this.EmpForm.value.firstName,
      lastName: this.EmpForm.value.lastName,
      noOfLicense: this.buyData.numberOfUsers,
      password: this.EmpForm.value.password,
      phoneNumber: this.EmpForm.value.phoneNumber,
      promoCode: this.EmpForm.value.promoCode,
      state: this.EmpForm.value.state,
      street: this.EmpForm.value.street,
      title: this.EmpForm.value.title,
      zipCode: this.EmpForm.value.zipCode,
    };

    this.dataService
      .post(this.baseUrl + ApiEndpointType.RegisterUser, data)
      .then((x: any) => {

        if (x) {
          let data: any = {
            Email: this.EmpForm.value.email,
            BaseUri:
              `${environment.baseUri}companyadmin/payment-success/`,
            NoOfLicense: this.buyData.numberOfUsers,
            NoOfActiveLicenses: 0,
            IsCustomCoursesPurchased:
              this.buyData.customCoursesVal == 0 ? false : true,
            SoftwarePlusCustomCoursesPurchase: false,
            SoftwarePlusCustomCoursesPurchasePlusSpanish: false,
            SoftwarePlusCustomCoursesPurchaseWithoutSpanish: false,
            SoftwarePlusCustomCoursePricePerUserPlusSpanish: false,
            PricePerUserPlusSpanish: false,
            CalibrationPurchase:
              this.buyData.calibrationCoursesVal == 795 ? true : false,
            CalibrationPurchaseEnterprise:
              this.buyData.calibrationCoursesVal == 1495 ? true : false,
            SpanishLanguagePurchase:
              this.buyData.spanishCoursesVal == 0 ? false : true,
            supplierMangementPurchase: false,
          };
          this.dataService
            .post(
              this.baseUrl + ApiEndpointType.CreateCheckoutSessionAsync,
              data
            )
            .then((x: any) => {
              if (x) window.location.href = x;
            })
            .catch((x) => {});
        }
      })
      .catch((x: any) => {
        if (x && x.error) {
          this.toastr.error(x.error, 'ERROR');
        }
      });
  }
}
