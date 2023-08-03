import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../genric-service/crudservice';
import { AuthService } from '../../guards/auth.service';
import { TranslationService } from '../../services/translation.service';
import { Observable } from "rxjs";
import { IUserInfo } from "../../models/IUserInfo";
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../../../employee-dashboard/change-password/change-password.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  baseUrl: string = environment.apiBase;
  language: { lang: string; label: string; }[] = [];
  userInfo: any;
  name: any;
  currentLanguage: string = "ENGLISH";
  languagePreference: string = 'en';
  disableProfileClick = false;
  userInfo$!: Observable<IUserInfo | null>;

  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    public translate: TranslateService,
    public translationService: TranslationService,
    private toastr: ToastrService,
    private service: CrudService
  ) { }


  ngOnInit(): void {
    this.switchLanguage();
    this.getlangs();
    this.userInfo$ = this.auth.userInfo$;
    this.userInfo = this.auth.getUserInformation();
    this.userInfo$.subscribe((userInfo) => {
      if (userInfo) {
        this.userInfo = userInfo;
        this.disableProfileClick = this.userInfo.role == 'Read';

        this.languagePreference = this.userInfo?.languagePreference ?? 'en';
        this.switchLang(this.languagePreference, false);
        this.setSelectedLanguage();
      }
    })
  }

  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent);
  }

  goToProfile() {
    if (this.userInfo.role.split(',').filter((x: any) => x == 'Read')[0] == 'Read' ||
      this.userInfo.role.split(',').filter((x: any) => x == 'Supplier')[0] == 'Supplier') {
    }
  }

  loadLanguage() {
    this.languagePreference = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
        ? this.userInfo?.languagePreference
        : 'en';
  }

  setSelectedLanguage() {
    switch (this.languagePreference.toLowerCase()) {
      case 'en': {
        this.currentLanguage = "ENGLISH";
        break;
      }
      case 'es': {
        this.currentLanguage = "ESPAÑOL";
        break
      }
    }
  }

  switchLanguage() {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  switchLang(langCode: string, updateBackEnd = true) {
    localStorage.setItem('lang', langCode);
    this.translationService.setLanguage(langCode);

    if (updateBackEnd) {
      this.service
        .getAll(
          this.baseUrl +
          ApiEndpointType.SaveUserLanguagePrefernce +
          '?language=' +
          langCode
        )
        .then((result: any) => {
          if (result) {
            // localStorage.removeItem('userDetails');
            // localStorage.setItem('userDetails', JSON.stringify(result));
          }
        })
        .catch((x) => { });
    }

    this.languagePreference = langCode;
    this.setSelectedLanguage();
  }

  getlangs() {
    this.language = [];
    this.translate.getLangs().forEach((element: any) => {
      switch (element) {
        case 'en':
          this.language.push({ lang: element, label: 'English' });
          break;
        case 'es':
          this.language.push({ lang: element, label: 'español' });
          break;
        default:
          this.language.push({ lang: element, label: element });
      }
    });
  }

  onError(event: any) {
    event.target.src = "/assets/images/icons/User.svg"
  }

  navigate() {
    if (this.userInfo.role) {
      if (
        this.userInfo.role
          .split(',')
          .filter((x: any) => x.trim().toLowerCase() == 'user')[0]
          ?.trim()
          .toLowerCase() == 'user'
      )
        this.router.navigate(['/employee-home/companies']);
      else if (
        this.userInfo.role
          .split(',')
          .filter((x: any) => x.trim().toLowerCase() == 'admin')[0]
          ?.trim()
          .toLowerCase() == 'admin'
      )
        this.router.navigate(['/admin/dashboard-admin']);
      else this.router.navigate(['/companyadmin/main-page']);
    } else {
      this.toastr.error("This user have not any role.", 'ERROR');
    }
  }
}
