import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { AuthService } from '../../core/guards/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translation.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { SafeHtmlPipe } from '../../core/_helpers/pipe';

@Component({
  selector: 'app-calibration',
  templateUrl: './calibration.component.html',
  styleUrls: ['./calibration.component.scss']
})
export class CalibrationComponent implements OnInit {
  content: any = {};
  baseUrl: string = environment.apiBase;
  userInfo: any;
  lang: string = 'en';

  constructor(private service: CrudService,
    private langService: LanguageService,
    public translate: TranslateService,
    public translationService: TranslationService,
    private authService: AuthService,
    private safeHtml: SafeHtmlPipe,
  ) {
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
    this.getClibration();
  }

  getClibration() {
    this.service
      .getAll(this.baseUrl + ApiEndpointType.GetCalibration)
      .then((x: any) => {
        if (x != undefined) {
          this.content =
            this.langService.convertLangValueObject(x.htmlContent);
          setTimeout(() => {
            Array.from(document.getElementsByClassName('accordion-header')).forEach((e: any) => {
              e.onclick = () => {
                e.nextElementSibling.classList.toggle('show');
                e.children[0].classList.toggle("collapsed");
              }
            })
          }, 1);
        }
      })
      .catch((x) => { });
  }
}
