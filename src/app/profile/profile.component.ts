import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { State } from '../state/state';
import { User } from '../user/user';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user!: User;
  state?: State = new State("TEST");

  constructor(private http : HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>(API_URL + '/profile', AuthService.getJwtHeader())
    .subscribe(
      (result: any) => {
        this.user = new User(result);
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );

    this.state!.state = "TEST";
  }

  test() {
    (document.getElementById("mainSwitch") as HTMLInputElement).checked = false;
    this.state!.state = "TEST";
  }

  traning() {
    (document.getElementById("mainSwitch") as HTMLInputElement).checked = true;
    this.state!.state = "TRAIN";
    this.http.get<any>(API_URL + '/api/theme/getAll', AuthService.getJwtHeader())
    .subscribe(
      (result: any) => {
        alert(JSON.stringify(result));
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

  tickets() {
    this.state!.state = "TICKET";
  }

  themes() {
    this.state!.state = "THEME";
  }

  errors() {
    this.state!.state = "ERROR";
  }

  exam() {
    this.state!.state = "EXAM";
  }

  marathon() {
    this.state!.state = "MARATHON";
  }

  favorites() {
    this.state!.state = "FAVORITE";
  }
}
