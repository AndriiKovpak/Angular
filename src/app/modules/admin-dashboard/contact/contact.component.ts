import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../core/guards/auth.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { CrudService } from '../../core/genric-service/crudservice';
import { TranslationService } from '../../core/services/translation.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  ContactForm!: FormGroup;
  baseUrl: string = environment.apiBase;
  contactData: any;
  contactObj: any;
  userInfo: any;
  lang: string = 'en';

  constructor(
    private formBuilder: FormBuilder,
    public dataService: CrudService,
    public ngxLoader: NgxUiLoaderService,
    public toaster: ToastrService,
    private langService: LanguageService,
    private authService: AuthService,
    public translate: TranslateService,
    public translationService: TranslationService
  ) {
    let userDetails: any = JSON.parse(localStorage.getItem("userDetails")!)
    if (userDetails && userDetails.languagePreference)
      this.translate.setDefaultLang(userDetails.languagePreference);
  }

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInformation();
    this.lang = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
        ? this.userInfo?.languagePreference
        : 'en';

    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
      if (this.lang == lang) return;
      this.getFormValue();
      this.lang = lang;
      this.formpatch();
    });
    this.formInitialize();
    this.getContactData();
  }

  getFormValue() {
    this.contactData.leftHeading[this.lang] = this.ContactForm?.value?.leftHeading;
    this.contactData.leftDescription[this.lang] = this.ContactForm?.value?.leftDescription;
    this.contactData.rightHeading[this.lang] = this.ContactForm?.value?.rightHeading;
    this.contactData.rightDescription[this.lang] = this.ContactForm?.value?.rightDescription;
    this.contactData.phoneHeading[this.lang] = this.ContactForm?.value?.phoneHeading;
    this.contactData.phone = this.ContactForm?.value?.phone;
    this.contactData.emailHeading[this.lang] = this.ContactForm?.value?.emailHeading;
    this.contactData.email = this.ContactForm?.value?.email;
  }

  formInitialize() {
    this.ContactForm = this.formBuilder.group({
      leftHeading: new FormControl(''),
      leftDescription: new FormControl(''),
      rightHeading: new FormControl(''),
      rightDescription: new FormControl(''),
      phoneHeading: new FormControl(''),
      phone: new FormControl(''),
      emailHeading: new FormControl(''),
      email: new FormControl(''),
    });

  }

  formpatch() {
    this.ContactForm = this.formBuilder.group({
      id: '',
      leftHeading: new FormControl(this.contactData?.leftHeading[this.lang] || ''),
      leftDescription: new FormControl(this.contactData?.leftDescription[this.lang] || ''),
      rightHeading: new FormControl(this.contactData?.rightHeading[this.lang] || ''),
      rightDescription: new FormControl(this.contactData?.rightDescription[this.lang] || ''),
      phoneHeading: new FormControl(this.contactData?.phoneHeading[this.lang] || ''),
      phone: new FormControl(this.contactData?.phone || ''),
      emailHeading: new FormControl(this.contactData?.emailHeading[this.lang] || ''),
      email: new FormControl(this.contactData?.email || ''),
    });
  }

  get f() { return this.ContactForm?.controls }
  async getContactData() {
    await this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetContact)
      .then((x: any) => {
        this.contactData = {
          ...x,
          leftHeading: this.langService.convertLangValueObject(x.leftHeading),
          leftDescription: this.langService.convertLangValueObject(x.leftDescription),
          rightHeading: this.langService.convertLangValueObject(x.rightHeading),
          rightDescription: this.langService.convertLangValueObject(x.rightDescription),
          phone: x.phone,
          phoneHeading: this.langService.convertLangValueObject(x.phoneHeading),
          emailHeading: this.langService.convertLangValueObject(x.emailHeading),
          email: x.email,
        }
        this.formpatch();
      })
      .catch((x) => { });
  }

  UpdateContact() {
    if (this.ContactForm.invalid) {
      return;
    }
    this.getFormValue();
    this.dataService
      .post(this.baseUrl + ApiEndpointType.UpdateContact, {
        ...this.contactData,
        leftHeading: this.langService.convertLangValueList(this.contactData?.leftHeading),
        leftDescription: this.langService.convertLangValueList(this.contactData?.leftDescription),
        rightHeading: this.langService.convertLangValueList(this.contactData?.rightHeading),
        rightDescription: this.langService.convertLangValueList(this.contactData?.rightDescription),
        phoneHeading: this.langService.convertLangValueList(this.contactData?.phoneHeading),
        emailHeading: this.langService.convertLangValueList(this.contactData?.emailHeading),
        phone: (this.contactData?.phone || ''),
        email: (this.contactData?.email || ''),
      })
      .then((x: any) => {
        if (x) this.toaster.success(x.message, 'SUCCESS');
        this.getContactData();
      })
      .catch((x) => { });
  }

  Save() {
    this.UpdateContact();
  }
}
