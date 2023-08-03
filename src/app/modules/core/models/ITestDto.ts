import {ITestQuestionDto} from "./ITestQuestionDto";

export interface ITestDto {
  testId: number;
  numberOfQuestions: number;
  passingScore: number;
  questions: ITestQuestionDto[];
}
