import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { CrudService } from '../../core/genric-service/crudservice';
import { TranslationService } from '../../core/services/translation.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})

export class AdminHomeComponent implements OnInit {
  form!: FormGroup;
  baseUrl: string = environment.apiBase;
  lang: string = 'en';
  homeObj: any;
  htmlContent: any;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'yes'
  }

  constructor(
    private formBuilder: FormBuilder,
    public dataService: CrudService,
    public toaster: ToastrService,
    private langService: LanguageService,
    public translate: TranslateService,
    public translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.translationService.onLanguageChange.subscribe((l) => this.onLanguageChange(l))
    this.getHomeData();
    this.form = this.formBuilder.group({
      editorData: new FormControl('', [Validators.required]),
    });
  }

  get f() { return this.form.controls; }

  onLanguageChange(l: string) {
    if (this.htmlContent) {
      this.htmlContent[this.lang] = this.form.value.editorData;
      this.form.patchValue({ editorData: this.htmlContent[l] })
    }
    this.lang = l;
  }

  getHomeData() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetHome)
      .then((x: any) => {
        if (x) {
          this.homeObj = x;
          this.htmlContent = this.langService.convertLangValueObject(x.htmlContent);
          this.form.patchValue({ editorData: this.htmlContent[this.lang] });
        }
      })
      .catch((x) => { });
  }

  Save() {
    if (this.form.invalid) {
      return;
    }
    this.htmlContent[this.lang] = this.form.value.editorData;
    this.homeObj.htmlContent = this.langService.convertLangValueList(this.htmlContent);
    this.dataService
      .post(this.baseUrl + ApiEndpointType.UpdateHome, this.homeObj)
      .then((x: any) => {
        if (x) this.toaster.success(x.message, 'SUCCESS');
        this.getHomeData();
      })
      .catch((x) => { });
  }
}