import { Question } from "../question/question";

export class Theme {
  public id: number;
  public title: string;
  public estimatedTime: number;
  public text: string;
  public questions: Set<Question>;

  constructor(data:any) {
    this.id = data.id;
    this.title = data.title;
    this.estimatedTime = data.estimatedTime;
    this.text = data.text;
    this.questions = data.questions;
  }

}
