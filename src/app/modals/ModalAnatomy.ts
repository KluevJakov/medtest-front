import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'modal-anatomy',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['./modalStyles/ModalTicketTest.css'],
    template: `
		<div class="modal-header">
			<h4 class="modal-title">Изучение строения уха: </h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
            <div style="display: flex; justify-content: center;">
            <img src="assets/i.png" style="width:480px;height:290px;" usemap="#image-map">

            <map name="image-map">
                <area (click)="show('Ушная раковина')" alt="Ушная раковина" title="Ушная раковина" coords="103,54,81,20,55,8,33,31,31,80,29,154,49,209,66,268,86,280,110,246,96,172" shape="poly">
                <area (click)="show('Наружный слуховой проход')" alt="Наружный слуховой проход" title="Наружный слуховой проход" coords="101,149,103,197,125,186,167,188,208,177,245,164,218,130,168,149" shape="poly">
                <area (click)="show('Барабанная перепонка')" alt="Барабанная перепонка" title="Барабанная перепонка" coords="229,119,226,138,242,158,259,163,257,133" shape="poly">
                <area (click)="show('Барабанная полость')" alt="Барабанная полость" title="Барабанная полость" coords="264,143,272,167,287,177,310,179,325,186,344,176,339,163,311,155,285,148" shape="poly">
                <area (click)="show('Молоточек')" alt="Молоточек" title="Молоточек" coords="234,115,257,130,252,115,259,99,256,90,245,90,243,105" shape="poly">
                <area (click)="show('Наковальня')" alt="Наковальня" title="Наковальня" coords="263,89,259,108,273,137,274,106,273,96" shape="poly">
                <area (click)="show('Стремечко')" alt="Стремечко" title="Стремечко" coords="277,135,299,124,311,150,291,147" shape="poly">
                <area (click)="show('Евстахиева труба')" alt="Евстахиева труба" title="Евстахиева труба" coords="327,189,343,181,365,227,408,282,381,285,353,229" shape="poly">
                <area (click)="show('Слуховой нерв')" alt="Слуховой нерв" title="Слуховой нерв" coords="397,101,426,131,446,113,472,112,477,103,469,92,433,92" shape="poly">
                <area (click)="show('Улитка')" alt="Улитка" title="Улитка" coords="357,120,352,144,348,167,371,179,402,179,423,164,430,137,394,103,373,103" shape="poly">
                <area (click)="show('Окно улитки')" alt="Окно улитки" title="Окно улитки" coords="346,159,314,149,299,120,312,108,343,107,354,116" shape="poly">
                <area (click)="show('Полукружные каналы')" alt="Полукружные каналы" title="Полукружные каналы" coords="302,107,279,87,327,54,358,45,366,78,358,103" shape="poly">
            </map>
            </div>
            <div class="alert alert-secondary" role="alert" id="descr"></div>
		</div>
	`,
})
export class ModalAnatomy {
    constructor(public activeModal: NgbActiveModal) {
    }

    ngOnInit() {

    }

    show(text: string) {
        document.getElementById("descr")!.innerHTML = text;
    }

    hide() {
        document.getElementById("descr")!.innerHTML = "";
    }
}
