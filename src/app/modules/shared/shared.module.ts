import { LayoutModule } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { CoreModule, FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgxUiLoaderModule, } from "ngx-ui-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "../core/matrial-module/matrial/matrial.module";
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { UpdateHistoryComponent } from "./components/update-history/update-history.component";
import { httpTranslateLoader } from "src/app/app.module";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { UserCredentialsComponent } from "./components/user-credentials/user-credentials.component";
import { FileSaverModule } from "ngx-filesaver";

const routes: Routes =
  [];
@NgModule({
  declarations: [
    SideBarComponent,
    UpdateHistoryComponent,
    UserCredentialsComponent,
  ],
  imports: [
    AngularEditorModule,
    FormsModule,
    ReactiveFormsModule,
    FileSaverModule,
    MaterialModule,
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FlexLayoutModule,
    MaterialModule,
    FontAwesomeModule,
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

  ],
  exports: [
    NgxUiLoaderModule,
    MaterialModule,
    SideBarComponent,
    AngularEditorModule,
    UserCredentialsComponent
  ],
  providers: []
})
export class SharedModule { }

