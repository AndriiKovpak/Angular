import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GridApi } from 'ag-grid-community';
import { AddNewEmployeeComponent } from 'src/app/modules/company-admin/add-new-employee/add-new-employee.component';
import { CrudService } from '../../genric-service/crudservice';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-add-courses-modal',
  templateUrl: './add-courses-modal.component.html',
  styleUrls: ['./add-courses-modal.component.scss'],
})
export class AddCoursesMOdalComponent implements OnInit, AfterViewInit {
  //angular mat table//
  displayedColumns: string[] = ['select', 'course'];
  dataSource: any;
  selection = new SelectionModel<any>(true, []);

  //angular mat table//

  //columns that need to show in the table
  columnDefs = [
    {
      field: 'course',
      sortable: true,
      filter: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      resizable: true,
      width: 400,
    },
    // { field: 'email' ,},
  ];

  //this variable is used to on the multiple selection of checkbox
  rowSelection = 'multiple';

  //to add the data after checking it
  selectedRows: any[] = [];

  //row data of ag-grid
  rowData: any[] = [];
  gridApi!: GridApi;
  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(
    private dialogRef: MatDialogRef<AddNewEmployeeComponent>,
    private dataService: CrudService,
    private noti: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  //whenever the component is loaded it will add data to the ag-grid data source
  ngOnInit(): void {
    // this.data.forEach((element: any) => {

    //   let firstName = element.firstName == null ? '' : element.firstName + ' ';
    //   let lastName = element.lastName == null ? '' : element.lastName;
    //   element["username"] = firstName + lastName;
    // }
    // );

    this.rowData = this.data.companyCourseModelList;
    this.dataSource = new MatTableDataSource(this.data.companyCourseModelList);;
  }

  //this function is used to close the modal
  onCancel(): void {
    this.dialogRef.close();
  }

  //this function is used to add the data to the admins this data will send to
  //report and setting component
  onSubmit(): void {
    if (this.selectedRows.length == 0) {
      this.noti.showError('No records is selected', 'ERROR');
      return;
    }
    this.dialogRef.close(this.selectedRows);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  displayType = SelectType.multiple;
  lastElementSelected: any;
  selectHandler(event: any, row: any) {
    this.selection.toggle(row);
    if (event.checked) {
      this.selectedRows.push(row);
    }
    else {
      if (this.lastElementSelected)
        if (this.lastElementSelected == row) this.selectedRows.pop();
    }
    if (event.checked) this.lastElementSelected = row;
  }

  checkAllRows(event: any) {
    if (event.checked) {
      this.dataSource.forEach((row: any) => {
        this.selection.toggle(row);
        this.selectedRows.push(row);
      });
    } else {
      this.selectedRows = [];
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

export enum SelectType {
  single,
  multiple,
}
