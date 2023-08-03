import { ResetPasswordConfirmationComponent } from './reset-password-confirmation/reset-password-confirmation.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MaterialModule } from '../core/matrial-module/matrial/matrial.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { CalibrationComponent } from './calibration/calibration.component';
import { ELearningComponent } from './e-learning/e-learning.component';
import {
  faChalkboardTeacher,
  faHome,
  faPlaneDeparture,
  faHeadset,
  faSignInAlt,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { BuyComponent } from './buy/buy.component';
import { RegistrationComponent } from './registration/registration.component';
import { InviteComponent } from './Invite/invite.component';
import { SafeHtmlPipe } from '../core/_helpers/pipe';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
  },
  {
    path: 'products/calibration',
    component: CalibrationComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'products',
    redirectTo: 'products/e-learning',
    pathMatch: 'full',
  },
  {
    path: 'products/e-learning',
    component: ELearningComponent,
  },
  {
    path: 'forgotPassowrd',
    component: ForgotPasswordComponent,
  },
  {
    path: 'termsofuse',
    component: TermsOfUseComponent,
  },
  {
    path: 'privacypolicy',
    component: PrivacyPolicyComponent,
  },
];
@NgModule({
  declarations: [
    InviteComponent,
    AboutComponent,
    ContactUsComponent,
    ForgotPasswordComponent,
    HomeComponent,
    ELearningComponent,
    TermsOfUseComponent,
    PrivacyPolicyComponent,
    BuyComponent,
    ResetPasswordComponent,
    ResetPasswordConfirmationComponent,
    RegistrationComponent,
    CalibrationComponent,
    SafeHtmlPipe,
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    CommonModule,
    MaterialModule,
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
export class PagesModule {
  constructor(library: FaIconLibrary, private translate: TranslateService) {
    library.addIcons(
      faChalkboardTeacher,
      faHome,
      faPlaneDeparture,
      faHeadset,
      faSignInAlt,
      faShoppingCart
    );
    this.translate.addLangs(['en', 'es']);
    let currentLang = localStorage.getItem('lang');
    this.translate.setDefaultLang(currentLang || 'en');
  }
}
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
