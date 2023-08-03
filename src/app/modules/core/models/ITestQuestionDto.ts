import {ITestQuestionAnswerDto} from "./ITestQuestionAnswerDto";
import {ITextLang} from "./ITextLang";

export interface ITestQuestionDto {
  testQuestionId?: number;
  question: ITextLang[];
  answers: ITestQuestionAnswerDto[];
}
