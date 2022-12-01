import { Answer } from "../answer/answer";

export class Question {
  public id: number;
  public text: string;
  public answers: Set<Answer>;

  constructor(data:any) {
    this.id = data.id;
    this.text = data.text;
    this.answers = data.answers;
  }
}
