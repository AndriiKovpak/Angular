import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ITestQuestionDto} from "../../../models/ITestQuestionDto";
import {LanguageService} from "../../../_helpers/languge-filter.service";
import {Observable} from "rxjs";
import {ITextLang} from "../../../models/ITextLang";
import {TestService} from "../../../services/test.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {EditableTestQuestionAnswerComponent} from "../editable-test-question-answer/editable-test-question-answer.component";
import {MatExpansionPanel} from "@angular/material/expansion";
import {ITestQuestionAnswerDto} from "../../../models/ITestQuestionAnswerDto";

@Component({
  selector: 'app-editable-test-question',
  templateUrl: './editable-test-question.component.html',
  styleUrls: ['./editable-test-question.component.scss']
})
export class EditableTestQuestionComponent implements OnInit {

  @Input() questionDto?: ITestQuestionDto;
  @Input() language?: string;
  @Output() questionDeleted = new EventEmitter<number>();
  panelOpenState = false;
  editMode = false;
  disabled = false;
  addingAnswer = false;
  @ViewChild('questionInput') questionInput!: ElementRef<HTMLInputElement>;
  @ViewChild('expansionPanel') expansionPanel!: MatExpansionPanel;
  @ViewChildren('editableAnswer') answers!: QueryList<EditableTestQuestionAnswerComponent>;

  constructor(
    public languageService: LanguageService,
    private testService: TestService,
    private toastr: ToastrService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
  }

  toggleEditMode(event: MouseEvent | null) {
    event?.stopPropagation();
    this.editMode = !this.editMode;
    const self = this;
    setTimeout(() => {
      self.questionInput.nativeElement.focus();
    })
  }

  keyUp(event: KeyboardEvent) {
    event.stopPropagation();
    if (event.key.toLowerCase() === 'enter') {
      this.stopEdit();
    }
  }

  stopEdit() {
    if (this.editMode) {
      this.editMode = false;
      const activeQuestionText= this.questionText;

      // initialize unpopulated language options (those that are '' or null) with the text from current
      const blankQuestionText = this.questionDto!.question!.filter(x => (x.value === '' || x.value === null) && x.langcode !== activeQuestionText.langcode);
      blankQuestionText.forEach(x => x.value = activeQuestionText.value);
      this.testService.updateTestQuestionText(this.questionDto!.testQuestionId!, this.questionDto!.question)
        .subscribe(() => {
          this.toastr.success('Updated test question text');
        }, () => {
          this.toastr.error('Could not update test question text');
        })
    }

  }

  deleteQuestion(){
    if (confirm('Are you sure to delete this record?')) {
      this.disabled = true;
      this.testService
        .deleteTestQuestion(this.questionDto!.testQuestionId!)
        .subscribe((x: any) => {
            this.toastr.success(this.translateService.instant('QuestionDeletedSuccess'));
            this.questionDeleted.emit(this.questionDto!.testQuestionId!);
        },
        (x) => {
          this.toastr.error(this.translateService.instant('QuestionDeletedFailed'));
          this.disabled = false;
        });
    }
  }

  get questionText() {
    return this.languageService.getItemForSelectedLanguage(this.questionDto!.question, this.language ?? "en");
  }

  get sortedAnswers(): ITestQuestionAnswerDto[] {
    return this.questionDto?.answers
        .sort((a, b) =>
          a.testQuestionAnswerId! - b.testQuestionAnswerId!)
      ?? [];
  }

  addAnswer(event: MouseEvent) {
    event.stopPropagation();
    if (!this.expansionPanel.expanded){
      this.expansionPanel.open();
    }
    this.addingAnswer = true;
    this.testService.addAnswerToQuestion(this.questionDto!.testQuestionId!, '').subscribe(newAnswer => {
      this.questionDto?.answers.push(newAnswer);
      this.addingAnswer = false;
      const self = this;
      setTimeout(() => {
        self.answers.find(x => x.answerDto?.testQuestionAnswerId === newAnswer.testQuestionAnswerId)?.toggleEditMode(null);
      });
      this.toastr.success('Added new test question');
    }, () => {
      this.toastr.error('Could not add net test question');
    });
  }

  removeAnswer(id: number) {
    // this.editableTest?.questions.indexOf()
    this.questionDto?.answers.splice(this.questionDto?.answers.findIndex(a =>
      a.testQuestionAnswerId === id), 1);
  }

}
