export class Stat {
    public id!: number;
    public name: string;
    public groupp: string;
    public errorCount: number;
    public lastPass: number;
    public passDate: Date;
  
    constructor(stat:any){
      this.id = stat.id;
      this.name = stat.name;
      this.groupp = stat.groupp;
      this.errorCount = stat.errorCount;
      this.lastPass = stat.lastPass;
      this.passDate = stat.passDate;
    }
  }
  