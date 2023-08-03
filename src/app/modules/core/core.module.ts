import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutModule } from './layouts/layout.module';
import { AuthService } from './guards/auth.service';
import { PaginationComponent } from './pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { RecordTypeFilterComponent } from './filter/record-type-filter/record-type-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminControlModalComponent } from './modal/admin-control-modal/admin-control-modal.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { MaterialModule } from './matrial-module/matrial/matrial.module';
import { AgGridModule } from 'ag-grid-angular';
import { ShoppingCartModalComponent } from './modal/shopping-cart-modal/shopping-cart-modal.component';
import { AdminCompaniesAddComponent } from './modal/admin-companies-add/admin-companies-add.component';
import { AdminCoursesAddComponent } from './modal/admin-courses-add/admin-courses-add.component';
import { AdminTestQuestionsAddComponent } from './modal/admin-test-questions-add/admin-test-questions-add.component';
import { AdminTestsAddComponent } from './modal/admin-tests-add/admin-tests-add.component';
import { AdminUsersAddComponent } from './modal/admin-users-add/admin-users-add.component';
import { AdminUserEditComponent } from './cell-renders/admin-user-edit/admin-user-edit.component';
import { UpdatePassowrdComponent } from './modal/update-passowrd/update-passowrd.component';
import { EmployeeAddCredentialsComponent } from './modal/employee-add-credentials/employee-add-credentials.component';
import { NgxFileDragDropModule } from 'ngx-file-drag-drop';
import { AddDocumentComponent } from './modal/add-document/add-document.component';
import { TestQuestionsAnswersModalComponent } from './modal/test-questions-answers-modal/test-questions-answers-modal.component';
import { AdminUpdatePasswordComponent } from './modal/admin-update-password/admin-update-password.component';
import { AddAboutusComponent } from './modal/add-aboutus/add-aboutus.component';
import { ShoppingCartSeconedComponent } from './modal/shopping-cart-seconed/shopping-cart-seconed.component';
import { CustomCertificateComponent } from './modal/custom-certificate/custom-certificate.component';
import { AddlogoComponent } from './modal/addlogo/addlogo.component';
import { AddCoursesMOdalComponent } from './modal/add-courses-modal/add-courses-modal.component';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { SignaturePadModule } from 'angular2-signaturepad';
import { UserService } from "./services/user.service";
import { TestService } from "./services/test.service";
import { EditableTestQuestionComponent } from './components/test/editable-test-question/editable-test-question.component';
import { EditableTestQuestionAnswerComponent } from './components/test/editable-test-question-answer/editable-test-question-answer.component';
import { EditTestModalComponent } from './modal/edit-test-modal/edit-test-modal.component';

@NgModule({
  imports: [
    LayoutModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FilePickerModule,
    SignaturePadModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
      isolate: false,
      extend: true
    }),
    AgGridModule.withComponents([]),
    NgxFileDragDropModule

  ],

  declarations: [
    PaginationComponent,
    AdminUpdatePasswordComponent,
    RecordTypeFilterComponent,
    AdminControlModalComponent,
    ShoppingCartModalComponent,
    AdminCompaniesAddComponent,
    AdminCoursesAddComponent,
    AdminTestsAddComponent,
    AdminUsersAddComponent,
    AdminTestQuestionsAddComponent,
    AdminUserEditComponent,
    UpdatePassowrdComponent,
    EmployeeAddCredentialsComponent,
    AddDocumentComponent,
    TestQuestionsAnswersModalComponent,
    AddAboutusComponent,
    ShoppingCartSeconedComponent,
    CustomCertificateComponent,
    AddlogoComponent,
    AddCoursesMOdalComponent,
    EditableTestQuestionComponent,
    EditableTestQuestionAnswerComponent,
    EditTestModalComponent,
  ],
  providers: [
    UserService,
  ],

  exports: [LayoutModule
    , PaginationComponent
    , RecordTypeFilterComponent,
    AdminControlModalComponent,
    EditTestModalComponent,
    EmployeeAddCredentialsComponent
  ]
})
export class CoreModule {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
  }
}
