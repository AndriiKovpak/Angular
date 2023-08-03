import { LanguageService } from './../../_helpers/languge-filter.service';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../genric-service/crudservice';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../guards/auth.service';

@Component({
  selector: 'app-add-aboutus',
  templateUrl: './add-aboutus.component.html',
  styleUrls: ['./add-aboutus.component.scss'],
})
export class AddAboutusComponent implements OnInit {
  form!: FormGroup;
  baseUrl: string = environment.apiBase;
  buttontext: string = 'submit';
  selectedId: number = 0;
  listData: any[] = [];
  lang: string = 'en';

  @ViewChild('fileInput') el!: ElementRef;
  imageUrl: any = '';
  editFile: boolean = true;
  removeUpload: boolean = false;
  userInfo: any;

  constructor(
    private langservice: LanguageService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dataService: CrudService,
    public toaster: ToastrService,
    public translationService: TranslationService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  recordToedit: any;
  ngOnInit(): void {
    this.lang = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
        ? this.userInfo?.languagePreference
        : 'en';
    this.buttontext = (this.data?.id) ? "Update" : "Add";
    this.userInfo = this.authService.getUserInformation();
    if (!this.data?.id) {
      this.data = {
        name: { en: '', es: '' },
        designation: { en: '', es: '' },
        description: { en: '', es: '' },
        miniDescription: { en: '', es: '' },
        iamge: ''
      }
    }
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      name: new FormControl(this.data.name[this.lang], [Validators.required]),
      designation: new FormControl(this.data.designation[this.lang], [Validators.required]),
      description: new FormControl(this.data.description[this.lang], [Validators.required]),
      image: new FormControl(this.data.image),
      miniDescription: new FormControl(this.data.miniDescription[this.lang])
    });
    this.postImageUrl = this.postImageUrl || this.data.image;
    this.imageUrl = this.postImageUrl || 'https://i.ibb.co/fDWsn3G/buck.jpg';
  }
  get f() { return this.form.controls; }
  ModalClose() {
    const dialogRef = this.dialog.closeAll();
  }
  postImageUrl: string = '';
  UpdateAboutUs() {
    if (this.data?.id) {
      this.getValue();
      this.dataService
        .post(this.baseUrl + ApiEndpointType.UpdateAboutUs, {
          ...this.data,
          image: this.postImageUrl || this.data.image,
          name: this.langservice.convertLangValueList(this.data.name),
          designation: this.langservice.convertLangValueList(this.data.designation),
          description: this.langservice.convertLangValueList(this.data.description),
          miniDescription: this.langservice.convertLangValueList(this.data.miniDescription)
        })
        .then((x: any) => {
          if (x) this.toaster.success(x.message, 'SUCCESS');
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    } else {
      this.getValue();
      this.dataService
        .post(this.baseUrl + ApiEndpointType.AddAboutUs, {
          ...this.data,
          image: this.postImageUrl || this.data.image,
          name: this.langservice.convertLangValueList(this.data.name),
          designation: this.langservice.convertLangValueList(this.data.designation),
          description: this.langservice.convertLangValueList(this.data.description),
          miniDescription: this.langservice.convertLangValueList(this.data.miniDescription)
        })
        .then((x: any) => {
          if (x) this.toaster.success(x.message, 'SUCCESS');
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    }
    this.ModalClose();
  }

  coursesValid: boolean = false;
  Save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.UpdateAboutUs();
  }

  uploadFile(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
        const formData: FormData = new FormData();
        formData.append(
          'files',
          event.target.files[0],
          event.target.files[0].name
        );
        this.dataService
          .post(this.baseUrl + ApiEndpointType.saveimageurl, formData)
          .then((x: any) => {
            if (x) {
              this.postImageUrl = x.url || 'https://i.ibb.co/fDWsn3G/buck.jpg';
            }
          })
          .catch((x) => { });
      };
    }
  }

  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.imageUrl = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';
    this.editFile = true;
    this.removeUpload = false;
  }
  getValue() {
    this.data.name[this.lang] = this.form.value.name;
    this.data.designation[this.lang] = this.form.value.designation;
    this.data.description[this.lang] = this.form.value.description;
    this.data.miniDescription[this.lang] = this.form.value.miniDescription;
    this.data.image = this.postImageUrl;
  }
  onChangeLanguage(event: any) {
    this.getValue();
    this.lang = event.value;
    this.initializeForm();
  }
}
