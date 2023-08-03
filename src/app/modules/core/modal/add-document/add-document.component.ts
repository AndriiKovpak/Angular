import { DatePipe } from '@angular/common';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileValidators, NgxFileDragDropComponent } from 'ngx-file-drag-drop';
import { FileSaverService } from 'ngx-filesaver';
import { ToastrService } from 'ngx-toastr';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../genric-service/crudservice';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss'],
})
export class AddDocumentComponent implements OnInit {
  Typedata!: FormGroup;
  @ViewChild('addLocDivUpd') addLocDivUpd!: ElementRef;
  @ViewChild('uploadPDF') uploadPDF!: NgxFileDragDropComponent;

  baseUrl: string = environment.apiBase;
  documentTypes: any[] = [];
  getDate: Date = new Date();
  gaugeId: number = 0;
  fileControl = new FormControl(
    [],
    [FileValidators.required, FileValidators.maxFileCount(2)]
  );
  buttontext: string = '';

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private _FileSaverService: FileSaverService,
    private toster: ToastrService,
    public datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.intializeForm();
    this.getDocumentTypes();

    if (this.data) {
      this.buttontext = 'Update';
    } else this.buttontext = 'Add';

    if (this.data && this.data.lastRecordAdded) {
      this.gaugeId = this.data.lastRecordAdded.id;
    }
    if (this.data) {
      this.gaugeId = this.data.lastRecordAdded.id;
      this.images = this.data.data && this.data.data.documentUrl ? this.data.data.documentUrl.trim().split(',') : [];
      this.Typedata = this.formBuilder.group({
        Type: new FormControl(this.data?.data?.documentTypeId, [
          Validators.required,
        ]),
        documentName: new FormControl(this.data?.data?.documentName, [
          Validators.required,
        ]),
        date: new FormControl(new Date(), [Validators.required]),
      });
      this.getDate = new Date(this.data?.data?.documentDate ?? new Date());
    }
  }

  ModalClose() {
    const dialogRef = this.dialog.closeAll();
  }
  get f() {
    return this.Typedata.controls;
  }
  intializeForm() {
    this.Typedata = this.formBuilder.group({
      Type: new FormControl('', [Validators.required]),
      documentName: new FormControl('', [Validators.required]),
      date: new FormControl(new Date(), [Validators.required]),
    });
  }
  selectedDocumentType: any = 0;
  getDocumentTypes() {
    this.crudService
      .getAll(this.baseUrl + ApiEndpointType.DocumentType)
      .then((x: any) => {
        if (x) {
          this.documentTypes = x;
          this.selectedDocumentType = this.data.data.documentTypeId;
        }
      })
      .catch((x) => {});
  }

  images: any[] = [];

  removeFile(item: any) {
    var id = this.data.data ? this.data.data.id : 0;

    this.crudService
      .postWithBody(
        this.baseUrl + ApiEndpointType.RemoveGaugeDocument + '/' +id,
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
          this.images = this.images.filter((h) => h != item);
          if (file) {
            this.uploadPDF.removeFile(file);
          }
          this.toster.success(x.message, 'SUCCESS');
        }
      })
      .catch((x) => {});
  }

  //use to upload the file
  onValueChange(file: File[]) {
    file.forEach((element: any) => {
      let ext = element.type.substring(element.type.lastIndexOf('.') + 1);
      if (ext != 'application/pdf') {
        this.fileControl;
        file = [];
        this.toster.info('Please upload .pdf file only');
        return;
      }
      const formData: FormData = new FormData();
      formData.append('files', element, element.name);
      this.crudService
        .post(this.baseUrl + ApiEndpointType.saveFiles, formData)
        .then((x: any) => {
          if (x) {
            this.images.push(x.url);
            this.uploadPDF.clear();
          }
        })
        .catch((x) => {});
    });
  }
  checkFileUpload: boolean = false;

  submit() {

    if (this.gaugeId == 0) {
      return;
    }
    if (this.Typedata.invalid) {
      this.Typedata.markAllAsTouched();
      return;
    }

    this.checkFileUpload = this.images.length == 0;

    let date;
    if (this.data) date = this.getDate;
    else date = this.Typedata.value.date;

    let data: any = {
      DocumentId: this.data.data?.id ?? 0,
      DocumentName: this.Typedata.value.documentName,
      DocumentUrl: this.images.join(','),
      DocumentDate: new Date(date).toDateString(),
      CompanyId: 0,
      DocumentTypeId: this.Typedata.value.Type,
      gaugeId: this.gaugeId,
    };

    this.crudService
      .post(this.baseUrl + ApiEndpointType.SaveDocumentTypes, data)
      .then((x: any) => {
        if (x) {
          this.toster.success(x.message, 'SUCCESS');
        }
        this.modalClose();
        this.onReset();
      })
      .catch((x) => {
        this.modalClose();
      });
  }

  modalClose() {
    this.dialog.closeAll();
  }

  onReset() {
    this.Typedata.reset();
  }

  openModalLocationforAdd() {
    this.addLocDivUpd.nativeElement.style.display = 'block';
  }

  closeLocationAdd() {
    this.addLocDivUpd.nativeElement.style.display = 'none';
    // this.addStatus = false;
  }

  addLocationField(val: string) {
    this.crudService
      .getAll(`${this.baseUrl + ApiEndpointType.SaveDocumentCustomType}/${val}`)
      .then((x: any) => {
        if (x.duplicate) {
          this.toster.error(x.message, 'ERROR');
        } else this.toster.success(x.message, 'SUCCESS');
        this.getDocumentTypes();
        this.closeLocationAdd();
      })
      .catch((x) => {
        this.closeLocationAdd();
      });
  }

  downloadFile(item: any) {
    this.crudService
      .getBlobSingleWithParamsAndBody(
        this.baseUrl + ApiEndpointType.DownloadFile,
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
}
