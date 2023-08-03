import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from 'ag-grid-community';

@Component({
  selector: 'app-record-type-filter',
  template: `
        <div class="container">
            Status Filter:
            <select (ngModelChange)="onChange($event)" [(ngModel)]="type" class="form-control">
              <option value="Select">Select</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Invited">Invited</option>
            </select>
        </div>
    `, styles: [
        `
            .container {
                border: 2px solid ;
                border-radius: 5px;
                /* background-color: #bbffbb; */
                width: 200px;
                height: 80px
            }

            select {
                height: 40px
            }
        `
    ]
})
export class RecordTypeFilterComponent implements OnInit ,IFilterAngularComp {
  private params!: IFilterParams;
  private valueGetter!: (rowNode: RowNode) => any;

  @ViewChild('select', {read: ViewContainerRef}) public select: any;
  type: any ='Select';
  text: any;

  agInit(params: IFilterParams): void {
      this.params = params;
      this.valueGetter = params.valueGetter;
  }

  constructor() { }

  ngOnInit(): void {
  }

  isFilterActive(): boolean {
    return this.type !== null && this.type !== undefined && this.type !== '';
}

doesFilterPass(params: IDoesFilterPassParams): boolean {
  return this.type.toLowerCase()
      .split(" ")
      .every((filterWord:any) => {
          return this.valueGetter(params.node).toString().toLowerCase().indexOf(filterWord) >= 0;
      });
}
getModel(): any {
  return {value: this.text};
}

setModel(model: any): void {
  this.type = model ? model.value : '';
}

ngAfterViewInit(params: IAfterGuiAttachedParams): void {
  setTimeout(() => {
      //this.select.element.nativeElement.focus();
  })
}
 // noinspection JSMethodCanBeStatic
 componentMethod(message: string): void {
  alert(`Alert from RecordTypeFilterComponent ${message}`);
}

onChange(newValue:any): void {

  if (this.type !== newValue) {
      this.type = newValue;
      if(this.type == 'Select')
      this.type =''
      this.params.filterChangedCallback();
  }
}

}
