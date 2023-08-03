import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AuthService } from '../../core/guards/auth.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  list: any[] = [];
  baseUrl: string = environment.apiBase;
  languagePreference: string = 'en';
  userInfo: any;

  constructor(public dataService: CrudService,
    private authService: AuthService,
    private langService: LanguageService,

    ) {}

  ngOnInit(): void {
    this.getUsersAboutUs()
    this.setLanguage()
    this.userInfo = this.authService.getUserInformation();

  }
  setLanguage() {
    this.languagePreference = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
        ? this.userInfo?.languagePreference
        : 'en';
  }
  getUsersAboutUs() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetListUsersAboutUsFrontEnd)
      .then((x:any) => {

        this.list = x
        this.list.forEach(element => {
          element.name =   this.langService.simplifyData(
            element.name,
            this.languagePreference
          );
          element.designation = this.langService.simplifyData(
            element.designation,
            this.languagePreference
          );
          element.image = element.image;
          element.description = this.langService.simplifyData(
            element.description,
            this.languagePreference
          );
          element.miniDescription =this.langService.simplifyData(
            element.miniDescription,
            this.languagePreference
          );
        });
      })
      .catch((x) => {});
  }
}
