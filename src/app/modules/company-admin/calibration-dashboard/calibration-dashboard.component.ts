import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, Pipe, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Label, SingleDataSet } from 'ng2-charts';
import {
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
} from 'ng2-charts';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ExcelService } from '../../core/excel/excel.service';
import { CrudService } from '../../core/genric-service/crudservice';
import { AuthService } from '../../core/guards/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-calibration-dashboard',
  templateUrl: './calibration-dashboard.component.html',
  styleUrls: ['./calibration-dashboard.component.scss'],
})
export class CalibrationDashboardComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  public pieChartOptions: any = {
    responsive: true,
    legend: {
      position: 'bottom',
      onClick: (event: any, legendItem: any) => {
        this.onclickLengend();
        this.status = legendItem.text.toString();
        this.isGaugeStatus = this.status;
        this.dataService
          .getAll(
            `${this.baseUrl + ApiEndpointType.GetGaugesListByStatus}/${this.status
            }`
          )
          .then((element: any) => {
            this.legendData = element;
            let dataList: any = {
              calibrationDate: '',
              gaugeId: '',
              serialNumber: '',
              gaugeStatus: '',
              description: '',
              updatedDate: '',
              gaugeLocation: '',
              manufacturer: '',
              location: '',
              supplier: '',
            };
            let objLegend: any[] = [];
            if (this.legendData) {
              this.legendData.forEach((element: any) => {
                dataList.calibrationDate = this.datepipe.transform(
                  element.calibrationDate,
                  'MM/dd/yyyy'
                );
                dataList.gaugeId = element.gaugeId;
                dataList.serialNumber = element.serialNumber;
                dataList.gaugeStatus = element.gaugeStatus.name;
                dataList.gaugeStatusId = element.gaugeStatus.id

                dataList.updatedDate = element.updatedDate;
                dataList.gaugeLocation = element.gaugeLocation?.name;
                dataList.manufacturer = element.gaugeManufacturer?.name;
                dataList.location = element.gaugeLocation?.name;
                dataList.description = element.description;
                dataList.supplier = element.gaugeSupplier?.name;
                objLegend.push(dataList);
                dataList = {};
              });
              this.dataSource = new MatTableDataSource(objLegend);
            }
          });
      },
      labels: {
        fontSize: 14,
        padding: 16,
      },
    },
  };
  onclickLengend() {
    this.graphs = true;
    this.tabs = false;
    this.calibrationCurrentCheck = false;
    this.gaugeOverDueCheck = false;
    this.subscriptionRenewalCheck = false;
    this.DueIn30DaysCheck = false;
    this.DueIn60DaysCheck = false;
    this.DueIn90DaysCheck = false;
  }
  Historyrange = new FormGroup({
    Historystart: new FormControl(),
    Historyend: new FormControl(),
  });
  legendData: any;
  selectedLegend: any;
  status: any;
  isGaugeStatus: any = '';
  graphs: boolean = false;
  tabs: boolean = true;
  public pieChartType: any = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  data: any;
  baseUrl: string = environment.apiBase;
  selectedRow!: Number;
  gaugeData: any;
  GaugeID: any;
  updateDate: any;
  calibrationDate: any;
  StatusOfGauge: any;
  maxDate = new Date();
  public chartColors: any[] = [
    {
      backgroundColor: [
        '#8ac720',
        '#3e5569',
        '#ff0000',
        '#4B0082',
        '#ff9f40',
        '#9400D3',
        '#d93b3d',
        '#0c5ec7',
        '#ec451a',
        '#5796ea',
      ],
    },
  ];
  pageIndex: number = 1;
  pageSize: number = 10;
  count: number = 5;
  activePage: number = 0;
  length: number = 2;
  paginationArray: number[] = [5];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('GaugeDetails') GaugeDetails!: ElementRef;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('reportTitle', { static: false }) reportTitle!: ElementRef;
  constructor(
    public dataService: CrudService,
    private excelService: ExcelService,
    public datepipe: DatePipe,
    private authService: AuthService,
    private router: Router,
    private toaster: ToastrService,
    public translate: TranslateService,
    public translationService: TranslationService
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  dataSource: any = new MatTableDataSource();
  columnsToDisplay = [
    'calibrationDate',
    'gaugeId',
    'serialNumber',
    'gaugeStatus',
    'description',
    'updatedDate',
    'location',
    'manufacturer',
    'supplier',
  ];
  obj: any = {
    calibrationDate: '',
    gaugeId: '',
    serialNumber: '',
    gaugeStatus: '',
    updatedDate: '',
  };
  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  handleDateChange(filterValue: any) {
    this.dataSource.filter = filterValue;
  }
  statusList: any[] = [];
  GetStatusReportSelectList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetGaugeStatusList)
      .then((x: any) => {
        this.statusList = [];
        this.statusList = x;
      });
  }
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  setDataForPie() {
    if (this.gaugeData) {
      this.statusList.forEach((element) => {
        if (
          this.gaugeData.filter(
            (x: any) =>
              x.gaugeStatus.name.trim().toLowerCase() ==
              element.name.trim().toLowerCase()
          )
        ) {
          this.pieChartLabels.push([element.name]);
          this.pieChartData.push(
            this.gaugeData.filter((x: any) => x.gaugeStatus.id == element.id)
              .length
          );
        }
      });
    }
  }
  filterData: any[] = [];
  getGetInfoGaugeRecords() {
    this.dataService
      .getAll(`${this.baseUrl + ApiEndpointType.GaugeRecordsInfo}`)
      .then((x: any) => {
        this.gaugeData = x;
        let data: any = {
          calibrationDate: '',
          gaugeId: '',
          serialNumber: '',
          gaugeStatus: '',
          description: '',
          updatedDate: '',
          gaugeLocation: '',
          manufacturer: '',
          location: '',
          supplier: '',
        };
        let obj: any[] = [];
        if (this.gaugeData) {
          this.setDataForPie();
        }
      })
      .catch();
  }
  userInfo: any;
  roleSupplier: boolean = false;
  roleRead: boolean = false;
  roleAdmin: boolean = false;
  ngOnInit(): void {
    this.switchLanguage();
    this.updateUserInfo();
  }

  switchLanguage() {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
    });
  }
  updateUserInfo() {
    this.dataService
      .getAll(this.baseUrl + '/api/Authorize/user')
      .then((res: any) => {
        localStorage.removeItem('userDetails');
        localStorage.setItem('userDetails', JSON.stringify(res));
        this.userInfo = this.authService.getUserInformation();
        this.auth();
        this.GetStatusReportSelectList();
        this.getGetInfoGaugeRecords();
        this.GetCompanyOverDueGauge();
        this.calibrationCurrentData();
      });
  }
  auth() {
    if (this.userInfo?.role) {
      let roleArray = (this.userInfo.role as string).split(',').map(e => e.toLowerCase());
      this.roleSupplier = roleArray.includes('supplier');
      this.roleRead = roleArray.includes('read');
      this.roleAdmin = roleArray.includes('companyadmin');
    }
    if (this.roleSupplier && !this.roleRead && this.roleAdmin) {
      this.router.navigate(['/companyadmin/gauge-records']);
    }
  }
  openModal(val: any) {
    this.GaugeDetails.nativeElement.style.display = 'block';
    this.GaugeID = val.gaugeId;
    this.updateDate = val.updatedDate;
    this.calibrationDate = val.calibrationDate;
    this.StatusOfGauge = val.gaugeStatus;
  }
  CloseModal() {
    this.GaugeDetails.nativeElement.style.display = 'none';
  }
  addEvent(filterValue: any, event: any) {
    if (event.value != undefined) {
      filterValue = this.datepipe.transform(filterValue, 'MM/dd/yyyy');
    }
    this.dataSource.filter = filterValue.trim();
  }
  gaugesOverDueData: any = {};
  GetCompanyOverDueGauge() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetCompanyOverDueGauge)
      .then((x) => {
        this.gaugesOverDueData = x;
      })
      .catch((x) => { });
  }
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  getGetInfoGaugeRecordsWithDate(event: any) {

    let period: any = {
      startDate: new Date(),
      endDate: new Date(),
    };
    if (
      this.Historyrange.controls.Historyend.value &&
      this.Historyrange.controls.Historystart.value
    ) {
      period.startDate = this.Historyrange.controls.Historystart.value;
      period.enddate = this.Historyrange.controls.Historyend.value;
      this.dataService
        .post(
          `${this.baseUrl + ApiEndpointType.GetCompanyGaugeWithFilter}`,
          period
        )
        .then((x: any) => {

          if (x) this.gauges = x;
          this.gaugeData = x;
          let data: any = {
            calibrationDate: '',
            gaugeId: '',
            serialNumber: '',
            gaugeStatus: '',
            description: '',
            updatedDate: '',
            gaugeLocation: '',
            manufacturer: '',
            location: '',
            supplier: '',
          };
          let obj: any[] = [];
          if (this.gaugeData) {
            this.gaugeData.forEach((element: any) => {
              data.calibrationDate = this.datepipe.transform(
                element.calibrationDate,
                'MM/dd/yyyy'
              );
              data.gaugeId = element.gaugeId;
              data.serialNumber = element.serialNumber;
              data.gaugeStatus = element.gaugeStatus?.name;
              data.updatedDate = element.updatedDate;
              data.gaugeLocation = element.gaugeLocation?.name;
              data.manufacturer = element.gaugeManufacturer?.name;
              data.location = element.gaugeLocation?.name;
              data.description = element.description;
              data.supplier = element.gaugeSupplier?.name;
              obj.push(data);
              data = {};
            });
            this.filterData = [];
            this.filterData = obj;
            this.dataSource = new MatTableDataSource<any>(obj);
          } else {
          }
        })
        .catch();
    }
  }
  openPanel(evt: any, trigger: any): void {
    evt.stopPropagation();
    trigger.openPanel();
  }
  gauges: any;
  calibrationCurrentData() {

    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetGaugesList)
      .then((x: any) => {
        if (x) this.gauges = x;
        this.gaugeData = x.calibrationCurrent;
        let data: any = {
          calibrationDate: '',
          gaugeId: '',
          serialNumber: '',
          gaugeStatus: '',
          description: '',
          updatedDate: '',
          gaugeLocation: '',
          manufacturer: '',
          location: '',
          supplier: '',
        };
        let obj: any[] = [];
        if (this.gaugeData) {
          this.gaugeData.forEach((element: any) => {
            data.calibrationDate = this.datepipe.transform(
              element.calibrationDate,
              'MM/dd/yyyy'
            );
            data.gaugeId = element.gaugeId;
            data.serialNumber = element.serialNumber;
            data.gaugeStatus = element.gaugeStatus.name;
            data.gaugeStatusId = element.gaugeStatus.id
            data.updatedDate = element.updatedDate;
            data.gaugeLocation = element.gaugeLocation?.name;
            data.manufacturer = element.gaugeManufacturer?.name;
            data.location = element.gaugeLocation?.name;
            data.description = element.description;
            data.supplier = element.gaugeSupplier?.name;
            obj.push(data);
            data = {};
          });
          this.filterData = [];
          this.filterData = obj;
          this.dataSource = new MatTableDataSource(obj);
          this.table.renderRows();
        }
      })
      .catch((x) => { });
  }
  calibrationCurrentCheck: boolean = true;
  gaugeOverDueCheck: boolean = false;
  subscriptionRenewalCheck: boolean = false;
  DueIn30DaysCheck: boolean = false;
  DueIn60DaysCheck: boolean = false;
  DueIn90DaysCheck: boolean = false;
  getDataOfTab(val: string) {
    this.graphs = false;
    this.tabs = true;
    switch (val) {
      case 'calibrationCurrent':
        this.calibrationCurrentCheck = true;
        this.gaugeOverDueCheck = false;
        this.subscriptionRenewalCheck = false;
        this.DueIn30DaysCheck = false;
        this.DueIn60DaysCheck = false;
        this.DueIn90DaysCheck = false;
        this.changeTableData(this.gauges.calibrationCurrent);
        break;
      case 'gaugeOverDue':
        this.calibrationCurrentCheck = false;
        this.gaugeOverDueCheck = true;
        this.subscriptionRenewalCheck = false;
        this.DueIn30DaysCheck = false;
        this.DueIn60DaysCheck = false;
        this.DueIn90DaysCheck = false;
        this.changeTableData(this.gauges.gaugesOverDue);
        break;
      case 'dueIn30Days':
        this.calibrationCurrentCheck = false;
        this.gaugeOverDueCheck = false;
        this.subscriptionRenewalCheck = false;
        this.DueIn30DaysCheck = true;
        this.DueIn60DaysCheck = false;
        this.DueIn90DaysCheck = false;
        this.changeTableData(this.gauges.dueIn30Days);
        break;
      case 'dueIn60Days':
        this.calibrationCurrentCheck = false;
        this.gaugeOverDueCheck = false;
        this.subscriptionRenewalCheck = false;
        this.DueIn30DaysCheck = false;
        this.DueIn60DaysCheck = true;
        this.DueIn90DaysCheck = false;
        this.changeTableData(this.gauges.dueIn60Days);
        break;
      case 'dueIn90Days':
        this.calibrationCurrentCheck = false;
        this.gaugeOverDueCheck = false;
        this.subscriptionRenewalCheck = false;
        this.DueIn30DaysCheck = false;
        this.DueIn60DaysCheck = false;
        this.DueIn90DaysCheck = true;
        this.changeTableData(this.gauges.dueIn90Days);
        break;
      default:
        break;
    }
  }
  downloadPdf() {
    // if (this.roleRead) {
    //   this.toaster.info('You do not have access to download');
    //   return;
    // }
    if (this.calibrationCurrentCheck) {
      if (this.gauges.calibrationCurrent?.length > 0)
        this.excelService.downloadExcelFile(
          this.createData(this.gauges.calibrationCurrent),
          'Calibration Current'
        );
      else if (this.gauges?.length > 0)
        this.excelService.downloadExcelFile(
          this.createData(this.gauges),
          'Calibration Current'
        );
      else this.toaster.info('No data to download.');
    } else if (this.gaugeOverDueCheck) {
      if (this.gauges.gaugesOverDue.length > 0)
        this.excelService.downloadExcelFile(
          this.createData(this.gauges.gaugesOverDue),
          'Gauges OverDue'
        );
      else this.toaster.info('No data to download.');
    } else if (this.DueIn30DaysCheck) {
      if (this.gauges.dueIn30Days.length > 0)
        this.excelService.downloadExcelFile(
          this.createData(this.gauges.dueIn30Days),
          'Due In 30 Days'
        );
      else this.toaster.info('No data to download.');
    } else if (this.DueIn60DaysCheck) {
      if (this.gauges.dueIn60Days.length > 0)
        this.excelService.downloadExcelFile(
          this.createData(this.gauges.dueIn60Days),
          'Due In 60 Days'
        );
      else this.toaster.info('No data to download.');
    } else if (this.DueIn90DaysCheck) {
      if (this.gauges.dueIn90Days.length > 0)
        this.excelService.downloadExcelFile(
          this.createData(this.gauges.dueIn90Days),
          'Due In 90 Days'
        );
      else this.toaster.info('No data to download.');
    } else if (this.isGaugeStatus != '') {
      this.excelService.downloadExcelFile(
        this.createData(this.dataSource.data),
        this.isGaugeStatus
      );
    }
  }
  changeTableData(value: any) {
    this.gaugeData = value;
    let data: any = {
      calibrationDate: '',
      gaugeId: '',
      serialNumber: '',
      gaugeStatus: '',
      description: '',
      updatedDate: '',
      gaugeLocation: '',
      manufacturer: '',
      location: '',
      supplier: '',
    };
    let obj: any[] = [];
    if (this.gaugeData) {
      this.gaugeData.forEach((element: any) => {
        data.calibrationDate = this.datepipe.transform(
          element.calibrationDate,
          'MM/dd/yyyy'
        );
        data.gaugeId = element.gaugeId;
        data.serialNumber = element.serialNumber;
        data.gaugeStatus = element.gaugeStatus.name;
        data.gaugeStatusId = element.gaugeStatus.id

        data.updatedDate = element.updatedDate;
        data.gaugeLocation = element.gaugeLocation?.name;
        data.manufacturer = element.gaugeManufacturer?.name;
        data.location = element.gaugeLocation?.name;
        data.description = element.description;
        data.supplier = element.gaugeSupplier?.name;
        obj.push(data);
        data = {};
      });
      this.filterData = [];
      this.filterData = obj;
      this.dataSource = new MatTableDataSource(obj);
      this.table.renderRows();
    }
  }
  public convetToPDF(tableId: string) {
    const title = this.reportTitle.nativeElement.innerText;
    // if (this.roleRead) {
    //   this.toaster.info('You do not have access to download');
    //   return;
    // }
    if (this.calibrationCurrentCheck) {
      if (this.gauges.calibrationCurrent?.length > 0)
        this.downloadPdfwithCheck(tableId, 'Calibration Current', title);
      else if (this.gauges.length > 0)
        this.downloadPdfwithCheck(tableId, 'Calibration Current', title);
      else this.toaster.info('No data to download.');
    } else if (this.gaugeOverDueCheck) {
      if (this.gauges.gaugesOverDue.length > 0)
        this.downloadPdfwithCheck(tableId, 'Gauges OverDue', title);
      else this.toaster.info('No data to download.');
    } else if (this.DueIn30DaysCheck) {
      if (this.gauges.dueIn30Days.length > 0)
        this.downloadPdfwithCheck(tableId, 'Due In 30 Days', title);
      else this.toaster.info('No data to download.');
    } else if (this.DueIn60DaysCheck) {
      if (this.gauges.dueIn60Days.length > 0)
        this.downloadPdfwithCheck(tableId, 'Due In 60 Days', title);
      else this.toaster.info('No data to download.');
    } else if (this.DueIn90DaysCheck) {
      if (this.gauges.dueIn90Days.length > 0)
        this.downloadPdfwithCheck(tableId, 'Due In 90 Days', title);
      else this.toaster.info('No data to download.');
    } else if (this.isGaugeStatus != '') {
      this.downloadPdfwithCheck(tableId, this.isGaugeStatus, title);
    }
  }
  downloadPdfwithCheck(tableId: string, val: string, title: string) {
    // let data: any = document.getElementById('contentToConvert');
    // this.excelService.downloadpdf(data, val);
    this.excelService.downloadPDF(tableId, 70, val, title);
  }
  createData(val: any): any {
    let data: any = {
      Due_Date: '',
      Gauge_ID: '',
      S_N: '',
      Status: '',
      Description: '',
      Last_Calibrated: '',
      Gauge_Location: '',
      Manufacturer: '',
      Supplier: '',
    };
    let obj: any[] = [];
    if (val) {
      val.forEach((element: any) => {
        data.Due_Date = this.datepipe.transform(
          this.setDueDate(element.calibrationDate, element.gaugeId),
          'MM/dd/yyyy'
        );
        data.Gauge_ID = element.gaugeId;
        data.S_N = element.serialNumber;
        data.Status = element.gaugeStatus.name;
        data.Last_Calibrated = this.datepipe.transform(
          element.calibrationDate,
          'MM/dd/yyyy'
        );
        data.Gauge_Location = element.gaugeLocation?.name;
        data.Manufacturer = element.gaugeManufacturer?.name;
        data.Description = element.description;
        data.Supplier = element.gaugeSupplier?.name;
        obj.push(data);
        data = {};
      });
      return obj;
    }
  }
  setDueDate(calibration: any, guageId: any) {

    return this.formatDate(new Date(calibration).setMonth(
      new Date(calibration).getMonth() +
      (!this.graphs
        ? this.gaugeData.find((x: any) => x.gaugeId == guageId).frequency
        : this.legendData.find((x: any) => x.gaugeId == guageId)
          .frequency)
    )
    );

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
}
