import {ITextLang} from "./ITextLang";

export interface ICmsPage {
  id: number;
  title: ITextLang[];
  htmlContent: ITextLang[];
  pageType: string;
}
