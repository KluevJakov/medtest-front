import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../servises/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

const API_URL: string = environment.apiUrl;

@Component({
    selector: 'modal-anatomy-check',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['./modalStyles/ModalTicketTest.css'],
    template: `
		<div class="modal-header">
			<h4 class="modal-title">Проверка знаний по анатомии уха: </h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
            <div style="display: flex; justify-content: center;">
            <img src="assets/i.png" style="width:480px;height:290px;" usemap="#image-map">

            <div>
                <label>Молоточек: </label>
                <input class="form-control mb-2" type="text" maxlength="1" id="q1">
                <label>Улитка: </label>
                <input class="form-control mb-2" type="text" maxlength="1" id="q2">
                <label>Полукружные каналы: </label>
                <input class="form-control mb-2" type="text" maxlength="1" id="q3">
                <label>Слуховой нерв: </label>
                <input class="form-control mb-2" type="text" maxlength="1" id="q4">
                <label>Ушная раковина: </label>
                <input class="form-control mb-2" type="text" maxlength="1" id="q5">
                <label>Наковальня: </label>
                <input class="form-control mb-2" type="text" maxlength="1" id="q6">
                <label>Стремечко: </label>
                <input class="form-control mb-2" type="text" maxlength="1" id="q7">
                <label>Наружный слуховой проход: </label>
                <input class="form-control mb-2" type="text" maxlength="1" id="q8">
                <label>Евстахиева труба: </label>
                <input class="form-control mb-2" type="text" maxlength="1" id="q9">
                <label>Барабанная перепонка: </label>
                <input class="form-control mb-2" type="text" maxlength="1" id="q10">
                <label>Окно улитки: </label>
                <input class="form-control mb-2" type="text" maxlength="1" id="q11">
                <label>Барабанная полость: </label>
                <input class="form-control mb-2" type="text" maxlength="1" id="q12">
                <button class="btn btn-success" (click)="check()">Проверить</button>
                <div class="alert alert-secondary" role="alert" id="res">
                
                </div>
            </div>
		</div>
	`,
})
export class ModalAnatomyCheck {
    constructor(private http: HttpClient,
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private router: Router) {
    }

    ngOnInit() {

    }

    check(){
        let test = {
            q1 : (document.getElementById("q1") as HTMLInputElement).value,
            q2 : (document.getElementById("q2") as HTMLInputElement).value,
            q3 : (document.getElementById("q3") as HTMLInputElement).value,
            q4 : (document.getElementById("q4") as HTMLInputElement).value,
            q5 : (document.getElementById("q5") as HTMLInputElement).value,
            q6 : (document.getElementById("q6") as HTMLInputElement).value,
            q7 : (document.getElementById("q7") as HTMLInputElement).value,
            q8 : (document.getElementById("q8") as HTMLInputElement).value,
            q9 : (document.getElementById("q9") as HTMLInputElement).value,
            q10 : (document.getElementById("q10") as HTMLInputElement).value,
            q11 : (document.getElementById("q11") as HTMLInputElement).value,
            q12 : (document.getElementById("q12") as HTMLInputElement).value,
        };

        this.http.post<any>(API_URL + '/test', test, AuthService.getJwtHeader())
      .subscribe((result: any) => { document.getElementById('res')!.innerHTML = result.text; }, (error: HttpErrorResponse) => { console.log(error.error); });
    }

    show(text: string) {
        document.getElementById("descr")!.innerHTML = text;
    }

    hide() {
        document.getElementById("descr")!.innerHTML = "";
    }
}
