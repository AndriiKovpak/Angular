import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {ITestDto} from "../models/ITestDto";
import {HttpClient} from "@angular/common/http";
import {CrudService} from "../genric-service/crudservice";
import {ITestQuestionDto} from "../models/ITestQuestionDto";
import {ITextLang} from "../models/ITextLang";
import {ITestQuestionAnswerDto} from "../models/ITestQuestionAnswerDto";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private baseUrl: string = environment.apiBase;

  constructor(
    private crudService: CrudService,
  ) { }

  getEditableTestByCourse(courseId: number): Observable<ITestDto> {
    return this.crudService.getAll$<ITestDto>(`${this.baseUrl}/api/Courses/${courseId}/test-editor`);
  }

  addQuestionToCourseTest(testId: number, question: string): Observable<ITestQuestionDto> {
    return this.crudService.post$<ITestQuestionDto>(`${this.baseUrl}/api/Tests/${testId}/test-question`,{question});
  }

  updateTestQuestionText(questionId: number, questionText: ITextLang[]): Observable<void> {
    return this.crudService.put$(`${this.baseUrl}/api/TestQuestions/${questionId}/question-text`,questionText);
  }

  changeNumberOfQuestions(testId: number, numberOfQuestions: number): Observable<void>{
    return this.crudService.put$(`${this.baseUrl}/api/Tests/${testId}/number-of-questions`,numberOfQuestions);
  }

  changePassingScore(courseId: number, passingScore: number): Observable<void>{
    return this.crudService.put$(`${this.baseUrl}/api/Tests/${courseId}/passing-score`,passingScore);
  }

  deleteTestQuestion(questionId: number): Observable<void> {
    return this.crudService.delete$(`${this.baseUrl}/api/TestQuestions/${questionId}`);
  }

  addAnswerToQuestion(questionId: number, answer: string): Observable<ITestQuestionAnswerDto> {
    return this.crudService.post$<ITestQuestionAnswerDto>(`${this.baseUrl}/api/TestQuestions/${questionId}/answer`,{answer});
  }

  updateTestQuestionAnswerText(answerId: number, answerText: ITextLang[]): Observable<void> {
    return this.crudService.put$(`${this.baseUrl}/api/TestQuestionAnswers/${answerId}/answer-text`,answerText);
  }

  updateTestQuestionAnswerIsCorrect(answerId: number, isCorrect: boolean): Observable<void> {
    return this.crudService.put$(`${this.baseUrl}/api/TestQuestionAnswers/${answerId}/is-correct`,isCorrect);
  }

  deleteTestQuestionAnswer(answerId: number): Observable<void> {
    return this.crudService.delete$(`${this.baseUrl}/api/TestQuestionAnswers/${answerId}`);
  }
}
