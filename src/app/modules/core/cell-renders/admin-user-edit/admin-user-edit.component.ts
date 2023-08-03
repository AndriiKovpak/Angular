import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-admin-user-edit',
  template: `
  <span>

    <a  class="btn btn-warning "(click)="buttonClicked($event)">Edit</a>


  </span>
`,
  styleUrls: ['./admin-user-edit.component.scss']
})
export class AdminUserEditComponent implements AgRendererComponent {
  refresh(params: ICellRendererParams): boolean {
    throw new Error('Method not implemented.');
  }
  public cellValue!: string;

  // gets called once before the renderer is used
  agInit(params: any): void {

    this.cellValue = params.data
  }



  buttonClicked(event:any) {

    alert(`${this.cellValue} medals won!`);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}
