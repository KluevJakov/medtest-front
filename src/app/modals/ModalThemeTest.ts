import { Component, Input, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../servises/auth.service';
import { CommonModule } from '@angular/common';
import { Answer } from '../models/answer';
import { Router } from '@angular/router';
import { Theme } from '../models/theme';

const API_URL: string = environment.apiUrl;

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
    imports: [CommonModule],
    styleUrls: ['./modalStyles/ModalTicketTest.css'],
	template: `
		<div class="modal-header">
			<h4 class="modal-title">Тема {{theme.id}}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="areYouSure()"></button>
		</div>
		<div class="modal-body">
			<div id="ticketModal">
                <span id="qNum">
                    <div class="qNumE" *ngFor="let q of theme.questions; let i = index">
                        <div *ngIf="q.status == 'NOTANSWERED'" class="qNumE0">{{i+1}}</div>
                        <div *ngIf="q.status == 'CURRENT'" class="qNumE1">{{i+1}}</div>
                        <div *ngIf="q.status == 'FALSE'" class="qNumE2">{{i+1}}</div>
                        <div *ngIf="q.status == 'TRUE'" class="qNumE3">{{i+1}}</div>
                    </div>
                </span>
            </div>
            <hr>
            <ng-container *ngIf="!finished">
                <div id="qText" *ngIf="theme && theme.questions">
                    {{theme.questions[currentQuestionId].text}}
                </div>
                <div id="qAnswers" *ngIf="theme && theme.questions">
                    <div class="answer" *ngFor="let a of theme.questions[currentQuestionId].answers; let i = index" (click)="answer(a.id)">{{a.text}}</div>
                </div>
                <span id="qAddToFavorite" (click)="markAsFav()">
                    <ng-container *ngIf="!fav">Добавить в избранное</ng-container>
                    <ng-container *ngIf="fav">Удалить из избранного</ng-container>
                </span>
            </ng-container>
            <ng-container *ngIf="finished">
                <div id="resultBlock" *ngIf="theme && theme.questions">
                    <div id="result">{{correctAnswers}}/{{theme.questions.length}}</div>
                    <div *ngIf="correctAnswers == theme.questions.length" id="resultAdvice">ОТЛИЧНО</div>
                    <div *ngIf="correctAnswers != theme.questions.length" id="resultAdvice">ТРЕНИРУЙТЕСЬ</div>
                    <button *ngIf="correctAnswers != theme.questions.length" type="button" class="btn btn-primary" (click)="redirectToMistakes()">Мои ошибки</button>
                    <div id="replay" (click)="replay()">Пройти ещё раз</div>
                </div>
            </ng-container>
		</div>
	`,
})
export class ModalThemeTest {
    @Input() theme!: Theme;
    currentQuestionId: number;
    finished: boolean;
    fav!: boolean;
    correctAnswers: number;

    constructor(private http : HttpClient, 
        public activeModal: NgbActiveModal, 
        private modalService: NgbModal, 
        private router: Router) {
            this.currentQuestionId = 0;
            this.correctAnswers = 0;
            this.finished = false;
    }

    ngOnInit() {
        console.log(this.theme);
        this.http.get<any>(API_URL + '/api/theme?id='+this.theme.id, AuthService.getJwtHeader())
      .subscribe((result: any) => { 
        console.log(result);
        this.theme = result;
        this.theme.questions[this.currentQuestionId].status = 'CURRENT';
        this.fav = this.theme.questions[this.currentQuestionId].favorite;
    }, (error: HttpErrorResponse) => { console.log(error.error); });
        
    }

    redirectToMistakes() {
        this.activeModal.close('Cross click');
        this.router.navigate(['/profile'], { queryParams: {state : 'errors'}}).then(() => {window.location.reload();});
    }

    replay () {
        this.activeModal.close('Cross click');
    }

    markAsFav() {
        this.theme.questions[this.currentQuestionId].favorite = !this.theme.questions[this.currentQuestionId].favorite;
        this.fav = this.theme.questions[this.currentQuestionId].favorite;
    }

    areYouSure () {
        if (this.currentQuestionId != this.theme.questions.length-1) {
            const modalRef = this.modalService.open(AreYouSure, { centered: true, size: 'sm' });
            modalRef.result.then((result) => {
                if (result == 'YES') {
                    this.activeModal.close('Cross click');
                }
            });
        } else {
            this.activeModal.close('Cross click');
        }
    }

    answer(id: any) {
        let yourChoise = this.theme.questions[this.currentQuestionId].answers as Array<Answer>;
        for (let i = 0; i < yourChoise.length; i++) {
            if (yourChoise[i].id == id) {
                if (this.theme.questions[this.currentQuestionId].answers[i].correct) {
                    this.theme.questions[this.currentQuestionId].status = 'TRUE';
                    this.correctAnswers++;
                } else {
                    this.theme.questions[this.currentQuestionId].status = 'FALSE';
                }
            }
        }
        if (this.currentQuestionId != this.theme.questions.length-1) {
            this.currentQuestionId++;
            this.fav = this.theme.questions[this.currentQuestionId].favorite;
            this.theme.questions[this.currentQuestionId].status = 'CURRENT';
        } else {
            this.finished = true;
            this.http.post<any>(API_URL + '/api/question/answer', this.theme.questions , AuthService.getJwtHeader())
                .subscribe(
                (result: any) => {
                    console.log(result);
                },
                (error: HttpErrorResponse) => {
                    console.log(error.error);
                }
            );
        }
    }
}

@Component({
	selector: 'ngbd-modal-options',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
        <div class="modal-header">
            <h4 class="modal-title">Вы уверены?</h4>
        </div>
        <div class="modal-body">
            Вы не закончили попытку.<br>
            Прогресс не сохранится!
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-success" aria-label="Close" (click)="continue()">Продолжить</button>
            <button type="button" class="btn btn-danger" aria-label="Close" (click)="quit()">Уйти</button>
        </div>
    `,
})
export class AreYouSure {
	constructor(private modalService: NgbActiveModal) {}

    continue () {
        this.modalService.close("NO");
    }

    quit () {
        this.modalService.close("YES");
    }
}