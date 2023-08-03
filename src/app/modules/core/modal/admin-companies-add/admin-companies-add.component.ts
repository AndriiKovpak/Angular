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
import { CompanyModel } from './model/admin-company.model';

@Component({
  selector: 'app-admin-companies-add',
  templateUrl: './admin-companies-add.component.html',
  styleUrls: ['./admin-companies-add.component.scss'],
})
export class AdminCompaniesAddComponent implements OnInit {
  EmpForm!: FormGroup;
  submitted: boolean = false;
  baseUrl: string = environment.apiBase;
  buttontext: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private toster: ToastrService,
    private dailog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {

    this.intializeForm();
    if (this.data) {
      this.patch();
      this.buttontext = 'Update';
    } else this.buttontext = 'Add';
  }

  intializeForm() {
    this.EmpForm = this.formBuilder.group({
      companyID: new FormControl(null),
      dateCreated: new FormControl(''),
      emailNotifications: new FormControl(false),
      isDeleted: new FormControl(null),
      name: new FormControl('', [Validators.required]),
      noOfLicense: new FormControl(null),
      promoCode: new FormControl(''),
      stripeCustomerId: new FormControl(null),
      subscriptionRenualDate: new FormControl(null),
      trainingMatricFormID: new FormControl(null),
      isDemo: new FormControl(null),
      title: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(40),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }
  patch() {
    this.EmpForm = this.formBuilder.group({
      companyID: new FormControl(this.data.Id),
      dateCreated: new FormControl(this.data.DateCreated),
      emailNotifications: new FormControl(this.data.EmailNotifications),
      isDeleted: new FormControl(this.data.IsDeleted),
      name: new FormControl(this.data.Name, [Validators.required]),
      noOfLicense: new FormControl(this.data.Licences),
      promoCode: new FormControl(this.data.PromoCode),
      stripeCustomerId: new FormControl(this.data.StripeCustomerID),
      subscriptionRenualDate: new FormControl(
        this.formatDate(new Date(this.data.SubscriptionDueDate))
      ), //this.data.SubscriptionDueDates
      trainingMatricFormID: new FormControl(this.data.trainingMatricFormID),
      isDemo: new FormControl(this.data.isDemo?this.data.isDemo:false)
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.EmpForm.controls;
  }

  Save() {
    this.submitted = true;
    if (this.EmpForm.invalid) {
      return;
    }

    this.EmpForm.value.dateCreated = new Date();
    let data = {
      ...this.data,
      ...this.EmpForm.value
    }
    let url = '';
    if (this.data) url = ApiEndpointType.UpdateCompany;
    else url = ApiEndpointType.AddCompanies;

    this.crudService
      .post(this.baseUrl + url, data)
      .then((x: any) => {
        if (x) this.toster.success(x.message, 'SUCCESS');
      })
      .catch((x) => {
        if (x) this.toster.error(x.error, 'ERROR');
      });

    this.dailog.closeAll();
  }
  addUser(arg0: any, addUser: any) {
    throw new Error('Method not implemented.');
  }
  closeModal() {
    this.dailog.closeAll();
  }

  private formatDate(date: any) {

    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
}
