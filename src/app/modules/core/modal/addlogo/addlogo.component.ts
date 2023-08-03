import { Objectpass } from './../../services/objectPass.service';
import {
  Component,
  OnInit,
  AfterViewInit,
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
import { SignaturePad } from 'angular2-signaturepad';
import { FileValidators, NgxFileDragDropComponent } from 'ngx-file-drag-drop';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../genric-service/crudservice';
import { FileSaverService } from 'ngx-filesaver';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-addlogo',
  templateUrl: './addlogo.component.html',
  styleUrls: ['./addlogo.component.scss'],
})
export class AddlogoComponent implements OnInit, AfterViewInit {
  @ViewChild(SignaturePad) signaturePad1!: SignaturePad;
  @ViewChild(SignaturePad) signaturePad2!: SignaturePad;

  @ViewChild('filePrimaryLogo') filePrimaryLogo!: NgxFileDragDropComponent;
  @ViewChild('fileTopLeftLogo') fileTopLeftLogo!: NgxFileDragDropComponent;
  @ViewChild('fileMiddleLeftLogo')
  fileMiddleLeftLogo!: NgxFileDragDropComponent;
  @ViewChild('fileButtonLeftLogo')
  fileButtonLeftLogo!: NgxFileDragDropComponent;

  @ViewChild('fileSignatureTwo') fileSignatureTwo!: NgxFileDragDropComponent;
  @ViewChild('fileSignatureOne') fileSignatureOne!: NgxFileDragDropComponent;

  public signaturePadOptions: Object = {
    minWidth: 1,
    maxWidth: 1,
    canvasWidth: 575,
    canvasHeight: 250,
  };

  public signaturePadOptions2: Object = {
    minWidth: 1,
    maxWidth: 1,
    canvasWidth: 575,
    canvasHeight: 250,
    penColor: 'rgb(0,0,0)',
  };

  drawSignatureOne: boolean = false;
  drawSignatureTwo: boolean = false;
  hexCode: string = '';
  error: string | undefined;
  dragAreaClass: string | undefined;
  CourseForm!: FormGroup;
  addCourse!: any;
  buttontext: string = '';
  baseUrl: string = environment.apiBase;
  color: any = '#fff';
  primaryLogo: string = '';
  TopLeftLogo: string = '';
  MiddleLeftLogo: string = '';
  bottomLeftLogo: string = '';
  signaturelink: string = '';

  ngAfterViewInit(): void {
    if (this.signaturePad1) {
      this.signaturePad1.clear();
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private dailog: MatDialog,
    private _FileSaverService: FileSaverService,
    private toster: ToastrService,
    public dialogRef: MatDialogRef<AddlogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private objpass: Objectpass
  ) {
    if (this.data.val != '') this.buttontext = 'Update';
    else this.buttontext = 'Add';
  }
  selectedColor: any;
  ngOnInit(): void {
    this.initializeForm();
    this.objpass.penColor.subscribe((x) => (this.color = x));

    if (!this.color) {
      //this.selectedColor = 'rgb(250,128,96)';
      this.selectedColor = 'rgb(0,55,83)';
    } else {
      this.selectedColor =
        'rgb(' +
        this.color.color.rgb.r +
        ',' +
        this.color.color.rgb.g +
        ',' +
        this.color.color.rgb.b +
        ')';
      this.hexCode = this.color.color.hex;
    }

    this.signaturePadOptions = {
      // passed through to szimek/signature_pad constructor
      minWidth: 1,
      maxWidth: 1,
      canvasWidth: 575,
      canvasHeight: 250,
      penColor: this.selectedColor,
    };
  }
  switchSignatureOptions: boolean = false;

  changeColor(color: any, val: any) {
    if (val == 'black') {
      this.switchSignatureOptions = true;
    } else {
      this.switchSignatureOptions = false;
    }
  }

  initializeForm() {
    if (this.data.data == 'Logo') {
      this.CourseForm = this.formBuilder.group({
        Name: new FormControl(this.data.val?.LogoTitle, [Validators.required]),
      });
      this.primaryLogo = this.data.val?.LogoLink;
      this.TopLeftLogo = this.data.val?.TopLeftLogo;
      this.MiddleLeftLogo = this.data.val?.MiddleLeftLogo;
      this.bottomLeftLogo = this.data.val?.BottomLeftLogo;
    } else if (this.data.data == 'SignatureTwo') {
      this.CourseForm = this.formBuilder.group({
        Name: new FormControl(this.data.val?.signatureTwoTitle, [
          Validators.required,
        ]),
      });
      this.signaturelink = this.data.val?.signatureTwoLink;
    } else if (this.data.data == 'SignatureOne') {
      this.CourseForm = this.formBuilder.group({
        Name: new FormControl(this.data.val?.signatureOneTitle, [
          Validators.required,
        ]),
      });
      this.signaturelink = this.data.val?.signatureOneLink;
    } else {
      this.CourseForm = this.formBuilder.group({
        Name: new FormControl(this.data.val, [Validators.required]),
      });
    }
  }

  get f() {
    return this.CourseForm.controls;
  }

  Save() {
    if (this.data.data == 'Logo') {
      let data: any = {
        LogoLink: this.primaryLogo,
        LogoTitle: this.CourseForm.controls.Name.value,
        TopLeftLogo: this.TopLeftLogo,
        MiddleLeftLogo: this.MiddleLeftLogo,
        BottomLeftLogo: this.bottomLeftLogo,
      };

      this.dialogRef.close({ event: 'logo', data: data });
    } else if (this.data.data == 'SignatureOne') {
      let data: any = {
        signatureOneLink: this.signaturelink,
        signatureOneTitle: this.CourseForm.controls.Name.value,
      };
      this.dialogRef.close({ event: 'SignatureOne', data: data });
    } else if (this.data.data == 'SignatureTwo') {
      let data: any = {
        signatureTwoLink: this.signaturelink,
        signatureTwoTitle: this.CourseForm.controls.Name.value,
      };
      this.dialogRef.close({ event: 'SignatureTwo', data: data });
    } else if (this.data.data == 'Note') {
      let data: any = {
        note: this.CourseForm.controls.Name.value,
      };
      this.dialogRef.close({ event: 'Note', data: data });
    }
  }

  closeModal() {
    this.dailog.closeAll();
  }

  downloadFile(item: any) {
    this.crudService
      .getBlobSingleWithParamsAndBody(
        this.baseUrl + ApiEndpointType.DownloadFileFromCourseImages,
        item
      )
      .then((x) => {
        if (x) {
          const name = item.substring(item.lastIndexOf('/') + 1);
          this._FileSaverService.save(x, name);
        } else {
          this.toster.info('No document found.');
        }
      })
      .catch((x) => {
        this.toster.info('No document found.');
      });
  }

  onValueChangeForLogo(file: File[], val: string) {
    file.forEach((element: any) => {
      const formData: FormData = new FormData();
      formData.append('files', element, element.name);

      this.crudService
        .post(this.baseUrl + ApiEndpointType.saveimageurl, formData)
        .then((x: any) => {
          if (x) {
            switch (val) {
              case 'primaryLogo':
                this.primaryLogo = x.url;
                this.filePrimaryLogo.clear();
                break;
              case 'TopLeft':
                this.TopLeftLogo = x.url;
                this.fileTopLeftLogo.clear();
                break;
              case 'middleLeft':
                this.MiddleLeftLogo = x.url;
                this.fileMiddleLeftLogo.clear();
                break;
              case 'bottomLeft':
                this.bottomLeftLogo = x.url;
                this.fileButtonLeftLogo.clear();
                break;
              case 'signatureTwoFile':
                this.signaturelink = x.url;
                this.fileSignatureTwo.clear();
                break;
              case 'signatureOneFile':
                  this.signaturelink = x.url;
                  this.fileSignatureOne.clear();
                  break;
              default:
                this.primaryLogo = x.url;
                this.filePrimaryLogo.clear();
                break;
            }
          }
        })
        .catch((x) => {});
    });
  }

  imageData: any = {
    PreviewImage: '',
    FileAsByteArray: '',
  };

  drawComplete() {
    let base64 = this.signaturePad1.toDataURL().toString().split(',')[1];
    this.imageData = {
      PreviewImage: base64,
      FileAsByteArray: '',
    };
  }

  getImageLink() {
    if (this.drawSignatureTwo || this.drawSignatureOne) {
      this.crudService
        .post(this.baseUrl + ApiEndpointType.SaveSignature, this.imageData)
        .then((x: any) => {
          if (x) {
            this.signaturelink = x.url;
            this.Save();
          }
        })
        .catch((x) => { });
    } else {
      this.Save();
    }
  }
}
