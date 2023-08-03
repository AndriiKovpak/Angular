import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyAdminRoutingModule } from './routing/company-admin-routing/company-admin-routing.module';
import { MiddleLayoutComponent } from './middle-layout/middle-layout.component';
import { AddNewEmployeeComponent } from './add-new-employee/add-new-employee.component';
import { MY_FORMATS, ReportsSettingsComponent } from './reports-settings/reports-settings.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../core/matrial-module/matrial/matrial.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterModule } from '@angular/router';
import { NgxPrinterModule  } from 'ngx-printer';
import { AgGridModule } from 'ag-grid-angular';
import { CoreModule } from '../core/core.module';
import { AgGridCellDashboardComponent } from './ag-grid-cell-dashboard/ag-grid-cell-dashboard.component';
import { TotalValueRenderer } from './total-value-renderer/total-value-renderer.component.ts.component';
import { SharedModule } from '../shared/shared.module';
import { FileSaverModule } from 'ngx-filesaver';
import { MainPageComponent } from './main-page/main-page.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { CalibrationDashboardComponent } from './calibration-dashboard/calibration-dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { MiddleLayoutCalibrationComponent } from './middle-layout-calibration/middle-layout-calibration.component';
import { GaugeRecordsComponent } from './gauge-records/gauge-records.component';
import { CalibrationReportsSettingsComponent } from './calibration-reports-settings/calibration-reports-settings.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { CustomCoursesComponent } from './custom-courses/custom-courses.component';
import { CompanyTestComponent } from './company-test/company-test.component';
import { CustomCourseSidePannelComponent } from './custom-course-side-pannel/custom-course-side-pannel.component';
import { CompanyTestQuestionsComponent } from './company-test-questions/company-test-questions.component';
import { CompanyTestQuestionAnswersComponent } from './company-test-question-answers/company-test-question-answers.component';
import { SharedCoursesComponent } from './shared-courses/shared-courses.component';
import { CustomCertificateCreatorComponent } from './custom-certificate-creator/custom-certificate-creator.component';
import { CompanyAdminEmployeeComponent } from './company-admin-employee/company-admin-employee.component';
import { TestTreeComponent } from './test-tree/test-tree.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ColorSketchModule } from 'ngx-color/sketch';
import { ProfileComponent } from './profile/profile.component';
@NgModule
  (
    {

      declarations:
        [
          DashboardComponent,
          MiddleLayoutComponent,
          AddNewEmployeeComponent,
          ReportsSettingsComponent,
          AssessmentsComponent,
          AgGridCellDashboardComponent,
          TotalValueRenderer,
          MainPageComponent,
          CalibrationDashboardComponent, MiddleLayoutCalibrationComponent,
          GaugeRecordsComponent,
          CalibrationReportsSettingsComponent,
          PaymentSuccessComponent,
          CustomCoursesComponent,
          CompanyTestComponent,
          CustomCourseSidePannelComponent,
          CompanyTestQuestionsComponent,
          CompanyTestQuestionAnswersComponent,
          SharedCoursesComponent,
          CustomCertificateCreatorComponent,
          CompanyAdminEmployeeComponent,
          TestTreeComponent,
          ProfileComponent
        ],
      imports:
        [
          ColorSketchModule,
          ChartsModule,
          MaterialModule,
          FormsModule,
          CommonModule,
          CoreModule,
          SharedModule,
          FileSaverModule ,
          SignaturePadModule ,
         // BrowserAnimationsModule,
          CompanyAdminRoutingModule,
          ReactiveFormsModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: httpTranslateLoader,
              deps: [HttpClient],
            },
            isolate:false,
            extend:true
          }),
          RouterModule,
          NgxPrinterModule,
          AgGridModule.withComponents([]),

        ],
        providers:[
          {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
        ]

    }
  )

export class CompanyAdminModule {
  constructor(private translate:TranslateService){
    this.translate.addLangs(['en','es']);
    let currentLang = localStorage.getItem('lang');
    this.translate.setDefaultLang(currentLang??'en');
  }
 }
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

