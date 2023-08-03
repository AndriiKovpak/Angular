import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Component,
  OnInit,
  HostListener,
  AfterViewInit,
  VERSION,
  ViewChild,
  Inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FilePreviewModel } from 'ngx-awesome-uploader';
import { FileValidators, NgxFileDragDropComponent } from 'ngx-file-drag-drop';
import { FileSaverService } from 'ngx-filesaver';
import { ToastrService } from 'ngx-toastr';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../genric-service/crudservice';
import { DemoFilePickerAdapter } from '../../_helpers/demo-file-picker.adapter';
import { LanguageService } from '../../_helpers/languge-filter.service';
import { Course } from './Model/admin-course.model';
@Component({
  selector: 'app-admin-courses-add',
  templateUrl: './admin-courses-add.component.html',
  styleUrls: ['./admin-courses-add.component.scss'],
})
export class AdminCoursesAddComponent implements OnInit {
  error: string | undefined;
  dragAreaClass: string | undefined;
  CourseForm!: FormGroup;
  addCourse!: Course;
  buttontext: string = '';
  baseUrl: string = environment.apiBase;
  userInfo: any = {};
  lang: string = 'en';
  selectedLang: string = 'en';
  Image: string = '';
  public adapter = new DemoFilePickerAdapter(this.http);
  @ViewChild('uploadPDF') uploadPDF!: NgxFileDragDropComponent;
  @ViewChild('uploadImage') uploadImage!: NgxFileDragDropComponent;
  purchasedSpanish: boolean = false;
  fileControl = new FormControl(
    [],
    [FileValidators.required, FileValidators.maxFileCount(1)]
  );
  fileControl2 = new FormControl(
    [],
    [FileValidators.required, FileValidators.maxFileCount(1)]
  );
  onFileChange(event: any) {
    let files: FileList = event.target.files;
    this.saveFiles(files);
  }
  
  handouts: string[] = [];
  handoutsNames: string[] = [];
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private dailog: MatDialog,
    private dailog2: MatDialogRef<AdminCoursesAddComponent>,
    private toster: ToastrService,
    private _FileSaverService: FileSaverService,
    private languageService: LanguageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.buttontext = (this.data?.courseID) ? "Update" : "Add";
  }

  ngOnInit(): void {
    this.initializeForm();
    this.userInfo = JSON.parse(localStorage.getItem('userDetails') ?? '');
    this.GetCompanyByUser();
  }
  companyData: any;

  GetCompanyByUser() {
    this.crudService
      .getAll(`${this.baseUrl + ApiEndpointType.GetCompanyByUser}/${this.userInfo.userId}`)
      .then((x: any) => {
        if (x) { this.purchasedSpanish = x.purchasedSpanishLanguageCourse; }
      });
  }

  initializeForm() {
    this.CourseForm = this.formBuilder.group({
      Name: new FormControl('', [Validators.required]),
      Description: new FormControl(''),
      training: new FormControl(0),
      Video: new FormControl(''),
      CourseLink: new FormControl(''),
    });
    this.Image = this.data?.imageLink[this.lang];
    this.handouts = this.data.handoutLink[this.lang].split(',');
    if (this.data) {
      this.CourseForm = this.formBuilder.group({
        Name: new FormControl(this.data?.name[this.lang], [Validators.required]),
        Description: new FormControl(this.data?.description[this.lang]),
        training: new FormControl(this.data.totalTrainingTime),
        Video: new FormControl(this.data.video[this.lang]),
        CourseLink: new FormControl(this.data.courseLink[this.lang]),
      });
    }
  }

  changeLang() {
    if (this.data) {
      this.data.name[this.lang] = this.CourseForm.value.Name;
      this.data.description[this.lang] = this.CourseForm.value.Description;
      this.data.video[this.lang] = this.CourseForm.value.Video;
      this.data.courseLink[this.lang] = this.CourseForm.value.CourseLink;
      this.data.imageLink[this.lang] = this.Image;
      this.data.handoutLink[this.lang] = this.handouts.join(',');
      this.lang = this.selectedLang;
      this.CourseForm = this.formBuilder.group({
        Name: new FormControl(this.data?.name[this.lang], [Validators.required]),
        Description: new FormControl(this.data.description[this.lang]),
        Video: new FormControl(this.data.video[this.lang]),
        CourseLink: new FormControl(this.data.courseLink[this.lang]),
        training: new FormControl(this.data.totalTrainingTime),
      });
      this.Image = this.data.imageLink[this.lang];
      this.handouts = this.data.handoutLink[this.lang].split(',');
      this.selectedLang = this.lang;
    }
  }
  get f() { return this.CourseForm.controls; }
  savedRecord: any;
  Save() {
    if (!this.CourseForm.valid) return;
    this.data.name[this.lang] = this.CourseForm.value.Name;
    this.data.description[this.lang] = this.CourseForm.value.Description;
    this.data.video[this.lang] = this.CourseForm.value.Video;
    this.data.courseLink[this.lang] = this.CourseForm.value.CourseLink;
    this.data.imageLink[this.lang] = this.Image;
    this.data.handoutLink[this.lang] = this.handouts.join(',');
    let url: string = this.data?.courseID
      ? ApiEndpointType.UpdateCourses
      : ApiEndpointType.AddCourses;
    this.crudService
      .post(this.baseUrl + url, {
        courseID: this.data.courseID,
        name: this.languageService.convertLangValueList(this.data.name),
        description: this.languageService.convertLangValueList(this.data.description),
        videoId: this.languageService.convertLangValueList(this.data.video),
        courseLink: this.languageService.convertLangValueList(this.data.courseLink),
        imageLink: this.languageService.convertLangValueList(this.data.imageLink),
        handoutLink: this.languageService.convertLangValueList(this.data.handoutLink),
        totalTrainingTime: this.CourseForm.value.training,
        isCustomCourse: this.data.isCustomCourse
      })
      .then((x: any) => {
        if (x) {
          this.toster.success(x.message, 'SUCCESS');
          this.dailog2.close();
        }
      })
      .then((x) => { });
  }

  saveFiles(files: FileList) {
    if (files.length > 1) this.error = 'Only one file at time allow';
    else {
      this.error = '';
    }
  }
  closeModal() {
    this.dailog2.close();
  }
  images: string[] = [];
  pdf: string[] = [];
  files: any;

  checkFilesAllowed(file: File[], val: string) {
    for (let index = 0; index < file.length; index++) {
      const element = file[index];
      let ext = element.type.substring(element.type.lastIndexOf('.') + 1);

      if (val == 'pdf') {
        if (
          ext != 'application/pdf' &&
          ext != 'ms-powerpoint' &&
          ext != 'presentation'
        ) {
          this.toster.error(
            "Only files in '.pdf' or '.ppt' format are accepted."
          );
          this.uploadPDF.removeFile(element);
          return;
        }
      }

      if (val == 'image' && ext != 'image/jpeg' && ext != 'image/png') {
        this.toster.error(
          "Only files in '.png' or '.jpg' format are accepted."
        );
        this.uploadImage.removeFile(file[index]);
        return;
      }
    }
  }

  //use to upload the file
  onValueChange(file: File[], val: string) {
    this.checkFilesAllowed(file, val);
    file.forEach((element: any) => {
      const formData: FormData = new FormData();
      formData.append('files', element, element.name);
      let url: string = '';
      url =
        val == 'pdf'
          ? ApiEndpointType.savehandoutdocument
          : ApiEndpointType.saveimageurl;
      this.crudService
        .post(this.baseUrl + url, formData)
        .then((x: any) => {
          if (x) {
            if (val == 'pdf') {
              if (this.handouts.length == 1 && !this.handouts[0]) {
                this.handouts = [x.message];
              } else {
                this.handouts.push(x.message);
              }
              this.uploadPDF.clear();
            }
            else {
              this.Image = x.url;
              this.uploadImage.clear();
            }
          }
        })
        .catch((x) => { });
    });
  }

  uploadedVideoUrl: string = '';
  onValueChangeVideo(fileItem: FilePreviewModel, val: string) {
    if (fileItem && fileItem.uploadResponse?.url) {
      this.uploadedVideoUrl = fileItem.uploadResponse?.url;
    }
  }
  showDropdown: boolean = false;
  handleSelected($event: any) {
    if ($event.target.checked === true) {
      // Handle your code
      this.showDropdown = true;
    } else {
      this.showDropdown = false;
    }
  }
  showModalAfterLanguageSelected: boolean = false;
  language: string = '';
  onOptionsSelected(value: string) {
    if (value == 'spanish') {
      this.language = value;
      this.showModalAfterLanguageSelected = true;
      this.openModalForLanguageSelected(value);
    } else {
      this.showModalAfterLanguageSelected = false;
    }
  }

  openModalForLanguageSelected(element: any) {
    let newData: any;
    let data: any;

    if (localStorage.getItem('EditObj'))
      data = JSON.parse(localStorage.getItem('EditObj') ?? '');
    if (!data) {
      newData = {
        data: {
          Id: 0,
          Description: '',
          Name: '',
          Video: '',
          TotalTrainingTime: '',
          description: '',
        },
        obj: {
          courseID: 0,
          name: [
            {
              langcode: 'en',
              value: '',
            },
            {
              langcode: 'es',
              value: '',
            },
          ],
          handoutLink: '',
          videoID: '',
          videoUrl: '',
          description: [
            {
              langcode: 'en',
              value: '',
            },
            {
              langcode: 'es',
              value: '',
            },
          ],
          imageLink: '',
          isDeleted: false,
          isCustomCourse: false,
          totalTrainingTime: 0,
          courseLink: null,
          dateCreated: '',
          courseTotalTraningTime: '',
          countList: 0,
          customCertificateId: null,
        },
        lang: 'es',
        language: 'spanish',
        type: 'add',
      };
    }
    if (data) data['language'] = this.language;
    if (newData) newData['language'] = this.language;

    this.dailog.open(AdminCoursesAddComponent, {
      data: data ?? newData,
    });
  }

  downloadHandout(item: any) {
    this.crudService
      .getBlobSingleWithParamsAndBody(
        this.baseUrl + ApiEndpointType.DownloadHandout,
        item
      )
      .then((x: any) => {
        const name = item.substring(item.lastIndexOf('/') + 1);
        this._FileSaverService.save(x, name);
      })
      .catch((x) => { });
  }

  removeHandout(item: any) {
    this.crudService
      .postWithBody(
        this.baseUrl +
        ApiEndpointType.RemoveHandout +
        '/' +
        this.data?.obj?.courseID,
        item
      )
      .then((x: any) => {
        let originFileName = item.substring(item.lastIndexOf('/') + 1);
        originFileName = originFileName.substring(
          originFileName.indexOf('_') + 1
        );
        originFileName = originFileName.replaceAll('%20', ' ');
        let file = this.uploadPDF.files.find((f) => f.name == originFileName);
        if (x) {
          this.handouts = this.handouts.filter((h) => h != item);
          if (file) {
            this.uploadPDF.removeFile(file);
          }
          this.toster.success(x.message, 'SUCCESS');
        }
      })
      .catch((x) => { });
  }

  viewPhoto() {
    if (this.Image != '') window.open(this.Image);
  }
}
