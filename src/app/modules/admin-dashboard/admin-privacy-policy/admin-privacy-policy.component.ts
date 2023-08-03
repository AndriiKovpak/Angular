import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { CrudService } from '../../core/genric-service/crudservice';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { TranslationService } from '../../core/services/translation.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';

@Component({
  selector: 'app-admin-privacy-policy',
  templateUrl: './admin-privacy-policy.component.html',
  styleUrls: ['./admin-privacy-policy.component.scss']
})
export class AdminPrivacyPolicyComponent implements OnInit {
  form!: FormGroup;
  privacyData: any;
  baseUrl: string = environment.apiBase;
  lang: string = 'en';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  }

  constructor(
    private formBuilder: FormBuilder,
    public dataService: CrudService,
    public ngxLoader: NgxUiLoaderService,
    public toaster: ToastrService,
    private langService: LanguageService,
    public translate: TranslateService,
    public translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.translationService.onLanguageChange.subscribe((l) => this.onLanguageChange(l));
    this.getTermsData();
    this.form = this.formBuilder.group({
      htmlContent: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
    });
  }

  get f() {
    return this.form.controls;
  }

  onLanguageChange(l: string) {
    if (this.privacyData) {
      this.privacyData.htmlContent[this.lang] = this.form.value.htmlContent;
      this.privacyData.title[this.lang] = this.form.value.title;
      this.lang = l;
      this.form.patchValue({
        htmlContent: this.privacyData.htmlContent[this.lang],
        title: this.privacyData.title[this.lang]
      })
    }
  }

  getTermsData() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetPrivacyPolicy)
      .then((x: any) => {
        if (x) {
          this.privacyData = {
            ...x,
            htmlContent: this.langService.convertLangValueObject(x.htmlContent),
            title: this.langService.convertLangValueObject(x.title)
          }
          this.form.patchValue({
            title: this.privacyData.title[this.lang],
            htmlContent: this.privacyData.htmlContent[this.lang]
          })
        }
      })
      .catch((x) => { });
  }

  Save() {
    if (this.form.invalid) {
      return;
    }
    this.privacyData.htmlContent[this.lang] = this.form.value.htmlContent;
    this.privacyData.title[this.lang] = this.form.value.title;

    this.dataService
      .post(this.baseUrl + ApiEndpointType.UpdateHome, {
        ...this.privacyData,
        htmlContent: this.langService.convertLangValueList(this.privacyData.htmlContent),
        title: this.langService.convertLangValueList(this.privacyData.title)
      })
      .then((x: any) => {
        if (x) this.toaster.success(x.message, 'SUCCESS');
        this.getTermsData();
      })
      .catch((x) => { });
  }
}
