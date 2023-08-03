import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridApi } from 'ag-grid-community';
import { AddNewEmployeeComponent } from 'src/app/modules/company-admin/add-new-employee/add-new-employee.component';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../genric-service/crudservice';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-control-modal',
  templateUrl: './admin-control-modal.component.html',
  styleUrls: ['./admin-control-modal.component.scss']
})
export class AdminControlModalComponent implements OnInit {

  //columns that need to show in the table
  columnDefs = [
    { field: 'username', sortable: true, filter: true, checkboxSelection: true, headerCheckboxSelection: true },
    // { field: 'email' ,},
  ];

  //this variable is used to on the multiple selection of checkbox
  rowSelection = 'multiple'

  //to add the data after checking it
  selectedRows: any[] = []

  //row data of ag-grid
  rowData: any[] = [];
  gridApi!: GridApi;

  constructor(
    private dialogRef: MatDialogRef<AddNewEmployeeComponent>,
    private dataService: CrudService,
    private noti: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  //whenever the component is loaded it will add data to the ag-grid data source
  ngOnInit(): void {

    this.data.forEach((element: any) => {

      let firstName = element.firstName == null ? '' : element.firstName + ' ';
      let lastName = element.lastName == null ? '' : element.lastName;
      element["username"] = firstName + lastName;
    }
    );
    this.rowData = this.data
  }

  //this function is used to close the modal
  onCancel(): void {
    this.dialogRef.close();
  }

  //this function is used to add the data to the admins this data will send to
  //report and setting component
  onSubmit(): void {
    if (this.selectedRows.length == 0) {
      this.noti.showError('No records is selected', 'ERROR')
       return;
    }
    this.dialogRef.close(this.selectedRows[0]);
  }

  //this function is used to get the values after checking the check box
  onSelectionChanged(event: any) {
    if (event.api.getSelectedRows()) {
      this.selectedRows = []
      this.selectedRows.push(event.api.getSelectedRows())
    }
    else
      this.selectedRows = []

  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

}
