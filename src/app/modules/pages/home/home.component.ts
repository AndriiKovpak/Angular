import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { AuthService } from '../../core/guards/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translation.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  content: any = {};
  baseUrl: string = environment.apiBase;
  userInfo: any;
  lang: string = 'en';

  constructor(private service: CrudService,
    private langService: LanguageService,
    public translate: TranslateService,
    public translationService: TranslationService,
    private authService: AuthService) {
    this.lang = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
        ? this.userInfo?.languagePreference
        : 'en';
  }

  ngOnInit(): void {
    this.translationService.onLanguageChange.subscribe(x => {
      this.lang = x ?? 'en'
    })
    this.userInfo = this.authService.getUserInformation();
    this.getHome();
  }

  getHome() {
    this.service
      .getAll(this.baseUrl + ApiEndpointType.GetHome)
      .then((x: any) => {
        if (x != undefined) {
          this.content = this.langService.convertLangValueObject(x.htmlContent);
          if (window.innerWidth > 768) {
            setTimeout(() => {
              Array.from(document.getElementsByTagName('video')).forEach((e: any) => { e.play(); })
            }, 1)
          }
        }
      })
      .catch((x) => { });
  }
}