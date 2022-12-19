import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

const API_URL: string = environment.apiUrl;

@Component({
	selector: 'modal-theme-block',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['../components/profile/profile.component.css'],
	template: `
		<div id="themesDataList">
            <div *ngFor="let t of themesList; let i = index" class="themesElem">
                <span class="themesInner">
                    <div style="font-size:x-large;">{{t.title}}</div> 
                    <div style="color: #BABABD;font-size: large;">Вопросов: {{t.questions.length}}</div>
                </span>
            </div>
        </div>
	`,
})
export class ModalThemeBlock {
    @Input() themesList : any;

    constructor(private http : HttpClient,private router: Router) {}

    ngOnInit() {
    }
}