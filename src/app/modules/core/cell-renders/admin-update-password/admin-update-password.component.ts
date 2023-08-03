import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { UpdatePassowrdComponent } from '../../modal/update-passowrd/update-passowrd.component';

@Component({
  selector: 'app-admin-update-password',
  template: `
  <span>

    <a  class="btn btn-warning "(click)="buttonClicked($event)">Update password</a>

  </span>
`,
  styleUrls: ['./admin-update-password.component.scss']
})
export class AdminUpdatePasswordComponent implements AgRendererComponent {

  constructor(
    public matDialog: MatDialog,
    private dialog: MatDialog,){

    }
  refresh(params: ICellRendererParams): boolean {
    throw new Error('Method not implemented.');
  }
  public cellValue!: string;

  // gets called once before the renderer is used
  agInit(params: any): void {

    this.cellValue = params.data
  }



  buttonClicked(event:any) {
    this.matDialog.open(UpdatePassowrdComponent,
      {
        data:{
        userData: this.cellValue
        }
      })
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}
