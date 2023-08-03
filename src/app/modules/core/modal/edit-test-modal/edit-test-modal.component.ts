import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TestService } from "../../services/test.service";
import { BehaviorSubject, Subject } from "rxjs";
import { ITestDto } from "../../models/ITestDto";
import { ITestQuestionDto } from "../../models/ITestQuestionDto";
import { ToastrService } from "ngx-toastr";
import { EditableTestQuestionComponent } from "../../components/test/editable-test-question/editable-test-question.component";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-edit-test-modal',
  templateUrl: './edit-test-modal.component.html',
  styleUrls: ['./edit-test-modal.component.scss']
})
export class EditTestModalComponent implements OnInit {

  numberOfQuestions = 10;
  passingScore = 70;
  addingQuestion = false;
  testLanguage = 'en';
  @ViewChildren('editableQuestion') questions!: QueryList<EditableTestQuestionComponent>;

  editableTest: ITestDto | null = null;

  numberOfQuestionsChanged: Subject<number> = new Subject<number>();
  passingScoreChanged: Subject<number> = new Subject<number>();

  TestForm!: FormGroup;

  constructor(
    // public dialog: MatDialog
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private testService: TestService,
    private toastr: ToastrService,
  ) {
    this.numberOfQuestionsChanged.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(model =>
        this.testService.changeNumberOfQuestions(this.editableTest!.testId, model).subscribe(() => {
          this.toastr.success('Success');
        }, () => {
          this.toastr.error('Could not change number of questions');
        })
      );
    this.passingScoreChanged.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(model =>
        this.testService.changePassingScore(this.editableTest!.testId, model).subscribe(() => {
          this.toastr.success('Success');
        }, () => {
          this.toastr.error('Could not change passing score');
        })
      );
  }

  ngOnInit(): void {
    this.testService.getEditableTestByCourse(this.data.id).subscribe(
      dto => {
        this.editableTest = dto;
      }
    );
  }

  get sortedQuestions(): ITestQuestionDto[] {
    return this.editableTest?.questions
      .sort((a, b) => b.testQuestionId! - a.testQuestionId!)
      ?? [];
  }

  addQuestion() {
    this.addingQuestion = true;
    this.testService.addQuestionToCourseTest(this.editableTest!.testId, '').subscribe(newQuestion => {
      this.editableTest?.questions.push(newQuestion);
      this.addingQuestion = false;
      const self = this;
      setTimeout(() => {
        self.questions.find(x => x.questionDto?.testQuestionId === newQuestion.testQuestionId)?.toggleEditMode(null);
      });
      this.toastr.success('Added new test question');
    }, () => {
      this.toastr.error('Could not add net test question');
    });
  }

  removeQuestion(id: number) {
    // this.editableTest?.questions.indexOf()
    this.editableTest?.questions.splice(this.editableTest?.questions.findIndex(q =>
    q.testQuestionId === id), 1);
  }

  onChangeNumberOfQuestions() {
    this.numberOfQuestionsChanged.next(this.editableTest?.numberOfQuestions);
  }

  onChangePassingScore() {
    this.passingScoreChanged.next(this.editableTest?.passingScore);
  }
}
