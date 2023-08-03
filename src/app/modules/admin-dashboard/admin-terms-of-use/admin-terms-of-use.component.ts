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
import { AuthService } from '../../core/guards/auth.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';

@Component({
  selector: 'app-admin-terms-of-use',
  templateUrl: './admin-terms-of-use.component.html',
  styleUrls: ['./admin-terms-of-use.component.scss']
})
export class AdminTermsOfUseComponent implements OnInit {
  form!: FormGroup;
  termsData: any;
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
    if (this.termsData) {
      this.termsData.htmlContent[this.lang] = this.form.value.htmlContent;
      this.termsData.title[this.lang] = this.form.value.title;
      this.lang = l;
      this.form.patchValue({
        htmlContent: this.termsData.htmlContent[this.lang],
        title: this.termsData.title[this.lang]
      })
    }
  }

  getTermsData() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetTermsOfUse)
      .then((x: any) => {
        if (x) {
          this.termsData = {
            ...x,
            htmlContent: this.langService.convertLangValueObject(x.htmlContent),
            title: this.langService.convertLangValueObject(x.title)
          }
          this.form.patchValue({
            title: this.termsData.title[this.lang],
            htmlContent: this.termsData.htmlContent[this.lang]
          })
        }
      })
      .catch((x) => { });
  }

  Save() {
    if (this.form.invalid) {
      return;
    }
    this.termsData.htmlContent[this.lang] = this.form.value.htmlContent;
    this.termsData.title[this.lang] = this.form.value.title;

    this.dataService
      .post(this.baseUrl + ApiEndpointType.UpdateHome, {
        ...this.termsData,
        htmlContent: this.langService.convertLangValueList(this.termsData.htmlContent),
        title: this.langService.convertLangValueList(this.termsData.title)
      })
      .then((x: any) => {
        if (x) this.toaster.success(x.message, 'SUCCESS');
        this.getTermsData();
      })
      .catch((x) => { });
  }
}
