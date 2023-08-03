import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { TranslationService } from '../../core/services/translation.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';

@Component({
  selector: 'app-e-learning',
  templateUrl: './e-learning.component.html',
  styleUrls: ['./e-learning.component.scss']
})
export class ELearningComponent implements OnInit, AfterViewInit {
  imagePlaceHolder = "https://myexstorage.blob.core.windows.net/courseimages/3ad47b02-9cf3-49d8-942d-01b73d0692e9_737maxblue.jpg";
  headingData: any = {
    imageLink: {},
    name: {},
    description: {}
  };
  cmsData: any = [];
  lang: string = 'en';
  count: number = 0;
  constructor(
    private service: CrudService,
    private translation: TranslationService,
    private langService: LanguageService,
  ) { }
  ngOnInit(): void {
    this.getCourse();
    this.translation.onLanguageChange.subscribe((l: string) => this.onLanguageChange(l))
  }

  ngAfterViewInit(): void {
    Array.from(document.getElementsByClassName('accordion-header')).forEach((e: any) => {
      e.onclick = () => { e.nextElementSibling.classList.toggle("show") }
    })
  }
  onLanguageChange(l: string) {
    if (l) {
      this.lang = l;
    }
  }
  getCourse() {
    this.service
      .getAll(environment.apiBase + ApiEndpointType.GetELearning)
      .then((x: any) => {
        this.headingData = {
          ...x,
          name: this.langService.convertLangValueObject(x.name),
          description: this.langService.convertLangValueObject(x.description),
          imageLink: this.langService.convertLangValueObject(x.imageLink)
        }
      });
    this.service
      .getAll(environment.apiBase + ApiEndpointType.GetCoursesList + "/true")
      .then((x: any) => {
        this.count = x.count;
        this.cmsData = x.courseModelList.map((elem: any) => {
          return {
            ...elem,
            description: this.langService.convertLangValueObject(elem.description),
            name: this.langService.convertLangValueObject(elem.name),
            imageLink: this.langService.convertLangValueObject(elem.imageLink)
          }
        })
      })
  }
  onImgError(e: any) {
    e.target.src = this.imagePlaceHolder;
  }
}
