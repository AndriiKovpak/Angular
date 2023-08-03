import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { AuthService } from '../../core/guards/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translation.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  policyCMSData: any = {};
  baseUrl:string = environment.apiBase;
  userInfo: any;
  languagePreference: string = 'en';

  constructor(private service : CrudService,
    private langService: LanguageService,
    public translate: TranslateService,
    public translationService: TranslationService,
    private authService: AuthService) {
      // this.languagePreference = localStorage.getItem('lang')
      // ? localStorage.getItem('lang')
      // : this.userInfo?.languagePreference
      //   ? this.userInfo?.languagePreference
      //   : 'en';
      this.switchLanguage();
    }

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInformation();
    this.switchLanguage();
    this.getPrivacyPolicy();
  }

  switchLanguage() {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
      this.languagePreference =lang ?? 'en'
    });
  }

  getPrivacyPolicy() {
    this.service
      .getAll(this.baseUrl + ApiEndpointType.GetPrivacyPolicy)
      .then((x: any) => {
        this.policyCMSData = x;
        if (this.policyCMSData != undefined) {
          this.policyCMSData.title = this.langService.simplifyData(
            this.policyCMSData.title,
            this.languagePreference
          );
          this.policyCMSData.htmlContent = this.langService.simplifyData(
            this.policyCMSData.htmlContent,
            this.languagePreference
          );
        }
      })
      .catch((x) => { });
  }
}
