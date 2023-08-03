import { AdminHomeComponent } from './admin-home/admin-home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorSketchModule } from 'ngx-color/sketch';
import { CompaniesComponent } from './companies/companies.component';
import { UsersComponent } from './users/users.component';
import { TestComponent } from './test/test.component';
import { TestQuestionsComponent } from './test-questions/test-questions.component';
import { TestQuestionsAnswersComponent } from './test-questions-answers/test-questions-answers.component';
import { ELearningHeadingComponent } from './e-learning-heading/e-learning-heading.component';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../core/matrial-module/matrial/matrial.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TranslateModule,
  TranslateLoader,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from '../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { CoreModule } from '../core/core.module';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { UsersListComponent } from './users-list/users-list.component';
import { CompaniesAdminComponent } from './companies-admin/companies-admin.component';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';
import { TestAdminComponent } from './test-admin/test-admin.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { UserHistoryListComponent } from './user-history-list/user-history-list.component';
import { AdminTestTreeComponent } from './admin-test-tree/admin-test-tree.component';
import { ContactComponent } from './contact/contact.component';
import { AdminPrivacyPolicyComponent } from './admin-privacy-policy/admin-privacy-policy.component';
import { AdminTermsOfUseComponent } from './admin-terms-of-use/admin-terms-of-use.component';
import { CustomCertificateCreatorComponent } from '../company-admin/custom-certificate-creator/custom-certificate-creator.component';
import { AdminCalibrationComponent } from './admin-calibration/admin-calibration.component';

const routes: Routes = [
  {
    path: 'companies',
    component: CompaniesAdminComponent,
  },
  {
    path: 'e-learning-heading',
    component: ELearningHeadingComponent,
  },
  {
    path: 'home',
    component: AdminHomeComponent,
  },
  {
    path: 'calibration',
    component: AdminCalibrationComponent,
  },
  {
    path: 'test',
    component: AdminTestTreeComponent,
  },
  {
    path: 'oldtest',
    component: TestComponent,
  },
  {
    path: 'AboutUs',
    component: AboutUsComponent,
  },
  {
    path: 'test-questions',
    component: TestQuestionsComponent,
  },
  {
    path: 'test-questions-answers',
    component: TestQuestionsAnswersComponent,
  },
  {
    path: 'courses',
    component: AdminCoursesComponent,
  },
  {
    path: 'users',
    component: UsersListComponent,
  },
  {
    path: 'users-history',
    component: UserHistoryListComponent,
  },
  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'privacy-policy',
    component: AdminPrivacyPolicyComponent,
  },
  {
    path: 'terms-of-use',
    component: AdminTermsOfUseComponent,
  },
  {
    path: 'Custom-Certificate',
    component: CustomCertificateCreatorComponent,
  },
];

@NgModule({
  declarations: [
    CompaniesComponent,
    UsersComponent,
    TestComponent,
    TestQuestionsComponent,
    TestQuestionsAnswersComponent,
    ELearningHeadingComponent,
    DashboardAdminComponent,
    UsersListComponent,
    CompaniesAdminComponent,
    AdminCoursesComponent,
    TestAdminComponent,
    AboutUsComponent,
    UserHistoryListComponent,
    AdminTestTreeComponent,
    ContactComponent,
    AdminPrivacyPolicyComponent,
    AdminTermsOfUseComponent,
    AdminHomeComponent,
    AdminCalibrationComponent
  ],
  imports: [
    AgGridModule.withComponents([]),
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    ColorSketchModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
      isolate: false,
      extend: true,
    }),
    CoreModule,
  ],
})
export class DashboardModule {}
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
