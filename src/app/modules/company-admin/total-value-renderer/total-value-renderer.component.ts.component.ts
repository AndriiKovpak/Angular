import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';



@Component({
  selector: 'total-value-component',
  template: `
    <span>

      <a  class="btn btn-warning ">View</a>

    </span>
  `,
})
export class TotalValueRenderer implements AgRendererComponent {
  refresh(params: ICellRendererParams): boolean {
    throw new Error('Method not implemented.');
  }
  public cellValue!: string;

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }



  buttonClicked() {
    alert(`${this.cellValue} medals won!`);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}