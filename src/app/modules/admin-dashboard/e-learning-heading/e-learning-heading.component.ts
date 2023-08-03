import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { TranslationService } from '../../core/services/translation.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';

@Component({
  selector: 'app-e-learning-heading',
  templateUrl: './e-learning-heading.component.html',
  styleUrls: ['./e-learning-heading.component.scss'],
})
export class ELearningHeadingComponent implements OnInit {
  form!: FormGroup;
  baseUrl: string = environment.apiBase;
  eLearning: any;
  elearnObj: any;
  imageLink!: string;
  lang: string = 'en';

  constructor(
    private formBuilder: FormBuilder,
    private dataService: CrudService,
    private toaster: ToastrService,
    private langService: LanguageService,
    private translateService: TranslationService,
  ) { }

  ngOnInit(): void {
    this.translateService.onLanguageChange.subscribe((l: string) => this.onLanguageChange(l));
    this.geteLearningData();
    this.formInitialize();
  }

  onLanguageChange(l: string) {
    if (this.elearnObj) {
      this.elearnObj.description[this.lang] = this.form.value.description;
      this.elearnObj.name[this.lang] = this.form.value.name;
      this.elearnObj.imageLink[this.lang] = this.imageLink;

      this.form.patchValue({
        name: this.elearnObj.name[l],
        description: this.elearnObj.description[l],
      });
      this.imageLink = this.elearnObj.imageLink[l];
    }
    this.lang = l;
  }

  formInitialize() {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      eLearningID: new FormControl(0),
      isUpdateELearningImage: new FormControl(true),
    });
  }
  get f() { return this.form.controls; }

  // Image Preview
  showPreview(event: any) {
    const file = (event && event.target as HTMLInputElement).files[0];
    this.onImageChange(file);
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageLink = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  onImageChange(file: File) {
    const formData: FormData = new FormData();
    formData.append('files', file, file.name);

    this.dataService
      .post(this.baseUrl + ApiEndpointType.saveimageurl, formData)
      .then((x: any) => {
        if (x) {
          this.imageLink = x.url
          this.form.get('imageLink')?.updateValueAndValidity();
        }
      })
      .catch((x) => { });
  }

  geteLearningData() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetELearning)
      .then((x: any) => {
        if (x) {
          this.elearnObj = {
            ...x,
            name: this.langService.convertLangValueObject(x.name),
            description: this.langService.convertLangValueObject(x.description),
            imageLink: this.langService.convertLangValueObject(x.imageLink),
          };
          this.form.patchValue({
            eLearningID: this.elearnObj.eLearningID,
            isUpdateELearningImage: this.elearnObj.isUpdateELearningImage,
            name: this.elearnObj.name[this.lang],
            description: this.elearnObj.description[this.lang],
          });
          this.imageLink = this.elearnObj.imageLink[this.lang];
        }
      })
      .catch((x) => { });
  }

  UpdateELearning() {
    this.elearnObj.name[this.lang] = this.form.value.name;
    this.elearnObj.description[this.lang] = this.form.value.description;
    this.elearnObj.imageLink[this.lang] = this.imageLink;
    this.dataService
      .post(this.baseUrl + ApiEndpointType.UpdateELearning, {
        ...this.elearnObj,
        name: this.langService.convertLangValueList(this.elearnObj.name),
        description: this.langService.convertLangValueList(this.elearnObj.description),
        imageLink: this.langService.convertLangValueList(this.elearnObj.imageLink),
      })
      .then((x: any) => {
        if (x) this.toaster.success(x.message, 'SUCCESS');
        this.geteLearningData();
      })
      .catch((x) => { });
  }
}
