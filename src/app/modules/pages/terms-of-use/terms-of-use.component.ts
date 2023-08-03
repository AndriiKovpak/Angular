import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { AuthService } from '../../core/guards/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translation.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.scss']
})
export class TermsOfUseComponent implements OnInit {
  termsCMSData: any = {};
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
    this.getTermsOfUse();
  }

  switchLanguage() {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
      this.languagePreference = lang ?? 'en'
    });
  }

  getTermsOfUse() {
    this.service
      .getAll(this.baseUrl + ApiEndpointType.GetTermsOfUse)
      .then((x: any) => {
        this.termsCMSData = x;
        if (this.termsCMSData != undefined) {
          this.termsCMSData.title = this.langService.simplifyData(
            this.termsCMSData.title,
            this.languagePreference
          );
          this.termsCMSData.htmlContent = this.langService.simplifyData(
            this.termsCMSData.htmlContent,
            this.languagePreference
          );
        }
      })
      .catch((x) => { });
  }
}
