import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee/employee.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../core/matrial-module/matrial/matrial.module';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { AgGridModule } from 'ag-grid-angular';
import { CourseEyeComponent } from './course-eye/course-eye.component';
import { TakeTestComponent } from './take-test/take-test.component';
import { TestResultComponent } from './test-result/test-result.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


const routes: Routes = [
  {
    path: 'companies',
    component: EmployeeComponent,
  },
  {
    path: 'course',
    component: CourseEyeComponent,
  },

  {
    path: 'course:id',
    component: CourseEyeComponent,
  },
  {
    path: 'takeTest/:id',
    component: TakeTestComponent,
  },
  {
    path: 'testResult/:id',
    component: TestResultComponent,
  },
];
@NgModule({
  declarations: [
    EmployeeComponent,
    CourseEyeComponent,
    TakeTestComponent,
    TestResultComponent,
    ChangePasswordComponent,
    
  ],
  imports: [
    AgGridModule.withComponents([]),
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    MaterialModule,
    MatFileUploadModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
      isolate: false,
      extend: true,
    }),
  ],
})
export class EmployeeDashboardModule {
  constructor(private translate:TranslateService){
    this.translate.addLangs(['en', 'es']);
    let currentLang = localStorage.getItem('lang');
    this.translate.setDefaultLang(currentLang ?? 'en');
  }
}
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}