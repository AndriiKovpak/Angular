import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AdminTestsAddComponent } from '../../core/modal/admin-tests-add/admin-tests-add.component';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { testGrid } from './model/testGrid.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  //variables took for ag grid and took it as any because in the documentation
  // they did not provided the type
  gridApi: any;
  gridColumnApi: any;
  frameworkComponents: any;
  defaultColDef: any[] = [];
  rowData: any[] = [];

  usersColumns = [
    { field: 'NumberOfQuestions', sortable: true, filter: true, search: true },
    { field: 'Courses', sortable: true, filter: true },
    { field: 'edit', cellRenderer: 'buttonRenderer', resizable: true, sortable: true, minWidth: 175 }
  ];

  baseUrl: string = environment.apiBase
  adminUsersData: any;

  //for paging
  pageIndex: number = 1;
  pageSize: number = 10;
  count: number = 5;
  activePage: number = 0;

  constructor(public dataService: CrudService,
     public ngxLoader: NgxUiLoaderService,
     private dialog: MatDialog) {
    this.displayActivePage(1);

    // this.frameworkComponents = {
    //   buttonRenderer: CommonUpdateButtonComponent,
    //   // recordTypeFilter: RecordTypeFilterComponent
    // };
  }

  openModal()
  {
    const dialogRef =  this.dialog.open(AdminTestsAddComponent);
  }
  onGridReady(params: { api: any; columnApi: any; }) {

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  //get the list of admin users
  GetTests() {
    //this.ngxLoader.start();
    let paging: any =
    {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }

    this.dataService.post(this.baseUrl + ApiEndpointType.GetTests, paging).then(x => {

     // this.ngxLoader.stop();
      this.adminUsersData = x;

      if (this.adminUsersData) {
        this.count = Number(this.adminUsersData.count)
        this.rowData = [];
        this.adminUsersData.forEach((element: any) => {
          let data = new testGrid();

          data.Course = element.course;
          data.CourseID = element.courseID;
          data.IsDeleted = element.isDeleted;
          data.NumberOfQuestions = element.numberOfQuestions;
          data.PassingScore = element.passingScore;
          data.TestID = element.testId;
          this.rowData.push(data);
        });
      }
    })
  }

  displayActivePage(activePageNumber: number) {
    this.activePage = activePageNumber
    this.pageIndex = activePageNumber
    this.GetTests();
  }

}
