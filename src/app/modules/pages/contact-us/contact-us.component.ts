import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translation.service';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { AuthService } from '../../core/guards/auth.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contactCMSData: any = {};
  baseUrl:string = environment.apiBase;
  userInfo: any;
  languagePreference: string = 'en';

  constructor(
    private fromBuilder : FormBuilder,
    private service : CrudService,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService,
    public translate: TranslateService,
    public translationService: TranslationService,
    private langService: LanguageService,
    private authService: AuthService
  ) {
    this.languagePreference = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
        ? this.userInfo?.languagePreference
        : 'en';
     this.switchLanguage();
  }

  contactusform : FormGroup = this.fromBuilder.group({
    name: ['',[Validators.required]],
    phone: ['',[Validators.required]],
    company: ['',[Validators.required]],
    email: ['',[Validators.required, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
    message: ['',[Validators.required]]
  })

  ngOnInit(): void {
    // this.userInfo = this.authService.getUserInformation();
    // this.switchLanguage();
    this.getContactUs();
  }

  get f()
  {
    return this.contactusform.controls;
  }

  switchLanguage() {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
      this.languagePreference =lang ?? 'en'

    });
  }

  getContactUs() {
    this.service
      .getAll(this.baseUrl + ApiEndpointType.GetContact)
      .then((x:any) => {

        this.contactCMSData = x;

        if (this.contactCMSData ) {
          this.contactCMSData.leftHeading = this.langService.simplifyData(
            this.contactCMSData.leftHeading,
            this.languagePreference
          );
          this.contactCMSData.leftDescription = this.langService.simplifyData(
            this.contactCMSData.leftDescription,
            this.languagePreference
          ); this.contactCMSData.rightHeading = this.langService.simplifyData(
            this.contactCMSData.rightHeading,
            this.languagePreference
          ); this.contactCMSData.rightDescription = this.langService.simplifyData(
            this.contactCMSData.rightDescription,
            this.languagePreference
          ); this.contactCMSData.phoneHeading = this.langService.simplifyData(
            this.contactCMSData.phoneHeading,
            this.languagePreference
          );
          this.contactCMSData.emailHeading = this.langService.simplifyData(
            this.contactCMSData.emailHeading,
            this.languagePreference
          );
          this.contactCMSData.email = this.langService.simplifyData(
            this.contactCMSData.email,
            this.languagePreference
          );
        }
      })
      .catch((x) => {});
  }

  onContactSubmit(formDirective: FormGroupDirective){
    if (this.contactusform.invalid) {
      return;
    }
    this.ngxLoader.start();

    let contactusformdata : any = {}

    contactusformdata["company"] = this.contactusform.controls.company.value;
    contactusformdata["contactUsID"] = null;
    contactusformdata["createdDate"] = null;
    contactusformdata["email"] = this.contactusform.controls.email.value;
    contactusformdata["message"] = this.contactusform.controls.message.value;
    contactusformdata["name"] = this.contactusform.controls.name.value;
    contactusformdata["phone"] = this.contactusform.controls.phone.value;

    this.service.post(this.baseUrl+'/api/ContactUs',contactusformdata).then(res =>{
      this.toastr.success('Thank you for contacting us.');
      this.ngxLoader.stop()
      this.contactusform.reset();
      formDirective.resetForm();

    },err =>{

      this.ngxLoader.stop()
      if(!err.error.text)
        this.toastr.error(err.error,'ERROR');
      else
        this.toastr.error(err.error.text,'ERROR');
    })
  }


}
