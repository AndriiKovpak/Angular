import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { CrudService } from './../../core/genric-service/crudservice';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
enum CheckBoxType {
  Calibration_Professional,
  Calibration_Enterprise,
}

import { ToastrService } from 'ngx-toastr';
import { Objectpass } from '../../core/services/objectPass.service';
import { AuthService } from '../../core/guards/auth.service';
import { company } from '../../company-admin/reports-settings/models/company.model';
import {INewSubscriptionCheckout} from "../../core/models/INewSubscriptionCheckout";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss'],
})
export class BuyComponent implements OnInit {
  panelOpenState = false;
  customCoursesVal = 0;
  spanishCoursesVal = 0;
  calibrationCoursesVal = 0;
  trainingCoursesVal = 0;
  totalCoursesVal = 0;
  numberOfUsers: number = 1;
  totalTrainingcourseValue: number = 0;
  check_box_type: any = CheckBoxType;
  currentlyChecked: CheckBoxType | null = null;
  userInfo: any;
  baseUrl: string = environment.apiBase;
  isSysAdmin = false;
  companiesWithoutSubscription: company[] = [];
  companySelectedId = 0;
  onOptionalCode: boolean = false;
  onCheckoutCOde: boolean = true;
  promoCode: string = '';
  purchasingTraining: boolean = false;
  purchasingCustomCourseCreator: boolean = false;
  purchasingSpanishLanguageCourse: boolean = false;

  constructor(
    public toster: ToastrService,
    public data: CrudService,
    public sendSata: Objectpass,
    public dataService: CrudService,
    private authService: AuthService,
    public router: Router,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInformation();
    this.authService.userInfo$.subscribe(userInfo => {
      if (userInfo) {
        this.isSysAdmin = userInfo.role === 'Admin';
        if (this.isSysAdmin) {
          this.getCompaniesWithoutSubscription();
        }
      }
    })
    this.translate.setDefaultLang(localStorage.getItem('lang') || 'en');
  }

  getCompaniesWithoutSubscription() {
    this.dataService
      .post(
        this.baseUrl + ApiEndpointType.GetCompaniesWithoutSubscription,
        null
      )
      .then((x: any) => {
        this.companiesWithoutSubscription = x;
      })
      .catch((x) => {});
  }

  //Annual Subscriptions Calculation
  //training
  onTrainingCourseChange() {
    if (!this.purchasingTraining){
      this.purchasingCustomCourseCreator = false;
      this.purchasingSpanishLanguageCourse = false;
    }
    this.calculateTrainingCourse();
  }

  //calibration
  selectCalibrationCheckBox(args: any, targetType: CheckBoxType) {
    this.currentlyChecked = targetType;
    if (!args.target.checked) this.currentlyChecked = null;

    this.calculateTrainingCourse();
  }

  //evaluate all courses pricing
  calculateTrainingCourse() {
    let total = 0;
    if (this.purchasingTraining){
      total += this.numberOfUsers * 149;
      if (this.purchasingCustomCourseCreator) {
        total += this.numberOfUsers * 67;
      }
      if (this.purchasingSpanishLanguageCourse) {
        total += this.numberOfUsers * 26;
      }
    }

    if (this.currentlyChecked !== null)
    switch (this.currentlyChecked) {
      case CheckBoxType.Calibration_Professional:
        total += 795;
        break;
      case CheckBoxType.Calibration_Enterprise:
        total += 1495;
        break;
    }

    this.totalTrainingcourseValue = total;
  }

  SubmitAndRedirect() {
    if (
      this.totalTrainingcourseValue == 0
    ) {
      this.toster.error(
        'Please select at least one training or calibration to proceed.'
      );
      return;
    }

    if (this.companySelectedId == 0) {
      this.toster.error('Please select a Company.');
      return;
    }
    // /{CHECKOUT_SESSION_ID}
    let data: INewSubscriptionCheckout = {
      companyId: this.companySelectedId,
      successReturnUri: `${environment.baseUri}companyadmin/payment-success/paymentsuccess/{CHECKOUT_SESSION_ID}`,
      failureReturnUri: `${environment.baseUri}companyadmin/payment-success/paymentfailed`,
      numberOfTrainingLicenses: this.purchasingTraining? this.numberOfUsers : 0,
      trainingCustomCoursesPurchased: this.purchasingCustomCourseCreator,
      trainingIsSpanishPurchased: this.purchasingSpanishLanguageCourse,
      calibrationPurchaseProfessional: this.currentlyChecked === CheckBoxType.Calibration_Professional,
      calibrationPurchaseEnterprise: this.currentlyChecked === CheckBoxType.Calibration_Enterprise,
      promoCode: this.promoCode
    };

    this.data
      .post$<{url: string}>(this.baseUrl + ApiEndpointType.NewSubscription, data)
      .subscribe(data => {
          if (data.url) {
            window.location.href = data.url;
          } else {
            this.toster.error('Error trying to process payment.');
          }
        },(e) => {
          if (e.error.error === 'invalid-promo-code') {
            this.toster.error('Invalid promo code.');
            this.promoCode = '';
          } else {
            this.toster.error('Error trying to process payment.');
          }
        }
      );
  }
}
