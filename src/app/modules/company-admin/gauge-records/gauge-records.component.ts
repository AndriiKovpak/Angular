import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { CrudService } from 'src/app/modules/core/genric-service/crudservice';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AddDocumentComponent } from '../../core/modal/add-document/add-document.component';
import { AuthService } from '../../core/guards/auth.service';
import { Guid } from 'guid-typescript';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, pairwise, startWith } from 'rxjs/operators';
import { TranslationService } from '../../core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { FileSaverService } from 'ngx-filesaver';
import { IUserPermissions } from "../../core/models/IUserPermissions";
import { UserService } from "../../core/services/user.service";
import { NgxPrinterService } from 'ngx-printer';
@Component({
  selector: 'app-gauge-records',
  templateUrl: './gauge-records.component.html',
  styleUrls: ['./gauge-records.component.scss'],
})
export class GaugeRecordsComponent implements OnInit {
  AddNewGauge!: FormGroup;
  RecordsReview!: FormGroup;
  baseUrl: string = environment.apiBase;

  gaugeStatusList: any[] = [];
  gaugeOwnerList: any;
  gaugeManufacturerList: any;
  gaugeLocationList: any;
  gaugeStandardList: any;
  userInfo: any;
  activateAfterData: boolean = false;
  displayedColumnsAdmin: string[] = [
    'type',
    'documentName',
    'documentDate',
    'actions',
  ];
  dataSourceAdmin: any;
  addStatus: boolean = false;
  addStd: boolean = false;
  duplicateGaugeId: boolean = false;
  gaugesCount: number = 0;
  @ViewChild('addDepDiv') addDepDiv!: ElementRef;
  @ViewChild('addstdDiv') addstdDiv!: ElementRef;
  @ViewChild('addOwnDiv') addOwnDiv!: ElementRef;
  @ViewChild('addOwnDivupd') addOwnDivupd!: ElementRef;
  @ViewChild('addmnfDiv') addmnfDiv!: ElementRef;
  @ViewChild('addLocDiv') addLocDiv!: ElementRef;
  @ViewChild('addLocDivUpd') addLocDivUpd!: ElementRef;
  @ViewChild('mnfDivadd') mnfDivadd!: ElementRef;
  @ViewChild('AddstandardModal') AddstandardModal!: ElementRef;
  @ViewChild('saveStandardInput') saveStandardInput!: ElementRef;
  @ViewChild('deletepop') deleteDoc!: ElementRef;
  @ViewChild('deletepopForRecord') deletepopForRecord!: ElementRef;
  @ViewChild('printDiv') printDiv!: ElementRef;

  editGaugeStatusCheck: boolean = false;

  myexCoursesActive: string = 'Active';
  statusList: any[] = [];
  public id: any = '';
  userPermissions: IUserPermissions = { calibrationPermissions: {} };

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    public dataService: CrudService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loader: NgxUiLoaderService,
    private printerService: NgxPrinterService,
    private _FileSaverService: FileSaverService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    public translationService: TranslationService,
    public userService: UserService
  ) {
    this.userInfo = this.authService.getUserInformation();
  }

  control = new FormControl();
  streets: string[] = [];
  gaugeID: string[] = [];
  filteredStreets!: Observable<string[]>;
  gaugeIds!: Observable<string[]>;

  roleSupplier: boolean = false;
  roleRead: boolean = false;
  roleCompanyAdmin: boolean = false;
  roleAdmin: boolean = false;
  showAddButtons: boolean = false;

  gaugeIdByParam: string = '';
  gaugeStatusByParam: string = '';

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params && params.id) {
        this.gaugeIdByParam = params.id;
        this.gaugeStatusByParam = params.id2;
        this.statusId = +params.id2;
        this.selectedStatus = this.statusList.find(x => x.id == this.statusId);
      }
    });

    this.userService.getUserPermissions$().subscribe(x => {
      if (x) this.userPermissions = x;
      this.enableFormByPermissions();
    }
    )

    this.switchLanguage();
    this.initializeForm();
    this.updateUserInfo();
    this.GetStatusReportSelectList();

  }
  switchLanguage() {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
    });
  }
  userEmail: string = '';
  updateUserInfo() {
    this.dataService
      .getAll(this.baseUrl + '/api/Authorize/user')
      .then((res: any) => {
        localStorage.removeItem('userDetails');
        localStorage.setItem('userDetails', JSON.stringify(res));
        this.userInfo = this.authService.getUserInformation();
        this.userEmail = this.userInfo.displayUserName;
        this.auth();
        this.GetSupplier();
        // this.getCourseDataList();
        this.getGaugeStatusDataList();
        this.getGaugeStandardDataList();
        this.getGaugeOwnerDataList();
        this.getGaugeManufacturerDataList();
        this.getGaugeLocationDataList();
        if (this.gaugeIdByParam == '') this.lastRecordOfGauge();

        // this.getGaugesCount();
        this.GaugeCountWithId();
        this.getsearchList();
        this.getArrayOfIds();
        this.getSupplierListWithoutUser();
        if (this.gaugeStatusByParam !== '') {
          this.search(this.gaugeIdByParam);
          this.status = true;
        }
        //this.GetSupplier();
      });
  }

  auth() {
    if (this.userInfo?.role) {
      let roleArray = (this.userInfo.role as string).split(',').map(e => e.toLowerCase());
      this.roleSupplier = roleArray.includes('supplier');
      this.roleRead = roleArray.includes('read');
      this.roleCompanyAdmin = roleArray.includes('companyadmin');
      this.roleAdmin = roleArray.includes('admin');
    }
    this.showAddButtons = this.roleAdmin || this.roleCompanyAdmin;
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.streets.filter((street) =>
      this._normalizeValue(street).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value?.toLowerCase().replace(/\s/g, '');
  }

  private _filterGauge(value: string): string[] {
    const filterValue = this._normalizeValuegauge(value);
    return this.gaugeID.filter((street) =>
      this._normalizeValuegauge(street).includes(filterValue)
    );
  }

  private _normalizeValuegauge(value: string = ''): string {
    return value ? value.toString().toLowerCase().replace(/\s/g, '') : '';
  }

  openModal() {
    if (!this.lastRecordAdded) {
      this.toastr.info(
        'Please add the gauge first to add document related to gauge.'
      );
      return;
    }
    const dialogRef = this.dialog.open(AddDocumentComponent, {
      data: {
        lastRecordAdded: this.lastRecordAdded,
      },
    });
    dialogRef.afterClosed().subscribe((x) => {
      this.GetAllDocuments();
    });
  }
  intialValue: any;
  initializeForm() {
    (this.AddNewGauge = this.formBuilder.group({
      id: new FormControl(0),
      gaugeId: new FormControl('', [Validators.required]),
      status: new FormControl(0, [Validators.required, Validators.min(1)]),
      supplierId: new FormControl(0, [Validators.required, Validators.min(1)]),
      certificateNumber: new FormControl('', [Validators.required]),
      standardId: new FormControl(0, [Validators.required, Validators.min(1)]),
      result: new FormControl('', [Validators.required]),
      calibrationDate: new FormControl('', [Validators.required]),
      frequency: new FormControl('', [Validators.required]),
      addedBy: new FormControl(''),
      notes: new FormControl(''),
      description: new FormControl('', [Validators.required]),
      measureUnit: new FormControl('', [Validators.required]),
      modelNumber: new FormControl('', [Validators.required]),
      serialNumber: new FormControl(''),
      ownerId: new FormControl(0, [Validators.required, Validators.min(1)]),
      manufacturerId: new FormControl(0, [
        Validators.required,
        Validators.min(1),
      ]),
      locationId: new FormControl(0, [Validators.required, Validators.min(1)]),
      newDate: new FormControl(''),
      retirementDate: new FormControl(''),
      calibrationDueDate: new FormControl('', [Validators.required]),
      emails: new FormControl(''),
      companyID: new FormControl(0),
      isDeleted: new FormControl(false),
      createdDate: new FormControl(''),
      updatedDate: new FormControl(''),
      updatedBy: new FormControl(this.userInfo.displayUserName),
    })),
      (this.RecordsReview = this.formBuilder.group({
        Inputdate: new FormControl('', [Validators.required]),
        Course: new FormControl('', [Validators.required]),
      }));
    this.intialValue = this.AddNewGauge.value;
  }
  get f() {
    return this.AddNewGauge.controls;
  }
  //get the gauge status data
  getGaugeStatusDataList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetGaugeStatusSelectList)
      .then((x: any) => {
        this.gaugeStatusList = x;
      });
  }
  //get the gauge standard data
  getGaugeStandardDataList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetGaugeStandardSelectList)
      .then((x) => {
        this.gaugeStandardList = x;
      });
  }
  //get the gauge owner data
  getGaugeOwnerDataList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetGaugeOwnerSelectList)
      .then((x) => {
        this.gaugeOwnerList = x;
      });
  }
  //get the gauge manufacturer data
  getGaugeManufacturerDataList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetGaugeManufacturerSelectList)
      .then((x) => {
        this.gaugeManufacturerList = x;
      });
  }
  //get the gauge location data
  getGaugeLocationDataList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetGaugeLocationSelectList)
      .then((x) => {
        this.gaugeLocationList = x;
      });
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.AddNewGauge.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  submitFormWithDiffGaugeId: string = '';
  submitFormWithDiffId() {
    if (!this.lastRecordAdded) {
      this.toastr.info('Please add gauge first to clone the gauge.');
      return;
    }
    this.lastRecordAdded.createdDate = null;
    this.AddNewGauge.get('id')?.patchValue(0);
    this.AddNewGauge.get('certificateNumber')?.patchValue('');
    this.AddNewGauge.get('modelNumber')?.patchValue('');
    this.AddNewGauge.get('newDate')?.patchValue('');
    this.AddNewGauge.get('retirementDate')?.patchValue('');
    this.AddNewGauge.get('notes')?.patchValue('');
    this.AddNewGauge.get('gaugeId')?.patchValue('');
    this.AddNewGauge.get('serialNumber')?.patchValue('');
    this.dataSourceAdmin = null;
    // this.id = Guid.create(); // ==> b77d409a-10cd-4a47-8e94-b0cd0ab50aa1 retirementDate
    // this.AddNewGauge.get('gaugeId')?.patchValue(Guid.create()); modelNumbernewDate notes gaugeId serialNumber
    // this.submitGaugeForm();
  }
  validateEmail(email: string) {
    const regularExpression =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
  }
  validEmailCheck: boolean = true;
  //submit gauge form
  submitGaugeForm() {
    if (this.AddNewGauge.invalid) {
      this.AddNewGauge.markAllAsTouched();
      return;
    }
    if (this.duplicateGaugeId) {
      this.searchCheckDuplicate = false;
    }
    if (!(this.AddNewGauge.value.emails == '')) {
      let email = this.AddNewGauge.value.emails.split(',');
      email.forEach((element: any) => {
        if (element.includes(';')) {
          let semiColonSplit = element.split(';');
          email = email.filter((x: any) => x != element);
          semiColonSplit.forEach((x: any) => {
            email.push(x);
          });
        }
      });
      let emails = '';
      let i = 0;
      email.forEach((val: any) => {
        ++i;
        if (this.validateEmail(val)) {
          if (i != 1) emails = val;
          else {
            if (emails) emails = `${emails + ',' + val}`;
            else emails = val;
          }
          this.validEmailCheck = true;
        } else {
          this.validEmailCheck = false;
          this.toastr.error(
            'This is not an valid email' +
            ' ' +
            val +
            '.Please check Additional Emails for Notifications ',
            'ERROR'
          );
          return;
        }
      });
      if (!this.validEmailCheck) return;
      this.AddNewGauge.value.emails = emails;
    }
    this.findInvalidControls();
    if (this.duplicateGaugeId) {
      return;
    }
    if (this.AddNewGauge.invalid) {
      this.AddNewGauge.markAllAsTouched();
      return;
    }
    // this.AddNewGauge.value.retirementDate = new Date(
    //   this.AddNewGauge.value.retirementDate
    // ).toDateString();
    this.AddNewGauge.value.calibrationDate = new Date(
      this.AddNewGauge.value.calibrationDate
    ).toISOString();
    // this.AddNewGauge.value.AddedBy = this.userInfo.userId;
    this.AddNewGauge.value.UpdatedBy = this.userInfo?.displayUserName?.split(
      ' '
    )[0]
      ? this.userInfo.displayUserName?.split(' ')[0]
      : this.userInfo.displayUserName;
    this.AddNewGauge.value.result =
      this.AddNewGauge.value.result == '1' ? true : false;
    // this.AddNewGauge.value.SupplierId = this.userInfo.userId;
    if (this.AddNewGauge.value.gaugeId?.value)
      this.AddNewGauge.value.gaugeId = this.AddNewGauge.value.gaugeId.value;
    else this.AddNewGauge.value.gaugeId = this.AddNewGauge.controls.gaugeId.value;
    // this.ngxLoader.start();
    // if (this.id != '') this.AddNewGauge.value.gaugeId = this.id;
    this.AddNewGauge.value.newDate = this.AddNewGauge.value.newDate?.includes(
      'Invalid'
    )
      ? null
      : this.AddNewGauge.value.newDate;
    this.AddNewGauge.value.retirementDate =
      this.AddNewGauge.value.retirementDate?.includes('Invalid')
        ? null
        : this.AddNewGauge.value.retirementDate;
    if (this.AddNewGauge.value.newDate) {
      this.AddNewGauge.value.newDate = new Date(
        this.AddNewGauge.value.newDate
      ).toISOString();
    }
    if (this.AddNewGauge.value.retirementDate) {
      this.AddNewGauge.value.retirementDate = new Date(
        this.AddNewGauge.value.retirementDate
      ).toISOString();
    }
    this.AddNewGauge.value.createdDate = '';
    this.dataService
      .post(
        `${this.baseUrl + ApiEndpointType.AddGauge}/`,
        this.AddNewGauge.value
      )
      .then((x: any) => {
        if (x) {
          this.id = '';
          if (x) this.toastr.success(x.message, 'SUCCESS');
          this.saveGaugeLogs();
          this.initializeForm();
          this.updateUserInfo();
          //  this.getGaugesCount();
        }
      })
      .catch((x: any) => {
        this.toastr.error(x.error, 'ERROR');
      });
  }

  get canSaveGauge() {
    return this.roleCompanyAdmin || this.roleAdmin || (this.roleSupplier && this.selectedStatus?.name.toLowerCase() === 'out for calibration')
  }

  saveGaugeLogs() {
    if (this.changesDescription != '') {
      let data: any = {
        actions: this.changesDescription,
        gaugeid: this.lastRecordAdded.id,
        UpdatedDate: new Date(),
        UserId: '',
      };
      this.dataService
        .post(this.baseUrl + ApiEndpointType.SaveGaugeLogs, data)
        .then((x) => { })
        .catch((x) => { });
    }
  }
  // check duplicate gauge id
  /**
   * checkDuplicateGaugeId
   */
  public checkDuplicateGaugeId(val: string) {
    this.dataService
      .getAll(`${this.baseUrl + ApiEndpointType.CheckDuplicateGaugeId}/${val}`)
      .then((x) => { })
      .catch((x) => { });
  }
  documentsCheck: any[] = [];
  // Get All Company Admins
  GetAllDocuments() {
    if (this.lastRecordAdded?.id > 0)
      this.dataService
        .getAll(
          `${this.baseUrl + ApiEndpointType.GetAllDocuments}/${this.activateAfterData
          }/${this.lastRecordAdded.id}`
        )
        .then((x: any) => {
          if (x) {
            // let data = result.filter(
            //   (x: any) => x.gaugeId == this.lastRecordAdded.id
            // );
            this.documentsCheck = x;
            this.dataSourceAdmin = null;
            this.dataSourceAdmin = [...x];
          }
        })
        .catch((x) => { });
  }
  //this function is used to delete the documents
  deleteCompanyCourses(val: any, type: string) {
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.DeleteDocuments}/${val}/${type}`
      )
      .then((x) => {
        if (x && !this.activateAfterData)
          this.toastr.success('Deleted successfully');
        else this.toastr.success('Record recovered successfully.');
        this.delete();
        this.GetAllDocuments();
      })
      .catch((x) => this.toastr.error('An error occurred'));
  }
  deleteTheDocument: boolean = false;
  deleteDocument(val: string) {
    if (val.toLowerCase() == 'delete') {
      this.deleteTheDocument = true;
      this.deleteCompanyCourses(this.deleteId, 'delete');
    } else this.deleteTheDocument = false;
    this.delete();
  }
  deleteGaugedata: boolean = false;
  deleteGauge(val: string) {
    if (val.trim().toLowerCase() == 'delete') {
      this.lastRecordAdded;
      this.deleteGaugedata = true;
      this.deletegaugeRecord();
    } else this.deleteGaugedata = false;
    this.deleteForGauge();
  }
  deletegaugeRecord() {
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.deleteGauge}/${this.lastRecordAdded.id
        }`
      )
      .then((x: any) => {
        if (x) this.toastr.success(x.message, 'SUCCESS');
        this.deleteForGauge();
        this.initializeForm();
        this.updateUserInfo();
      })
      .catch((x) => {
        if (x) this.toastr.error(x.error, 'ERROR');
        this.deleteForGauge();
      });
  }

  //this function is to download all files
  downLoadAllFiles(element: any) {

    let url = element ? `${this.baseUrl + ApiEndpointType.GaugeDownloadAllDocuments}/${this.activateAfterData
      }/0/${element.id}` :
      `${this.baseUrl + ApiEndpointType.GaugeDownloadAllDocuments}/${this.activateAfterData
      }/${this.lastRecordAdded.id}/0`;

    if (this.lastRecordAdded?.id > 0)
      this.dataService
        .getBlobSingleWithParams(url)
        .then((x) => {
          if (x) {
            let fileName = element ? 'Documents_' + element.id + '.zip' : 'Documents_' + this.lastRecordAdded.id + '.zip';
            this._FileSaverService.save(x, fileName);
          } else {
            this.toastr.info('No documents found.');
          }
        })
        .catch((x) => {
          this.toastr.info('No documents found.');
        });
  }

  edit(element: any) {
    let dialogRef = this.dialog.open(AddDocumentComponent, {
      data: {
        data: element,
        type: 'edit',
        lastRecordAdded: this.lastRecordAdded,
      },
    });

    dialogRef.afterClosed().subscribe((x) => {
      this.GetAllDocuments();
    });
  }

  OpenAddManufacturerModal() {
    this.mnfDivadd.nativeElement.style.display = 'block';
  }
  deleteId: number = 0;
  deleteMessage: string = '';
  opendeleteModal(val: any) {
    this.deleteId = val.id;
    if (confirm('Are you sure to delete this document?'))
      this.deleteCompanyCourses(this.deleteId, 'delete');
    // this.deleteMessage = `Are you sure want to delete ${val.documentName} ?`;
    // this.deleteDoc.nativeElement.style.display = 'block';
  }
  deleteIdForGauge: number = 0;
  deletemessaageForGauge: string = '';
  opendeleteModalForGauge() {
    // this.deleteIdForGauge = val.id;
    this.deletemessaageForGauge = `Are you sure want to delete ${this.lastRecordAdded.gaugeId}?`;
    this.deletepopForRecord.nativeElement.style.display = 'block';
  }
  openGaugeStatusModal() {
    this.addDepDiv.nativeElement.style.display = 'block';
    //this.addStatus = false;
  }
  openModalStandard() {
    this.addstdDiv.nativeElement.style.display = 'block';
    this.addStd = false;
  }
  openModalmnf() {
    this.addmnfDiv.nativeElement.style.display = 'block';
  }
  openModalLocation() {
    this.addLocDiv.nativeElement.style.display = 'block';
    //this.addStatus = false;
  }
  openModalOwner() {
    this.addOwnDiv.nativeElement.style.display = 'block';
    //this.addStatus = false;
  }
  openModalOwnerforUpdate() {
    this.addOwnDivupd.nativeElement.style.display = 'block';
    //this.addStatus = false;
  }
  OpenStandardModal() {
    this.AddstandardModal.nativeElement.style.display = 'block';
  }
  openModalLocationforAdd() {
    this.addLocDivUpd.nativeElement.style.display = 'block';
  }
  closeLocationAdd() {
    this.addLocDivUpd.nativeElement.style.display = 'none';
    this.addStatus = false;
  }
  delete() {
    this.deleteDoc.nativeElement.style.display = 'none';
  }
  deleteForGauge() {
    this.deletepopForRecord.nativeElement.style.display = 'none';
  }
  closeOwner() {
    this.addOwnDiv.nativeElement.style.display = 'none';
    this.addStatus = false;
  }
  closeStandardAdd() {
    this.AddstandardModal.nativeElement.style.display = 'none';
  }
  closeManufacturerModal() {
    this.mnfDivadd.nativeElement.style.display = 'none';
  }
  closeOwnerAdd() {
    this.addOwnDivupd.nativeElement.style.display = 'none';
    this.addStatus = false;
  }
  //Close manufacturer Modal
  closemnf() {
    this.addmnfDiv.nativeElement.style.display = 'none';
    this.addStatus = false;
  }
  //Close Location Modal
  closeLocaton() {
    this.addLocDiv.nativeElement.style.display = 'none';
    this.addStatus = false;
  }
  //To close Gauge Status Modal
  close() {
    this.addDepDiv.nativeElement.style.display = 'none';
    this.addStatus = false;
  }
  //To close the standard modal
  closeStandard() {
    this.addstdDiv.nativeElement.style.display = 'none';
    this.addStatus = false;
  }
  //Function to update and add the Gauge Status Field Value
  UpdateGaugeStatusField(val: string) {
    let data: any = {
      id: 0,
      name: val,
    };
    let url: string = '';
    if (this.editGaugeStatusCheck) url = ApiEndpointType.GaugeStatusUpdate;
    else url = ApiEndpointType.GaugeStatusUpdate;
    this.dataService
      .post(this.baseUrl + url, data)
      .then((x: any) => {
        if (x) {
          this.toastr.success('Record added successfully.');
          this.close();
          //get the gauge status data
          this.getGaugeStatusDataList();
        }
      })
      .catch((x: any) => {
        this.loader.stop();
        this.toastr.error(x.error, 'ERROR');
      });
    this.close();
  }
  //to add Manufacturer Field
  AddManufacturerField(val: string) {
    this.loader.start();
    let data: any = {
      id: 0,
      name: val,
    };
    this.dataService
      .post(this.baseUrl + ApiEndpointType.GaugemnfUpdate, data)
      .then((x: any) => {
        if (x) this.toastr.success('Record added successfully.');
        this.closeManufacturerModal();
        //get the gauge manufacturer data
        this.getGaugeManufacturerDataList();
        this.loader.stop();
      })
      .catch((x: any) => {
        this.loader.stop();
        this.toastr.error(x.error, 'ERROR');
      });
    this.closeManufacturerModal();
  }
  //Function to Add Gauge Owner Field
  UpdateOwnerField(val: string) {
    this.loader.start();
    let data: any = {
      id: 0,
      name: val,
    };
    data.id = 0;
    data.name = val;
    this.dataService
      .post(this.baseUrl + ApiEndpointType.GaugeOwnerUpdate, data)
      .then((x) => {
        if (x) this.toastr.success('Record added successfully.');
        this.loader.stop();
        this.closeOwnerAdd();
        //get the gauge owner data
        this.getGaugeOwnerDataList();
      })
      .catch((x: any) => {
        this.loader.stop();
        this.closeOwnerAdd();
        this.toastr.error(x.error, 'ERROR');
      });
  }
  //Function to add Gauge Standard Field
  AddGaugeStandardField(val: string) {
    this.loader.start();
    let data: any = {
      id: 0,
      name: '',
    };
    data.id = 0;
    data.name = val;
    this.dataService
      .post(this.baseUrl + ApiEndpointType.GaugeStandardUpdate, data)
      .then((x: any) => {
        if (x) this.toastr.success('Record added successfully.');
        this.closeStandardAdd();
        //get the gauge standard data
        this.getGaugeStandardDataList();
        this.loader.stop();
      })
      .catch((x: any) => {
        this.toastr.error(x.error, 'ERROR');
        this.loader.stop();
      });
    this.closeStandardAdd();
  }
  //Function to Add Gauge Location Field
  addLocationField(val: string) {
    this.loader.start();
    let data: any = {
      id: 0,
      name: val,
    };
    this.dataService
      .post(this.baseUrl + ApiEndpointType.GaugeLocationUpdate, data)
      .then((x: any) => {
        if (x) this.toastr.success('Record added successfully.');
        this.closeLocationAdd();
        //get the gauge location data
        this.loader.stop();
        this.getGaugeLocationDataList();
      })
      .catch((x: any) => {
        this.toastr.error(x.error, 'ERROR');
        this.closeLocationAdd();
        this.loader.stop();
      });
    this.closeLocationAdd();
  }
  lastRecordAdded: any;
  supplierBind: any = '';
  ownerBind: any = '';
  //to get the last record
  lastRecordOfGauge() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GaugeLastRecord)
      .then((x: any) => {
        if (x) {
          this.lastRecordAdded = x;
          this.GetAllDocuments();
          this.supplierBind = this.lastRecordAdded.supplierId;
          this.AddNewGauge.patchValue(this.lastRecordAdded);
          if (this.lastRecordAdded.retirementDate)
            this.AddNewGauge.get('retirementDate')?.patchValue(
              this.formatDate(new Date(this.lastRecordAdded.retirementDate))
            );
          if (this.lastRecordAdded.newDate)
            this.AddNewGauge.get('newDate')?.patchValue(
              this.formatDate(new Date(this.lastRecordAdded.newDate))
            );
          this.AddNewGauge.get('calibrationDueDate')?.patchValue(
            this.formatDate(
              new Date(
                new Date().setMonth(
                  new Date(
                    this.formatDate(
                      new Date(this.lastRecordAdded.calibrationDate)
                    )
                  ).getMonth() + this.lastRecordAdded.frequency
                )
              )
            )
          );
          this.RecordsReview.get('Inputdate')?.setValue(
            this.formatDate(new Date(this.lastRecordAdded.createdDate))
          );
          this.AddNewGauge.get('calibrationDate')?.patchValue(
            this.formatDate(new Date(this.lastRecordAdded.calibrationDate))
          );
          this.AddNewGauge.get('result')?.patchValue(
            this.lastRecordAdded.result == true ? '1' : '2'
          );
        } else {
          this.AddNewGauge.reset();
        }
        setTimeout(() => {
          this.onCreateGroupFormValueChange();
        }, 5000);
      })
      .catch((x) => { });
  }
  onMyexCoursesSelection() {
    this.myexCoursesActive === 'Active'
      ? (this.activateAfterData = false)
      : (this.activateAfterData = true);
    this.GetAllDocuments();
  }
  getDeleted(val: any) {
    this.deleteCompanyCourses(val, 'un-delete');
  }
  checkDuplicateId(val: string) {
    this.dataService
      .getAll(`${this.baseUrl + ApiEndpointType.CheckDuplicateGaugeId}/${val}`)
      .then((x: any) => {
        if (x && x.message) this.duplicateGaugeId = true;
        else this.duplicateGaugeId = false;
      })
      .catch((x) => { });
  }
  getGaugesCount() {
    this.dataService
      .getAll(`${this.baseUrl + ApiEndpointType.GaugeCount}/${this.status}`)
      .then((x: any) => {
        if (x) this.gaugesCount = x;
        this.count = x;
        if (x == 0) {
          this.lastRecordAdded = {};
        }
        if (this.gaugeIdByParam == '') this.getGaugesByArrow();
      })
      .catch((x) => { });
  }
  GaugeCountWithId() {
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.GaugeCountWithId}/${this.statusId}`
      )
      .then((x: any) => {
        if (x) this.gaugesCount = x;
        this.count = x;
        if (x == 0) {
          this.lastRecordAdded = {};
          this.gaugesCount = x;
        }
        if (this.gaugeIdByParam == '') this.getGaugesByArrow();
      })
      .catch((x) => {
        this.gaugesCount = 0;
        this.count = 0;
        this.lastRecordAdded = {};
      });
  }
  private formatDate(date: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  getList: any[] = [];
  getsearchList() {
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.GetArrayOfGauges}/${this.status}`
      )
      .then((x: any) => {
        if (x) this.getList = x;
        this.streets = this.getList;
        this.filteredStreets = this.control.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value))
        );
      })
      .catch((x) => { });
  }
  getArrayOfIds() {
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.GetArrayOfGaugesIds}/${this.status}`
      )
      .then((x: any) => {
        if (x) this.gaugeID = x;
        this.gaugeIds = this.AddNewGauge.controls.gaugeId.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterGauge(value))
        );
      })
      .catch((x) => { });
  }
  searchCheckDuplicate: boolean = false;
  search(val: string) {
    this.searchCheckDuplicate = true;
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.SearchGauge}/${val}/${this.statusId}`
      )
      .then((x: any) => {
        if (x) this.lastRecordAdded = x;
        this.AddNewGauge.patchValue(this.lastRecordAdded);
        if (this.lastRecordAdded.retirementDate)
          this.AddNewGauge.get('retirementDate')?.patchValue(
            this.formatDate(new Date(this.lastRecordAdded.retirementDate))
          );
        if (this.lastRecordAdded.newDate)
          this.AddNewGauge.get('newDate')?.patchValue(
            this.formatDate(new Date(this.lastRecordAdded.newDate))
          );
        this.RecordsReview.get('Inputdate')?.setValue(
          this.formatDate(new Date(this.lastRecordAdded.createdDate))
        );
        // this.AddNewGauge.get('calibrationDueDate')?.patchValue(
        //   this.formatDate(
        //     new Date(
        //       new Date().setMonth(
        //         new Date(
        //            new Date(this.lastRecordAdded.calibrationDate)
        //         ).getMonth() + this.lastRecordAdded.frequency
        //       )
        //     )
        //   )
        // );

        let dateTime: any = this.AddNewGauge.get('calibrationDueDate')?.value;
        let calibrationDueDate = new Date(
          new Date(this.lastRecordAdded.calibrationDate).setMonth(
            new Date(this.lastRecordAdded.calibrationDate).getMonth() +
            this.lastRecordAdded.frequency
          )
        );
        this.AddNewGauge.get('calibrationDueDate')?.patchValue(
          this.formatDate(calibrationDueDate)
        );
        this.AddNewGauge.get('calibrationDate')?.patchValue(
          this.formatDate(new Date(this.lastRecordAdded.calibrationDate))
        );
        this.AddNewGauge.get('result')?.patchValue(
          this.lastRecordAdded.result == true ? '1' : '2'
        );
      })
      .catch((x) => { });
  }
  generateNewId() {
    let id = Guid.create();
    this.initializeForm();
    this.lastRecordAdded = {};
    this.AddNewGauge.get('status')?.setValue(
      this.gaugeStatusList.find(
        (x) => x.name.trim() == 'Active' || x.name.trim() == 'active'
      ).id
    );
    this.getArrayOfIds();
    //  this.AddNewGauge.get('gaugeId')?.setValue(id);
    // this.toastr.success('New Gauge Id is created');
  }
  status: boolean = true;
  getStatus(event: any) {
    event.value == 'inactive' ? (this.status = false) : (this.status = true);
    this.getGaugesCount();
  }

  enableFormByPermissions() {
    if (this.AddNewGauge) {
      this.AddNewGauge.disable();
      if (this.userPermissions.calibrationPermissions.CanEditAllGauges) {
        this.AddNewGauge.enable();
      } else {
        if (this.selectedStatus?.name.toLowerCase() === 'out for calibration' && this.userPermissions.calibrationPermissions.CanEditOutForCalibrationGauges) {
          this.AddNewGauge.enable();
          this.AddNewGauge.controls.gaugeId.disable();
        }
      }
    }
  }

  getGaugesByArrow() {
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.GetGaugesByArrow}/${this.count}/${this.statusId
        }`
      )
      .then((x) => {
        if (x) {
          this.lastRecordAdded = x;
          this.GetAllDocuments();
          this.AddNewGauge.patchValue(this.lastRecordAdded);
          this.enableFormByPermissions();
          if (this.lastRecordAdded.retirementDate)
            this.AddNewGauge.get('retirementDate')?.patchValue(
              this.formatDate(new Date(this.lastRecordAdded.retirementDate))
            );
          this.RecordsReview.get('Inputdate')?.setValue(
            this.formatDate(new Date(this.lastRecordAdded.createdDate))
          );
          // this.AddNewGauge.get('calibrationDueDate')?.patchValue(
          //   this.formatDate(
          //     new Date(
          //       new Date().setMonth(
          //         new Date(
          //           this.formatDate(
          //             new Date(this.lastRecordAdded.calibrationDate)
          //           )
          //         ).getMonth() + this.lastRecordAdded.frequency
          //       )
          //     )
          //   )
          // );
          let calibrationDueDate = new Date(
            new Date(this.lastRecordAdded.calibrationDate).setMonth(
              new Date(this.lastRecordAdded.calibrationDate).getMonth() +
              this.lastRecordAdded.frequency
            )
          );
          if (this.lastRecordAdded.newDate)
            this.AddNewGauge.get('newDate')?.patchValue(
              this.formatDate(new Date(this.lastRecordAdded.newDate))
            );
          this.AddNewGauge.get('calibrationDueDate')?.patchValue(
            this.formatDate(new Date(calibrationDueDate))
          );
          this.AddNewGauge.get('calibrationDate')?.patchValue(
            this.formatDate(new Date(this.lastRecordAdded.calibrationDate))
          );
          this.AddNewGauge.get('result')?.patchValue(
            this.lastRecordAdded.result == true ? '1' : '2'
          );
        } else {
          this.AddNewGauge.reset();
        }
      })
      .catch((x) => { });
  }
  count: number = 0;
  showold() {
    if (this.count != 1) {
      this.count = this.count - 1;
      this.getGaugesByArrow();
    }
  }
  shownew() {
    if (this.gaugesCount > this.count) {
      this.count = this.count + 1;
      this.getGaugesByArrow();
    }
  }
  frequancyMonths(val: string) {
    if (val == '') {
      return;
    }
    let i: number = +val;
    if (this.AddNewGauge.controls.calibrationDate.value)
      this.AddNewGauge.get('calibrationDueDate')?.patchValue(
        this.formatDate(
          new Date(
            new Date(this.AddNewGauge.controls.calibrationDate.value).setMonth(
              new Date(
                this.AddNewGauge.controls.calibrationDate.value
              ).getMonth() + i
            )
          )
        )
      );
  }
  suppliers: any[] = [];
  GetSupplier() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetSupplier)
      .then((x: any) => {
        if (x) this.suppliers = x;
      })
      .catch((x) => { });
  }

  print() {
    this.printDiv.nativeElement.style.display = 'block'
    this.printerService.printOpenWindow = false;
    this.printerService.printDiv('printDiv');
    this.printDiv.nativeElement.style.display = 'none';
  }

  changesDescription: string = '';
  i = 0;
  onCreateGroupFormValueChange() {
    this.AddNewGauge.valueChanges
      .pipe(
        startWith(this.AddNewGauge.value),
        pairwise(),
        map(([oldValues, newValues]) => {
          return Object.keys(newValues).find(
            (k) => newValues[k] != oldValues[k]
          );
        })
      )
      .subscribe((key) => {
        if (this.lastRecordAdded) {
          let line = 'Gauge ';
          switch (key) {
            case 'gaugeId':
              this.changesDescription = this.changesDescription + line + ' ID,';
              break;
            case 'status':
              this.changesDescription =
                this.changesDescription + line + ' Status,';
              break;
            case 'description':
              this.changesDescription =
                this.changesDescription + line + ' Description,';
              break;
            case 'measureUnit':
              this.changesDescription =
                this.changesDescription + line + 'Unit Of Measure,';
              break;
            case 'modelNumber':
              this.changesDescription = this.changesDescription + line + ' ID,';
              break;
            case 'status':
              this.changesDescription =
                this.changesDescription + line + 'Status,';
              break;
            case 'certificateNumber':
              this.changesDescription =
                this.changesDescription + line + 'Certificate Number,';
              break;
            case 'ownerId':
              this.changesDescription =
                this.changesDescription + line + 'Owner ,';
              break;
            case 'serialNumber':
              this.changesDescription =
                this.changesDescription + line + 'Serial Number,';
              break;
            case 'standardId':
              this.changesDescription =
                this.changesDescription + line + 'Standard,';
              break;
            case 'manufacturerId':
              this.changesDescription =
                this.changesDescription + line + 'Manufacturer,';
              break;
            case 'result':
              this.changesDescription =
                this.changesDescription + line + 'Result,';
              break;
            case 'locationId':
              this.changesDescription =
                this.changesDescription + line + 'Location,';
              break;
            case 'calibrationDate':
              this.changesDescription =
                this.changesDescription + line + 'Calibration Date,';
              break;
            case 'frequency':
              this.changesDescription =
                this.changesDescription + line + 'Frequency,';
              break;
            case 'calibrationDueDate':
              this.changesDescription =
                this.changesDescription + line + 'Calibration Due Date,';
              break;
            case 'frequency':
              this.changesDescription =
                this.changesDescription + line + 'Frequency,';
              break;
            case 'notes':
              this.changesDescription =
                this.changesDescription + line + 'Notes,';
              break;
            case 'emails':
              if (this.i == 0) {
                this.changesDescription =
                  this.changesDescription +
                  line +
                  'Additional Emails for Notifications,';
              }
              ++this.i;
              break;
            case 'retirementDate':
              this.changesDescription =
                this.changesDescription + line + 'Retirement Date,';
              break;
            case 'newDate':
              this.changesDescription =
                this.changesDescription + line + 'New Date,';
              break;
            case 'supplierId':
              this.changesDescription =
                this.changesDescription + line + 'Supplier ,';
              break;
            default:
              break;
          }
        }
        this.AddNewGauge;
      });
  }
  openPanel(evt: any, trigger: MatAutocompleteTrigger): void {
    evt.stopPropagation();
    // this.myControl?.reset();
    trigger.openPanel();
    // this.inputAutoComplete?.nativeElement.focus();
  }
  @ViewChild('addSupplier') addSupplier!: ElementRef;
  openModaladdSupplier() {
    this.addSupplier.nativeElement.style.display = 'block';
  }
  closeaddSupplier() {
    this.addSupplier.nativeElement.style.display = 'none';
  }
  addSupplierCheck: boolean = false;
  addSupplierByText(val: string) {
    if (val == '') {
      this.addSupplierCheck = true;
      return;
    } else this.addSupplierCheck = false;
    let data: any = {
      id: 0,
      name: '',
    };
    data.id = this.supplierUpdateId;
    data.name = val;
    this.dataService
      .post(this.baseUrl + ApiEndpointType.AddUpdateGaugeSupplier, data)
      .then((x: any) => {
        this.toastr.success('Record Updated successfully.', 'SUCCESS');
        this.supplierUpdateId = 0;
        this.getSupplierListWithoutUser();
      })
      .catch((x: any) => {
        this.loader.stop();
        this.toastr.error(x.error, 'ERROR');
      });
    this.closeaddSupplier();
  }
  getSupplierListWithoutUserList: any;
  getSupplierListWithoutUser() {
    this.loader.start();
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetSupplierListWithoutUser)
      .then((x: any) => {
        if (x) this.getSupplierListWithoutUserList = x;
        this.loader.stop();
      })
      .catch((x: any) => {
        this.loader.stop();
        //   this.toastr.error(x.error, 'ERROR');
      });
  }
  editValueSupplier: any;
  supplierUpdateId: any = 0;
  editSupplier(val: any) {
    this.supplierUpdateId = val;
    this.editValueSupplier = this.getSupplierListWithoutUserList.find(
      (x: any) => x.id == val
    ).name;
    this.openModaladdSupplier();
  }
  deleteGaugeDocument(element: any) {
    if (confirm('Are you sure to delete this record?'))
      if (element) {
        this.DeleteDocumentsPermanantly(element);
      }
  }
  //this function is used to delete the documents 'delete'
  DeleteDocumentsPermanantly(val: any) {
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.DeleteDocumentsPermanantly}/${val}`
      )
      .then((x) => {
        if (x && !this.activateAfterData)
          this.toastr.success('Deleted successfully');
        else this.toastr.success('Record deleted successfully.');
        this.delete();
        this.GetAllDocuments();
      })
      .catch((x) => this.toastr.error('An error occurred'));
  }
  //This is used to load the Gauge Status DropDown list
  GetStatusReportSelectList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetGaugeStatusList)
      .then((x: any) => {
        this.statusList = x;
        this.statusId = this.statusList ? this.statusList[0].id : 1;
      });
  }

  get canAddDocument() {
    return (this.roleSupplier && this.selectedStatus?.name.toLowerCase() === 'out for calibration') || this.roleAdmin || this.roleCompanyAdmin;
  }

  get canEditDocument() {
    return (this.roleSupplier && this.selectedStatus?.name.toLowerCase() === 'out for calibration') || this.roleAdmin || this.roleCompanyAdmin;
  }

  get canSoftDelete() {
    return (this.roleSupplier && this.selectedStatus?.name.toLowerCase() === 'out for calibration') || this.roleAdmin || this.roleCompanyAdmin;
  }

  get canViewSoftDelete() {
    return (this.roleSupplier && this.selectedStatus?.name.toLowerCase() === 'out for calibration') || this.roleAdmin || this.roleCompanyAdmin;
  }

  get canPermanentlyDelete() {
    return this.roleAdmin || this.roleCompanyAdmin;
  }

  selectedValue: number = 0;
  selectedValueArray: number[] = [];
  statusId: number = 1;
  selectedStatus: {
    id: number,
    name: string
  } | undefined | null;

  changeWebsite(val: any) {
    if (val.value) {
      this.statusId = val.value;
      this.selectedStatus = this.statusList.find(x => x.id == val.value);
      this.GaugeCountWithId();
    }
  }
}
