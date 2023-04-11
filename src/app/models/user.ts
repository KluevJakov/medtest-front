import { Role } from "./role";

export class User {
  id!: number;
  token!:string;
  login!:string;
  groupp!: string;
  roles!:Array<Role>;

  constructor(user:any){
    this.id = user.id;
    this.token = user.token;
    this.login = user.login;
    this.roles = user.roles;
    this.groupp = user.groupp;
  }
}
