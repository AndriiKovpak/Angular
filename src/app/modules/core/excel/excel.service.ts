import {Injectable} from '@angular/core';
import html2canvas from 'html2canvas';

import jsPDF, { TextOptionsLight } from "jspdf";
import "jspdf-autotable";
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import autoTable, { UserOptions } from 'jspdf-autotable';
@Injectable({ providedIn: 'root' })
export class ExcelService {

    downloadFile(data: any, filename:string) {
        const replacer = (key:any, value:any) => value === null ? '' : value;
        const header = Object.keys(data[0]);
        let csv = data.map((row:any) => header.map(fieldName => JSON.stringify(row[fieldName],replacer)).join(','));
        csv.unshift(header.join(','));
        let csvArray = csv.join('\r\n');
        var blob = new Blob([csvArray], {type: 'text/csv' })
        fs.saveAs(blob, filename + ".csv");
    }

    downloadExcelFile(data: any, filename:string) {

      const replacer = (key:any, value:any) => value === null ? '' : value;
      const header = Object.keys(data[0]);
      let csv = data.map((row:any) => header.map(fieldName => JSON.stringify(row[fieldName],replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv;
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('ProductSheet');
      var columns: any = [];
      for (var i = 0; i < header.length; i++) {
        var obj = { header: header[i], key: header[i], width: 15};
        columns.push(obj);
      }
      worksheet.columns = columns;
      csv.forEach((e: any, index: any) => {
        if (index !== 0) {
          var indexData = e.split(',');
          worksheet.addRow({
          [columns[0]?.header]: indexData[0]?.replace(/["']/g, ""), [columns[1]?.header]: indexData[1]?.replace(/["']/g, ""),
          [columns[2]?.header]: indexData[2]?.replace(/["']/g, ""), [columns[3]?.header]: indexData[3]?.replace(/["']/g, ""),
          [columns[4]?.header]: indexData[4]?.replace(/["']/g, ""), [columns[5]?.header]: indexData[5]?.replace(/["']/g, ""),
          [columns[6]?.header]: indexData[6]?.replace(/["']/g, ""), [columns[7]?.header]: indexData[7]?.replace(/["']/g, ""),
          [columns[8]?.header]: indexData[8]?.replace(/["']/g, "")
          }, "n");
        }
      });

      workbook.xlsx.writeBuffer().then((csvArray: any) => {
        let blob = new Blob([csvArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, filename + '.xlsx');
      })
  }
  downloadPDF(tableId: string, startHeadingFrom: number, name: string, title: string) {
    // startHeadingFrom = 0
    const doc = new jsPDF();
    const table = document.getElementById(tableId) as HTMLTableElement;

    // Header
    const headerOptions: TextOptionsLight = {
      align: 'justify',
      maxWidth: 1200
    };
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(title, startHeadingFrom, 18, headerOptions );

    const tableOptions: UserOptions = {
      html: table,
      theme: "striped",
      tableWidth: 170,

      margin: {
        top: 25,
        right: 20,
        bottom: 20,
        left: 20
      },
      styles: {
        fontSize : 6 ,
        cellWidth: "auto",
        //overflow: "visible"
      }
    }

    autoTable(doc, tableOptions);
    doc.save(name+'.pdf');
  }
    downloadPdfFile(data: any, filename:string) {
        const replacer = (key:any, value:any) => value === null ? '' : value;
        const header = Object.keys(data[0]);
        let csv = data.map((row:any) => header.map(fieldName => JSON.stringify(row[fieldName],replacer)).join(','));
        csv.unshift(header.join(','));
        let csvArray = csv.join('\r\n');
        var blob = new Blob([csvArray], {type: 'application/pdf' })
        fs.saveAs(blob, filename + ".pdf");
    }
  downloadpdf(data:any,name:string){
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      // heightLeft -= pageHeight;
      let i:number=0
      for ( i=0;heightLeft >= 0;i++) {
        position = heightLeft - imgHeight;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.addPage();

        heightLeft -= pageHeight;
      }


      pdf.deletePage(i+1);
      pdf.save(name+'.pdf'); // Generated PDF
  });
  }
  convertToPdf(data:any,name:string) {
    //WORKING EXAMPLE IS HERE
    let html1 = document.querySelector('.printformClass');
    html2canvas(data).then(canvas => {

      var pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);

      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage(imgData, 0, 0, canvas.width, canvas.height);
      pdf.save(name+'.pdf');
  });
  }
}

