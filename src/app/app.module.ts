import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './modules/core/core.module';
import { UIModules } from './modules/ui.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  SharedModule } from './modules/shared/shared.module';
import { TokenInterceptor } from './modules/core/interceptor/token.interceptor';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { ToastrModule } from 'ngx-toastr';
import { StaticPageModule } from './modules/core/static-page-layout/static-page.module';
import { DatePipe, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginComponent } from './modules/pages/login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS } from './modules/company-admin/reports-settings/reports-settings.component';
import { ErrorInterceptor } from './modules/core/interceptor/error.interceptor';
import {CrudService} from "./modules/core/genric-service/crudservice";
import {AuthService} from "./modules/core/guards/auth.service";



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [

    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    CoreModule,
    SharedModule,
    UIModules,
    StaticPageModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    MatNativeDateModule ,
    NgxUiLoaderHttpModule.forRoot({ showForeground: false, }),
    ToastrModule.forRoot(),
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


  providers:
  [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor,multi: true},
    Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
    DatePipe,
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    CrudService,
    AuthService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private translate:TranslateService){
    this.translate.addLangs(['en','es']);
    this.translate.setDefaultLang('en');
    //localStorage.setItem('lang', 'en')
  }
 }
 // AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
