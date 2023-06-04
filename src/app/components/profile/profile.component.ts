import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../servises/auth.service';
import { State } from '../../models/state';
import { Theme } from '../../models/theme';
import { User } from '../../models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ticket } from '../../models/ticket';
import { ModalThemeLearn } from 'src/app/modals/ModalThemeLearn';
import { ModalTicketTest } from 'src/app/modals/ModalTicketTest';
import { ActivatedRoute } from '@angular/router';
import { TimeService } from 'src/app/servises/time.service';
import { Question } from 'src/app/models/question';
import { Stat } from 'src/app/models/stat';
import { ModalCreateQuestion } from 'src/app/modals/ModalCreateQuestion';
import { ModalCreateAnswer } from 'src/app/modals/ModalCreateAnswer';
import { ModalEditUser } from 'src/app/modals/ModalEditUser';
import { Role } from 'src/app/models/role';
import { ModalAnatomy } from 'src/app/modals/ModalAnatomy';
import { ModalAnatomyCheck } from 'src/app/modals/ModalAnatomyCheck';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../modals/modalStyles/ModalTicketTest.css']
})
export class ProfileComponent implements OnInit {

  parseDate = TimeService.formatDate;

  user!: User;
  themesList!: Array<Theme>;
  ticketsList!: Array<Ticket>;
  questionsList!: Array<Question>;
  userList!: Array<User>;
  statList!: Array<Stat>;
  roleList!: Array<Role>;
  state?: State = new State("TEST");
  displayState?: string = "";
  progressWidth?: string;

  constructor(private http: HttpClient,
    private modalService: NgbModal,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.http.get<any>(API_URL + '/profile', AuthService.getJwtHeader())
      .subscribe(
        (result: any) => {
          this.user = new User(result);

          if (this.user.roles[0].systemName == 'ADMIN' || this.user.roles[0].systemName == 'TEACHER') { this.admFeautures(); }
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );

    this.state!.state = "TEST";
    this.route.queryParams
      .subscribe(params => {
        if (params['state'] == "errors") {
          this.state!.state = "ERRORS";
          this.errors();
        }
      });
  }

  //открывашки категорий

  test() {
    (document.getElementById("mainSwitch") as HTMLInputElement).checked = false;
    this.state!.state = "TEST";
  }

  traning() {
    (document.getElementById("mainSwitch") as HTMLInputElement).checked = true;
    this.state!.state = "TRAIN";
    this.http.get<any>(API_URL + '/api/theme/getAllW', AuthService.getJwtHeader())
      .subscribe(
        (result: any) => {
          this.themesList = result;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
  }

  swap() {
    if (this.state!.state == "TRAIN") {
      this.test();
    } else {
      this.traning();
    }
  }

  //открывашки пунктов меню

  tickets() {
    this.state!.state = "TICKET";
    this.displayState = "Билеты";
    this.http.get<any>(API_URL + '/api/ticket/getAll', AuthService.getJwtHeader())
      .subscribe(
        (result: any) => {
          this.ticketsList = result;
          let countCorrectTickets = this.ticketsList.filter(e => e.status == "TRUE").length;
          let progressBar = Math.round(countCorrectTickets / this.ticketsList.length * 100);
          this.progressWidth = progressBar + '%';
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
  }

  themes() {
    this.state!.state = "THEME";
    this.displayState = "Темы";
    this.http.get<any>(API_URL + '/api/theme/getAllW', AuthService.getJwtHeader())
      .subscribe((result: any) => { this.themesList = result; }, (error: HttpErrorResponse) => { console.log(error.error); });
  }

  errors() {
    this.state!.state = "ERROR";
    this.displayState = "Ошибки";
    this.http.get<any>(API_URL + '/api/question/getErrors', AuthService.getJwtHeader())
      .subscribe((result: any) => { this.questionsList = result; }, (error: HttpErrorResponse) => { console.log(error.error); });
  }

  exam() {
    this.state!.state = "EXAM";
    this.displayState = "Экзамен";
    this.http.get<any>(API_URL + '/api/question/getExam', AuthService.getJwtHeader())
      .subscribe((result: any) => { this.questionsList = result; }, (error: HttpErrorResponse) => { console.log(error.error); });
  }

  marathon() {
    this.state!.state = "MARATHON";
    this.displayState = "Марафон";
    this.http.get<any>(API_URL + '/api/question/getMarathon', AuthService.getJwtHeader())
      .subscribe((result: any) => { this.questionsList = result; }, (error: HttpErrorResponse) => { console.log(error.error); });
  }

  favorites() {
    this.state!.state = "FAVORITE";
    this.displayState = "Избранное";
    this.http.get<any>(API_URL + '/api/question/getFavorite', AuthService.getJwtHeader())
      .subscribe((result: any) => { this.questionsList = result; }, (error: HttpErrorResponse) => { console.log(error.error); });
  }

  //открывашки модальных окон
  openThemeLearnModal(text: any, id: any, learned: any) {
    const modalRef = this.modalService.open(ModalThemeLearn, { size: 'xl' });
    modalRef.componentInstance.text = text;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.learned = learned;
    modalRef.result.then((result) => { if (result) { this.traning() } });
  }

  openTicketTestModal(ticket: any) {
    const modalRef = this.modalService.open(ModalTicketTest, { fullscreen: true });
    modalRef.componentInstance.ticket = ticket;
    modalRef.result.then((result) => { if (result) { this.tickets() } });
  }

  //служебный метод
  fancyTimeFormat(duration: number) {
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    let ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + " мин ";
    ret += "" + secs + " сек";

    return ret;
  }

  formatterdate(date: Date) {
    if (date == null) {
      return "-";
    }
    let ddate = new Date(date);
    let result = (ddate.getHours() < 10 ? "0" : "") + ddate.getHours() + ":" + (ddate.getMinutes() < 10 ? "0" : "") + ddate.getMinutes() + " " +
      (ddate.getDate() < 10 ? "0" : "") + ddate.getDate() + "." + (ddate.getMonth() < 10 ? "0" : "") + (ddate.getMonth() + 1) + "." + ddate.getFullYear();

    return result;
  }

  sortColumn(n: number, tableId: string) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(tableId) as HTMLTableElement;
    switching = true;
    dir = "asc";
    while (switching) {
      switching = false;
      rows = table!.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode!.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  changeSearchStat() {
    this.admFeautures();
  }

  changeSearchUser() {
    this.admFeautures();
  }

  admFeautures() {
    let loginParam = (document.getElementById("loginStatParam") as HTMLInputElement);
    let groupParam = (document.getElementById("groupStatParam") as HTMLInputElement);
    let dateParam = (document.getElementById("dateStatParam") as HTMLInputElement);
    let sizeParam = (document.getElementById("sizeStatParam") as HTMLInputElement);

    let loginParam1 = (document.getElementById("loginUserParam") as HTMLInputElement);
    let groupParam1 = (document.getElementById("groupUserParam") as HTMLInputElement);
    let roleParam1 = (document.getElementById("roleUserParam") as HTMLInputElement);
    let sizeParam1 = (document.getElementById("sizeUserParam") as HTMLInputElement);

    let queryParams = "";
    let queryParams1 = "";

    if ((loginParam != null && loginParam.value != "") ||
      (groupParam != null && groupParam.value != "") ||
      (dateParam != null && dateParam.value != "") ||
      (sizeParam != null && sizeParam.value != "")) {
      queryParams += "?";
    }
    if ((loginParam1 != null && loginParam1.value != "") ||
      (groupParam1 != null && groupParam1.value != "") ||
      (roleParam1 != null && roleParam1.value != "") ||
      (sizeParam1 != null && sizeParam1.value != "")) {
      queryParams1 += "?";
    }

    if (loginParam != null && loginParam.value != "") { queryParams += "login=" + loginParam.value + "&"; }
    if (groupParam != null && groupParam.value != "") { queryParams += "group=" + groupParam.value + "&"; }
    if (dateParam != null && dateParam.value != "") { queryParams += "date=" + dateParam.value + "&"; }
    if (sizeParam != null && sizeParam.value != "") { queryParams += "size=" + sizeParam.value + "&"; }

    if (loginParam1 != null && loginParam1.value != "") { queryParams1 += "login=" + loginParam1.value + "&"; }
    if (groupParam1 != null && groupParam1.value != "") { queryParams1 += "group=" + groupParam1.value + "&"; }
    if (roleParam1 != null && roleParam1.value != "") { queryParams1 += "role=" + roleParam1.value + "&"; }
    if (sizeParam1 != null && sizeParam1.value != "") { queryParams1 += "size=" + sizeParam1.value + "&"; }

    this.http.get<any>(API_URL + '/stat' + queryParams, AuthService.getJwtHeader()).subscribe((result: any) => { this.statList = result; }, (error: HttpErrorResponse) => { console.log(error.error); });
    this.http.get<any>(API_URL + '/api/ticket/getAll', AuthService.getJwtHeader()).subscribe((result: any) => { this.ticketsList = result; }, (error: HttpErrorResponse) => { console.log(error.error); });
    this.http.get<any>(API_URL + '/api/user/all' + queryParams1, AuthService.getJwtHeader()).subscribe((result: any) => { this.userList = result; }, (error: HttpErrorResponse) => { console.log(error.error); });
  }

  editUser(user: any) {
    const modalRef = this.modalService.open(ModalEditUser);
    modalRef.componentInstance.user = user;
    modalRef.result.then((result) => { this.admFeautures() });
  }

  createTicket() {
    this.http.post<any>(API_URL + '/api/ticket/create', null, AuthService.getJwtHeader())
      .subscribe((result: any) => { this.admFeautures() }, (error: HttpErrorResponse) => { console.log(error.error); });
  }

  deleteTicket(id: number) {
    this.http.delete<any>(API_URL + '/api/ticket/delete/' + id, AuthService.getJwtHeader())
      .subscribe((result: any) => { this.admFeautures() }, (error: HttpErrorResponse) => { console.log(error.error); });
  }

  createQuestion(id: number) {
    const modalRef = this.modalService.open(ModalCreateQuestion);
    modalRef.componentInstance.ticket_id = id;
    modalRef.result.then((result) => { this.admFeautures() });
  }

  deleteQuestion(id: number) {
    this.http.delete<any>(API_URL + '/api/question/delete/' + id, AuthService.getJwtHeader())
      .subscribe((result: any) => { this.admFeautures() }, (error: HttpErrorResponse) => { console.log(error.error); });
  }

  createAnswer(id: number) {
    const modalRef = this.modalService.open(ModalCreateAnswer);
    modalRef.componentInstance.question_id = id;
    modalRef.result.then((result) => { this.admFeautures() });
  }

  deleteAnswer(id: number) {
    this.http.delete<any>(API_URL + '/api/answer/delete/' + id, AuthService.getJwtHeader())
      .subscribe((result: any) => { this.admFeautures() }, (error: HttpErrorResponse) => { console.log(error.error); });
  }

  anatomy() {
    const modalRef = this.modalService.open(ModalAnatomy, { size: 'lg'});
    modalRef.result.then((result) => {modalRef.close();});
  }

  anatomyCheck() {
    const modalRef = this.modalService.open(ModalAnatomyCheck, { size: 'lg'});
    modalRef.result.then((result) => {modalRef.close();});
  }
}