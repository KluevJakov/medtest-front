import { Component, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../servises/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Role } from '../models/role';

const API_URL: string = environment.apiUrl;

@Component({
    selector: 'modal-edit-user',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['./modalStyles/ModalTicketTest.css'],
    template: `
		<div class="modal-header">
			<h4 class="modal-title">Редактирование пользователя: </h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.close()"></button>
		</div>
		<div class="modal-body">
            <input class="form-control mb-2" type="text" placeholder="Логин" id="login" value="{{user.login}}">
            <input class="form-control mb-2" type="text" placeholder="Группа" id="group" value="{{user.groupp}}">
            <select class="form-control mb-2" id="roles">
                <option *ngFor="let r of roleList; let i = index" value="{{r.id}}">{{r.displayName}}</option>
            </select>
            <button class="btn btn-primary" (click)="save()">Сохранить</button>
		</div>
	`,
})
export class ModalEditUser {
    @Input() user: any;
    roleList: Array<Role> = [];

    constructor(private http: HttpClient,
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private router: Router) {
    }

    ngOnInit() {
        this.http.get<any>(API_URL + '/api/role/all', AuthService.getJwtHeader())
            .subscribe((result: any) => {
                this.roleList = result;
                (document.getElementById("roles") as HTMLSelectElement).value = this.user.roles[0].id;
            }, (error: HttpErrorResponse) => { console.log(error.error); });
    }

    save() {
        this.user.login = (document.getElementById("login") as HTMLInputElement).value;
        this.user.groupp = (document.getElementById("group") as HTMLInputElement).value;
        let roleId = (document.getElementById("roles") as HTMLSelectElement).value;
        let user = {
            userId: this.user.id,
            login: this.user.login,
            group: this.user.groupp,
            roleId: roleId
        };

        this.http.put<any>(API_URL + '/api/user/update', user, AuthService.getJwtHeader())
            .subscribe((result: any) => { this.activeModal.dismiss(); }, (error: HttpErrorResponse) => { console.log(error.error); });
    }
}
