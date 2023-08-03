import { SharedCoursesComponent } from 'src/app/modules/company-admin/shared-courses/shared-courses.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ReportsSettingsComponent } from '../../reports-settings/reports-settings.component';
import { AssessmentsComponent } from '../../assessments/assessments.component';
import { AgGridCellDashboardComponent } from '../../ag-grid-cell-dashboard/ag-grid-cell-dashboard.component';
import { MainPageComponent } from '../../main-page/main-page.component';
import { CalibrationDashboardComponent } from '../../calibration-dashboard/calibration-dashboard.component';
import { GaugeRecordsComponent } from '../../gauge-records/gauge-records.component';
import { CalibrationReportsSettingsComponent } from '../../calibration-reports-settings/calibration-reports-settings.component';
import { PaymentSuccessComponent } from '../../payment-success/payment-success.component';
import { CustomCoursesComponent } from '../../custom-courses/custom-courses.component';
import { TestAdminComponent } from 'src/app/modules/admin-dashboard/test-admin/test-admin.component';
import { CompanyTestComponent } from '../../company-test/company-test.component';
import { CompanyTestQuestionsComponent } from '../../company-test-questions/company-test-questions.component';
import { CompanyTestQuestionAnswersComponent } from '../../company-test-question-answers/company-test-question-answers.component';
import { CustomCertificateCreatorComponent } from '../../custom-certificate-creator/custom-certificate-creator.component';
import { CompanyAdminEmployeeComponent } from '../../company-admin-employee/company-admin-employee.component';
import { TestTreeComponent } from '../../test-tree/test-tree.component';
import { ProfileComponent } from '../../profile/profile.component';
import {CalibrationModulePermission} from "../../../core/models/CalibrationModulePermission";

const routes: Routes = [
  // THIS PATH IS FOR COMPANY ADMIN DASHBOARD
  {
    path: 'dashboard2',
    component: DashboardComponent,
  },
  // THIS PATH IS FOR ADD NEW COMPANY EMPLOYEE

  // {
  //   path: 'addNewEmployee',
  //   component: AddNewEmployeeComponent
  // },

  // THIS PATH IS FOR REPORT AND SETTINGS
  {
    path: 'reportAndSetting',
    component: ReportsSettingsComponent,
  },

  // THIS PATH IS FOR ASSESSMENTS
  {
    path: 'assesment',
    component: AssessmentsComponent,
  },
  // THIS PATH IS FOR ASSESSMENTS
  {
    path: 'dashboard2',
    component: AgGridCellDashboardComponent,
  },
  // THIS PATH IS FOR profile PAGE
  {
    path: 'profile',
    component: ProfileComponent,
  },
    // THIS PATH IS FOR MAIN PAGE
    {
      path: 'main-page',
      component: MainPageComponent,
    },
  // THIS PATH IS FOR paymentSuccess

  // THIS PATH IS FOR MAIN PAGE
  {
    path: 'payment-success/paymentsuccess/:id',
    component: PaymentSuccessComponent,
  },
  {
    path: 'payment-success',

    component: PaymentSuccessComponent,
  },
  // THIS PATH IS FOR CALIBRATION PAGE
  {
    path: 'calibration-dashboard',
    component: CalibrationDashboardComponent,
  },
  {
    path: 'gauge-records',
    component: GaugeRecordsComponent,
  },
  {
    path: 'CalibrationReportsSettings',
    component: CalibrationReportsSettingsComponent,
    data: {requiresCalibrationPermissions: [CalibrationModulePermission.CanAccessReportsAndSettings]}
  }, // THIS PATH IS FOR ASSESSMENTS
  {
    path: 'dashboard',
    component: DashboardComponent,
  }, // THIS PATH IS FOR ASSESSMENTS
  {
    path: 'customcourses',
    component: CustomCoursesComponent,
  },
  {
    path: 'Test',
    component: CompanyTestComponent,
  },
  {
    path: 'TestQuestions',
    component: CompanyTestQuestionsComponent,
  },
  {
    path: 'TestQuestionsAnswers',
    component: CompanyTestQuestionAnswersComponent,
  },
  {
    path: 'customcertificate',
    component: CustomCertificateCreatorComponent,
  }, // THIS PATH IS FOR MAIN PAGE
  {
    path: 'companyadminemployee/:id',
    component: CompanyAdminEmployeeComponent,
  }
  ,
  {
    path: 'gauge-records/:id/:id2',
    component: GaugeRecordsComponent,
  }, // THIS PATH IS FOR MAIN PAGE
  {
    path: 'customTest',
    component: TestTreeComponent,
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CompanyAdminRoutingModule {}
