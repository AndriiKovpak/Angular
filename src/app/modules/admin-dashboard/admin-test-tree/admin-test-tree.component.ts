import { skip } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';
import { Course } from './../../core/modal/admin-courses-add/Model/admin-course.model';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { CdkTreeNodeOutletContext, FlatTreeControl } from '@angular/cdk/tree';
import { Component, HostListener, ViewChild } from '@angular/core';
import {
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from '@angular/material/tree';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AdminTestsAddComponent } from '../../core/modal/admin-tests-add/admin-tests-add.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AdminTestQuestionsAddComponent } from '../../core/modal/admin-test-questions-add/admin-test-questions-add.component';
import { TestQuestionsAnswersModalComponent } from '../../core/modal/test-questions-answers-modal/test-questions-answers-modal.component';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { ExcelService } from '../../core/excel/excel.service';
/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  numberOfQuestion: any;
  isLastAnswer: any;
  isFirstAnswer: any;
  isAnswerCorrect: any;
  testQuestionAnsId: any;
  testQuestionId: any;
  testId: any;
  name: string;
  children?: FoodNode[];
  isLastQuestion:any;
}
const TREE_DATA: FoodNode[] = [];
/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  testId: number;
  testQuestionAnsId: number;
  testQuestionId: number;
  isAnswerCorrect: boolean;
  isLastAnswer: boolean;
  isFirstAnswer: boolean;
  numberOfQuestion: number;
  isLastQuestion:boolean
}
/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-admin-test-tree',
  templateUrl: './admin-test-tree.component.html',
  styleUrls: ['./admin-test-tree.component.scss'],
})
export class AdminTestTreeComponent {
  languagePreference: string = 'en';
  userInfo: any = {};
  @ViewChild('tree') tree: any;
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      testId: node.testId,
      testQuestionAnsId: node.testQuestionAnsId,
      testQuestionId: node.testQuestionId,
      isAnswerCorrect: node.isAnswerCorrect,
      isLastAnswer: node.isLastAnswer,
      isFirstAnswer: node.isFirstAnswer,
      numberOfQuestion: node.numberOfQuestion,
      isLastQuestion:node.isLastQuestion
    };
  };
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  // baseUrl: string = 'https://myex-api-myex-api-miltilingual.azurewebsites.net';
  baseUrl: string = environment.apiBase;
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasNoContent = (_: number, _nodeData: any) => _nodeData.item === '';
  constructor(
    public dataService: CrudService,
    private toaster: ToastrService,
    private dialog: MatDialog,
    private langService: LanguageService,
    private excelService: ExcelService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userDetails') ?? '');
    this.languagePreference = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
      ? this.userInfo?.languagePreference
      : 'en';
    this.getTreeData();
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  dataWithoutChange: any;
  dataWithChange: any[] = [];
  skip: number = 0;
  take: number = 10;
  originalData: any[] = [];
  dataWithStringfy: string = '';
  formatDataAccordingToTreeStringify: string = '';
  treeData: any[] = [];
  getTreeData() {
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.customCoursesTestForTree}/${
          this.skip
        }/${this.take}`
      )
      .then((x: any) => {
        this.dataWithoutChange = JSON.stringify(x);
        // if (this.originalData.length == 0) this.originalData = x;
        // else this.originalData.push(...x);
        this.originalData = x;
        this.dataWithStringfy = JSON.stringify(this.originalData);
        this.setDataForTree(this.originalData);
      })
      .catch((x) => {});
  }
  @HostListener('document:scroll', [])
  onScroll(): void {
    //  if ((window.innerWidth + window.scrollY) >= document.body.offsetWidth) {
    //   this.skip += 10;
    //   this.take = 10;
    //   this.getTreeData();
    //  }
    // to scroll to top
    // else if (
    //   window.innerHeight + window.scrollY <
    //   document.body.offsetHeight
    // ) {
    // }
  }
  list(data: any) {
    if (window.innerWidth >= document.body.offsetWidth) {
      this.skip = 0;
      this.take = data;
      this.getTreeData();
    }
  }
  giveDataForTree(val: any) {
    let data = JSON.parse(this.dataWithStringfy);
    data.forEach((element: any) => {
      element.name = this.langService.simplifyData(
        element.name,
        this.languagePreference
      );
      if (element.children && element.children.length > 0) {
      element.children[element.children.length - 1].isLastQuestion =true
      }
      //parent end
      // seconed  child starts
      if (element.children && element.children.length > 0) {
        element.children.forEach((child: any) => {
          child.name = this.langService.simplifyData(
            child.name,
            this.languagePreference
          );
          if (element.children && element.children.length > 0) {
            element.children[element.children.length - 1].isLastQuestion =true
            }
          // seconed  child ends
          // third  child starts
          if (child.children && child.children.length > 0)
            child.children.forEach((lastChild: any) => {
              lastChild.name = this.langService.simplifyData(
                lastChild.name,
                this.languagePreference
              );
              if (child.children && child.children.length > 0) {
                child.children[child.children.length - 1].isLastAnswer = true;
                child.children[0].isFirstAnswer = true;
              }

              // third  child ends
              if (lastChild.children && lastChild.children.length > 0) {
                lastChild.children.forEach((child: any) => {
                  lastChild.name = this.langService.simplifyData(
                    lastChild.name,
                    this.languagePreference
                  );
                });
              }
            });
        });
      }
    });

    this.dataSource.data = data;
    this.treeData = data;
    let childNodeToExpand: any;
    let lastChildToExpand: any;
    let nodeToExpand: any = this.treeControl.dataNodes.find(
      (x: any) => x.testId == this.testIdToExpand
    );
    if (this.testQuestionIdToExpand != 0)
      childNodeToExpand = this.treeControl.dataNodes.find(
        (x: any) => x.testQuestionId == this.testQuestionIdToExpand
      );
    if (this.testQuestionAnsId != 0)
      lastChildToExpand = this.treeControl.dataNodes.find(
        (x: any) => x.testQuestionAnsId == this.testQuestionAnsId
      );

    if (nodeToExpand) this.treeControl.expand(nodeToExpand);
    if (childNodeToExpand) this.treeControl.expand(childNodeToExpand);
    if (lastChildToExpand) this.treeControl.expand(lastChildToExpand);
    this.formatDataAccordingToTreeStringify = JSON.stringify(data);
  }
  setDataForTree(val: any) {
    this.giveDataForTree(val);
    // this.dataSource.data = []
  }
  thridAnswersCheck: boolean = false;
  nodeCheck(node: any) {
    if (node.level == 0) {
      this.deleteTestQuestionAns(node.testId);
    } else if (node.level == 1) {
      this.deleteTestQuestionAnsTestQuestions(node.testQuestionId);
    } else if (node.level == 2) {
      this.deleteTestQuestionAnswers(node.testQuestionAnsId);
    }
    // if (node && node.level)
    //   node.level == 2
    //     ? (this.thridAnswersCheck = true)
    //     : (this.thridAnswersCheck = false);
  }
  openModalForFirstLevel() {
    const dialogRef = this.dialog.open(AdminTestsAddComponent, {
      data: {
        testId: 0,
      },
    });
  }
  /** Select the category so we can insert the new item. */
  sendId: number = 0;
  addQuestion: boolean = false;
  addAnswer: boolean = false;
  testQuestionAnsId: number = 0;
  addingAnswer:boolean =false
  addNewItem(node: any) {

    if (node.level == 0) {
      this.openModalForFirstLevel();
    } else if (node.level == 1) {
      //this.openModalTestQuestions();
      this.addQuestion = true;
      this.testQuestionId = node.testQuestionId;
    } else if (node.level == 2) {
      this.addAnswer = true;
      this.addingAnswer = true
      this.testQuestionAnsId = 0;
      // this.openModalTestQuestionAnswers(node);
    }
  }
  deleteTestQuestionAns(val: any) {
    if (confirm('Are you sure to delete this record?')) {
      this.dataService
        .getAll(`${this.baseUrl + ApiEndpointType.DeleteTests}/${val}`)
        .then((x: any) => {
          if (x && x.message) this.toaster.success(x.message, 'SUCCESS');
          this.getTreeData();
          // this.GetTests();
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    }
  }
  AddopenModal(element: any) {
    const dialogRef = this.dialog.open(AdminTestsAddComponent, {
      data: {
        testId: element.testId,
      },
    });
    dialogRef.afterClosed().subscribe((x) => {
      // this.GetTests();
      // this.changeDetectorRefs.detectChanges()
      this.getTreeData();
    });
  }
  testId: number = 0;
  editedTestQuestionNumber: boolean = false;
  testQuestionId: number = 0;
  showAnswerText: boolean = false;
  editNode(node: any) {
    if (node.level == 0) {
      // const dialogRef = this.dialog.open(AdminTestsAddComponent, {
      //   data: {
      //     testId: node.testId,
      //   },
      // });
      // dialogRef.afterClosed().subscribe((x) => {
      //   // this.GetTests();
      //   // this.changeDetectorRefs.detectChanges()
      //   this.getTreeData();
      // });
      this.editedTestQuestionNumber = true;
      this.testId = node.testId;
    } else if (node.level == 1) {
      //   let pharseData:any=JSON.parse(this.dataWithoutChange);
      //   let getElement:any=pharseData .map((x: any) =>
      //   x.children.filter(
      //     (x: any) => x.testQuestionId == node.testQuestionId
      //   )
      // )[0]
      //   const dialogRef = this.dialog.open(AdminTestQuestionsAddComponent, {
      //     data: {
      //       element:getElement,
      //       testId: node.testId,
      //       question: node.name,
      //       testQuestionID: node.testQuestionId,
      //     },
      //   });
      //   dialogRef.afterClosed().subscribe((x) => {
      //     this.getTreeData();
      //     //this.GetTests();
      //     //this.changeDetectorRefs.detectChanges()
      //   });
      this.addQuestion = false;
      this.testQuestionId = node.testQuestionId;
    } else if (node.level == 2) {
      this.testQuestionAnsId = node.testQuestionAnsId;
      this.addAnswer = true;
    }
  }
  // test questions component
  openModalTestQuestions() {
    const dialogRef = this.dialog.open(AdminTestQuestionsAddComponent, {
      data: {
        testId: 0,
      },
    });
  }
  AddopenModalTestQuestions(element: any) {
    const dialogRef = this.dialog.open(AdminTestQuestionsAddComponent, {
      data: element,
    });
    dialogRef.afterClosed().subscribe((x) => {
      this.getTreeData();
      //this.GetTests();
      //this.changeDetectorRefs.detectChanges()
    });
  }
  deleteTestQuestionAnsTestQuestions(val: any) {
    if (confirm('Are you sure to delete this Question?')) {
      this.dataService
        .getAll(`${this.baseUrl + ApiEndpointType.DeleteTestQuestions}/${val}`)
        .then((x: any) => {
          if (x && x.message) this.toaster.success(x.message, 'SUCCESS');
          this.getTreeData();
          // this.GetTests();
        })
        .catch();
    }
  }
  // test question answers component
  openModalTestQuestionAnswers(node: any) {
    const dialogRef = this.dialog.open(TestQuestionsAnswersModalComponent, {
      data: {
        testId: node.testQuestionId,
      },
    });
    dialogRef.afterClosed().subscribe((x) => {
      this.getTreeData();
      // this.GetTests();
      // this.changeDetectorRefs.detectChanges();
    });
  }
  deleteTestQuestionAnswers(val: any) {
    if (confirm('Are you sure to delete this record?')) {
      this.dataService
        .getAll(
          `${this.baseUrl + ApiEndpointType.DeleteQuestionAnswers}/${val}`
        )
        .then((x: any) => {
          if (x && x.message) this.toaster.success(x.message, 'SUCCESS');
          this.getTreeData();
          // this.GetTests();
        })
        .catch();
    }
  }
  AddopenModalQuestionsAnswers(element: any) {
    const dialogRef = this.dialog.open(TestQuestionsAnswersModalComponent, {
      data: element,
    });
    dialogRef.afterClosed().subscribe((x) => {
      this.getTreeData();
      //this.GetTests();
    });
  }
  handleSelected($event: any, testQuestionAnswerID: any) {
    this.UpdateAnswerOfQuestion($event.target.checked, testQuestionAnswerID);
  }
  openModal() {
    const dialogRef = this.dialog.open(AdminTestsAddComponent,{data:'Notcustom'});
    dialogRef.afterClosed().subscribe((x) => {
      this.getTreeData();
      //this.GetTests();
    });
  }
  UpdateAnswerOfQuestion(isCorrect: boolean, Id: number) {
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.UpdateAnswer}/${isCorrect}/${Id}`
      )
      .then((x: any) => {
        if (x) {
          this.toaster.success(x.message, 'SUCCESS');
          this.getTreeData();
        }
      })
      .catch((x) => {
        if (x) {
          this.toaster.error(x.error, 'ERROR');
        }
      });
  }
  downloadPdfwithCheck(val: string) {
    this.tree.treeControl.expandAll();
    let data: any = document.getElementById('contentToConvert');
    this.excelService.downloadpdf(data, val);
    setTimeout(() => {
      this.tree.treeControl.collapseAll();
    }, 1000);
  }
  public filter(filterText: any) {
    if (!filterText.target.value) {
      this.dataSource.data = JSON.parse(
        this.formatDataAccordingToTreeStringify
      );
    } else
      this.dataSource.data = this.dataSource.data.filter(
        (x) =>
          x.name
            .toLocaleLowerCase()
            .indexOf(filterText.target.value.toLocaleLowerCase()) > -1
      );
  }
  UpdateTestName(val: any, node: any) {
    this.testId = 0;
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.UpdateTestQuestionsWithChange}/${
          node.testId
        }/${val}`
      )
      .then((x: any) => {
        if (x && x.message) {
          this.toaster.success(x.message, 'SUCCESS');
          this.getTreeData();
        }
      })
      .catch((x) => {});
  }
  closeTextBox() {
    this.testId = 0;
  }
  SaveQuestion(newQuestion: string, check: string, node: any) {
    if (newQuestion == '') {
      return;
    }
    // this.langService.addDataAccordingToLanguage()
    this.dataWithoutChange;
    let data = JSON.parse(this.dataWithoutChange).filter(
      (x: any) => x.testId == node.testId
    );
    let element: any = {};
    if (data) {
      element = data[0].children.find(
        (x: any) => x.testQuestionId == node.testQuestionId
      )?.name;
    }
    let newData = this.langService.addDataAccordingToLanguage(
      element,
      this.languagePreference,
      newQuestion
    );
    let sendData: any = {
      TestQuestionId: node.testQuestionId,
      Question: newData,
    };
    if (check != 'old') {
      let textLangArray: any[] = [
        { langcode: 'en', value: '' },
        { langcode: 'es', value: '' },
      ];

      let newData = this.langService.addDataAccordingToLanguage(
        textLangArray,
        this.languagePreference,
        newQuestion
      );
      sendData.TestQuestionId = 0;
      sendData.Question = newData;
      sendData.TestId = node.testId;
    }
    this.dataService
      .post(
        `${this.baseUrl + ApiEndpointType.UpdateTestQuestionsText}`,
        sendData
      )
      .then((x: any) => {
        if (x && x.message) {
          this.toaster.success(x.message, 'SUCCESS');
          this.getTreeData();
          this.addQuestion = false;
          this.testQuestionId = 0;
        }
      })
      .catch((x) => {});
  }
  SaveAnswer(answer: string, node: any) {
    this.addAnswer = false;
  }
  SaveAnswerForQuestion(answer: string, node: any, mode: string) {
    if (answer == '') {
      return;
    }
    this.addAnswer = false;

    let textLangArray: any[] = [
      { langcode: 'en', value: '' },
      { langcode: 'es', value: '' },
    ];

    let newData = this.langService.addDataAccordingToLanguage(
      textLangArray,
      this.languagePreference,
      answer
    );
    let data: any = {};
    if (mode == 'new')
      data = {
        TestQuestionId: node.testQuestionId,
        TestQuestionAnswerID: 0,
        Answer: newData,
      };
    else
      data = {
        TestQuestionId: node.testQuestionId,
        TestQuestionAnswerID: node.testQuestionAnsId,
        Answer: newData,
      };
    this.dataService
      .post(
        `${
          this.baseUrl + ApiEndpointType.UpdateTestQuestionsAnswersWithChange
        }`,
        data
      )
      .then((x: any) => {
        if (x && x.message) {
          this.toaster.success(x.message, 'SUCCESS');
          this.getTreeData();
          this.SaveAnswerTextBox = false;
          this.testQuestionAnsId = 0;
        }
      })
      .catch((x) => {});
  }
  SaveAnswerTextBox: boolean = false;
  AnswerBoxWithId: number = 0;
  AddAnswer(node: any) {
    this.toaster.info('Please add the answer for this Question.');
    this.SaveAnswerTextBox = true;
    this.AnswerBoxWithId = node.testQuestionId;
  }

  //variables used to expand the node of the tree
  testIdToExpand: number = 0;
  testQuestionIdToExpand: number = 0;
  testQuestionAnsIdToExpand: number = 0;

  //used to get the node of the tree that need to be expanded when the data refreshed
  getNODE(node: any) {
    if (node.level == 0) {
      this.testIdToExpand = node.testId;
    } else if (node.level == 1) {

      this.addingAnswer = false
      this.testQuestionIdToExpand = node.testQuestionId;
    } else if (node.level == 2) {
      this.testQuestionAnsIdToExpand = node.testQuestionAnsId;
    }
  }
  showBox(val: any): boolean {
    if (this.AnswerBoxWithId == val) return true;
    else return false;
  }
  removeTextBox() {
    this.testQuestionId = 0;
  }
  RemoveTextBox() {
    this.AnswerBoxWithId = 0;
    this.addAnswer = false;
    this.testQuestionId = 0;
  }
  checkNodeAnswer(node: any) {}
  showAnswerNode(level: any, testQuestionAnsId: any) {
    if (this.testQuestionAnsId == testQuestionAnsId && level == 2) {
      this.showDataForLastNode = false;
      return false;
    } else {
      return true;
    }
  }
  ExpandedNode(node: any) {}
  showDataForLastNode: boolean = false;
  showForLastNode(node: any) {
    if (node.testQuestionId != this.testQuestionId && node.level == 1) {
      this.showDataForLastNode = true;
    } else this.showDataForLastNode = false;
  }
  RemoveSaveAnswerTextBox() {
    this.AnswerBoxWithId = 0;
    this.SaveAnswerTextBox = false;
  }
}
