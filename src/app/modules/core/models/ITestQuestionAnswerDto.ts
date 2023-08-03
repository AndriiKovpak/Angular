import {ITextLang} from "./ITextLang";

export interface ITestQuestionAnswerDto {
  testQuestionAnswerId: number;
  answer: ITextLang[];
  isCorrectAnswer: boolean;
}
