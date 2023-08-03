import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ExcelService } from '../../core/excel/excel.service';
import { CrudService } from '../../core/genric-service/crudservice';
import { AdminTestQuestionsAddComponent } from '../../core/modal/admin-test-questions-add/admin-test-questions-add.component';
import { ApiEndpointType } from '../../shared/enums/api.routes';
@Component({
  selector: 'app-test-questions',
  templateUrl: './test-questions.component.html',
  styleUrls: ['./test-questions.component.scss'],
})
export class TestQuestionsComponent implements OnInit,AfterViewInit {
  //for paging
  pageIndex: number = 1;
  pageSize: number = 10;
  count: number = 5;
  activePage: number = 0;
  length: number = 2;

  activeInactiveList: any[] = [];
  isActive: boolean = true;

  //dataSource = new MatTableDataSource();
  baseUrl: string = environment.apiBase;
  adminUsersData: any;
  statusList: any;
  paginationArray: number[] = [5];
  rowData!: any;
  dataSource = new MatTableDataSource();

  constructor(
    public dataService: CrudService,
    public ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private toaster: ToastrService,
    private changeDetectorRefs: ChangeDetectorRef

  ) {}
  ngOnInit(): void {
    // this.GetAllUsers();
    // this.getCompaniesGridData();
    this.GetTests();
  }

  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  answer: string = '';
  question: string = '';
  // (blur)="onBlurMethod('City')"
  onBlurMethod(val: string, value: string) {
    switch (val) {
      case 'course':
        this.answer = value;
        this.GetTests();
        break;
      case 'question':
        this.question = value;
        this.GetTests();
        break;

      default:
        break;
    }
  }

  public getServerData(event: PageEvent) {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.pageIndex == 0) this.pageIndex = 1;
    this.GetTests();
  }

  //get the list of admin users
  GetTests() {

    //this.ngxLoader.start();
    let paging: any = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      Answer: this.answer,
      Questions: this.question,
    };

    this.dataService
      .post(this.baseUrl + ApiEndpointType.GetTestsQuestions, paging)
      .then((x: any) => {

        // this.ngxLoader.stop();
        this.adminUsersData = x;
        if (this.adminUsersData.length > 0) {
          this.count = Number(this.adminUsersData[0].countList);
          this.rowData = [];
          this.adminUsersData.forEach((element: any) => {
            let data: any = {
              course: '',
              isDeleted: false,
              question: '',
              test: '',
              testID: 0,
              testQuestionId: 0,
            };

            data.course = element.course;
            data.isDeleted = element.isDeleted;
            data.question = element.question;
            data.testID = element.testID;
            data.test = element.test;
            data.testQuestionId = element.testQuestionID;
            this.rowData.push(data);
            if (this.count <= 10) this.paginationArray = [10];
            else if (this.count <= 25) this.paginationArray = [10, 25];
            else if (this.count <= 50) this.paginationArray = [10, 25, 50];
            else if (this.count <= 100)
              this.paginationArray = [10, 25, 50, 100];
            else if (this.count > 100)
              this.paginationArray = [10, 25, 50, 100, this.count];
          });

          this.length = this.count;
          this.dataSource.data = [];
          this.dataSource.data = this.rowData;
          //  this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource.data = [];
        }
      });
  }
  displayTestColumns: string[] = ['question', 'course', 'edit'];
  openModal() {
    const dialogRef = this.dialog.open(AdminTestQuestionsAddComponent);
  }
  AddopenModal(element: any) {
    const dialogRef = this.dialog.open(AdminTestQuestionsAddComponent, {
      data: element,
    });
    dialogRef.afterClosed().subscribe((x) => {
      this.GetTests();
      this.changeDetectorRefs.detectChanges()
    });
  }
  deleteTestQuestionAns(val: any) {

    if (confirm('Are you sure to delete this record?')) {
      this.dataService
        .getAll(
          `${this.baseUrl + ApiEndpointType.DeleteTestQuestions}/${
            val.testQuestionId
          }`
        )
        .then((x: any) => {
          if (x && x.message) this.toaster.success(x.message, 'SUCCESS');

          this.GetTests();
        })
        .catch();
    }
  }
}
