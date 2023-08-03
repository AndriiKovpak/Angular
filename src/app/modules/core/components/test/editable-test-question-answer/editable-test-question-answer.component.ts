import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ITestQuestionAnswerDto} from "../../../models/ITestQuestionAnswerDto";
import {LanguageService} from "../../../_helpers/languge-filter.service";
import {TestService} from "../../../services/test.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-editable-test-question-answer',
  templateUrl: './editable-test-question-answer.component.html',
  styleUrls: ['./editable-test-question-answer.component.scss']
})
export class EditableTestQuestionAnswerComponent implements OnInit {

  @Input() answerDto?: ITestQuestionAnswerDto;
  @Input() language?: string;
  @Output() answerDeleted = new EventEmitter<number>();
  editMode = false;
  @ViewChild('answerInput') answerInput!: ElementRef<HTMLInputElement>;


  constructor(
    public languageService: LanguageService,
    private testService: TestService,
    private toastr: ToastrService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
  }

  get answerText() {
    return this.languageService.getItemForSelectedLanguage(this.answerDto!.answer, this.language ?? "en");
  }


  toggleEditMode(event: MouseEvent | null) {
    event?.stopPropagation();
    this.editMode = !this.editMode;
    const self = this;
    setTimeout(() => {
      self.answerInput.nativeElement.focus();
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
      const activeQuestionText= this.answerText;

      // initialize unpopulated language options (those that are '' or null) with the text from current
      const blankAnswerText = this.answerDto!.answer!.filter(x => (x.value === '' || x.value === null) && x.langcode !== activeQuestionText.langcode);
      blankAnswerText.forEach(x => x.value = activeQuestionText.value);
      this.testService.updateTestQuestionAnswerText(this.answerDto!.testQuestionAnswerId!, this.answerDto!.answer)
        .subscribe(() => {
          this.toastr.success('Updated answer text');
        }, () => {
          this.toastr.error('Could not update answer text');
        })
    }
  }


  deleteAnswer(event: MouseEvent | null){
    event?.stopPropagation();
    if (confirm('Are you sure to delete this record?')) {
      this.testService
        .deleteTestQuestionAnswer(this.answerDto!.testQuestionAnswerId!)
        .subscribe((x: any) => {
            this.toastr.success(this.translateService.instant('AnswerDeletedSuccess'));
            this.answerDeleted.emit(this.answerDto!.testQuestionAnswerId!);
          },
          (x) => {
            this.toastr.error(this.translateService.instant('AnswerDeletedFailed'));
          });
    }
  }

  updateIsCorrect() {
    this.testService.updateTestQuestionAnswerIsCorrect(this.answerDto!.testQuestionAnswerId!, this.answerDto!.isCorrectAnswer)
      .subscribe(() => {
        this.toastr.success('Updated answer');
      }, () => {
        this.toastr.error('Could not update answer');
      })
  }

}
