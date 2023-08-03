import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileValidators, NgxFileDragDropComponent } from 'ngx-file-drag-drop';
import { FileSaverService } from 'ngx-filesaver';
import { ToastrService } from 'ngx-toastr';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../genric-service/crudservice';

@Component({
  selector: 'app-employee-add-credentials',
  templateUrl: './employee-add-credentials.component.html',
  styleUrls: ['./employee-add-credentials.component.scss'],
})
export class EmployeeAddCredentialsComponent implements OnInit {
  EmpForm!: FormGroup;
  submitted: boolean = false;
  baseUrl: string = environment.apiBase;
  selectedId: number = 0;
  selected: number = -1;
  update: boolean = false;
  documents: string[] = [];
  allowAddDocuments = true;

  @ViewChild('uploadDocument') uploadDocument!: NgxFileDragDropComponent;

  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private toster: ToastrService,
    private toastr: ToastrService,
    private _FileSaverService: FileSaverService,
    private dialogRef: MatDialogRef<EmployeeAddCredentialsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  credentialsTypeList: any[] = [];

  ngOnInit(): void {
    this.credentialsTypeList = this.data.data;
    this.intializeForm();

    if (this.data.element) {
      this.data.element.date = this.formatDate(
        new Date(this.data.element.date)
      );
      this.EmpForm.patchValue(this.data.element);
      this.documents = this.data.element.documentPath?.trim()
        ? this.data.element.documentPath.split(',')
        : [];

      this.allowAddDocuments = this.documents.length > 0;
      this.selected = this.data.element.credentialTypeID;
      this.update = true;
    } else this.update = false;
  }

  intializeForm() {
    this.EmpForm = this.formBuilder.group({
      credentialID: new FormControl(0),
      name: new FormControl('', [Validators.required]),
      date: new FormControl(new Date()),
      documentPath: new FormControl(null),
      amtCourseCompleted: new FormControl(false),
      amtTotalTrainingHours: new FormControl(0),
      amtAwardTypeID: new FormControl(null),
      amtAwardType: new FormControl(null),
      credentialTypeID: new FormControl(0, [Validators.required]),
      credentialType: new FormControl(null),
      applicationUserID: new FormControl(0),
      applicationUser: new FormControl(null),
      companyCourseID: new FormControl(null),
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.EmpForm.controls;
  }

  Save() {
    this.submitted = true;
    if (this.EmpForm.invalid) {
      return;
    }
    let data: any = this.EmpForm.value;
    data.credentialTypeID = this.selectedId;
    data.applicationUserID = this.data.applicationUserId;
    data.documentPath = this.documents.join(',');
    let url: string = '';
    if (!this.update) url = ApiEndpointType.AddUserCredentials;
    else url = ApiEndpointType.updateUserCredentials;
    this.crudService
      .post(this.baseUrl + url, data)
      .then((x: any) => {
        if (x) {
          this.toster.success(x.message, 'SUCCESS');
          this.closeModal(true);
        }
      })
      .catch((x) => {});
    // this.EmpForm.controls.applicationUserID = this.data.applicationUserId
  }

  fileControl = new FormControl(
    [],
    [FileValidators.required, FileValidators.maxFileCount(2)]
  );

  //use to upload the file
  onValueChange(file: File[]) {
    file.forEach((element: any) => {

      let ext = element.type.substring(element.type.lastIndexOf('.') + 1);

      if (ext != 'application/pdf') {
        this.fileControl;
        this.toster.error('Please upload .pdf file only');
        this.uploadDocument.clear();
        return;
      }

      const formData: FormData = new FormData();
      formData.append('files', element, element.name);

      this.crudService
        .post(this.baseUrl + ApiEndpointType.saveFiles, formData)
        .then((x: any) => {
          if (x) {
            this.documents.push(x.url);
            this.uploadDocument.removeFile(element);
          }
        })
        .catch((x) => {});
    });
  }

  onCustomCoursesFrequancyChange(element: any) {
    if (element) {
      this.selectedId = element.value;
      // this.EmpForm.controls.credentialTypeID= element.value
    }
  }

  closeModal(result: any) {
    this.dialogRef.close(result);
  }

  formatDate(date: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  downloadCredential(item: any) {
    this.crudService
      .getBlobSingleWithParamsAndBody(
        this.baseUrl + ApiEndpointType.DownloadFile,
        item
      )
      .then((x: any) => {
        const name = item.substring(item.lastIndexOf('/') + 1);
        this._FileSaverService.save(x, name);
      })
      .catch((x) => {
        this.toastr.info('No certificate found.');
      });
  }

  removeCredential(item: any) {
    this.crudService
      .postWithBody(
        this.baseUrl +
          ApiEndpointType.RemoveCredential +
          '/' +
          this.EmpForm.value.credentialID,
        item
      )
      .then((x: any) => {
        let originFileName = item.substring(item.lastIndexOf('/') + 1);
        originFileName = originFileName.substring(
          originFileName.indexOf('_') + 1
        );
        originFileName = originFileName.replaceAll('%20', ' ');
        let file = this.uploadDocument.files.find((f) => f.name == originFileName);
        if (x) {
          this.documents = this.documents.filter((h) => h != item);
          if (file) {
            this.uploadDocument.removeFile(file);
          }
          this.toster.success(x.message, 'SUCCESS');
        }
      })
      .catch((x) => {});
  }
}
