import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
    selector: 'hc-chronometer',
    templateUrl: './chronometer.component.html',
    styleUrls: ['./chronometer.component.scss'],
    animations: [
        trigger('expandCollapse', [
            // ...
            state('expand', style({
                width: '19rem',
                height: '19rem',
            })),
            state('collapse', style({
                width: '18rem',
                height: '18rem',
            })),
            transition('* => collapse', [
                animate('100ms ease-out')
            ]),
            transition('* => expand', [
                animate('100ms ease-in')
            ]),
        ]),
    ],
})
export class ChronometerComponent implements OnInit {

    constructor(private renderer: Renderer2) { }

    @ViewChild('pie')
    pie: ElementRef;
    @ViewChild('highlight')
    highlight: ElementRef;
    @ViewChild('sections')
    sections: ElementRef;

    plan = [{
        type: 'low',
        duration: 6
    }, {
        type: 'high',
        duration: 2
    }, {
        type: 'low',
        duration: 6
    }, {
        type: 'high',
        duration: 2
    },{
        type: 'low',
        duration: 6
    }, {
        type: 'high',
        duration: 2
    }, {
        type: 'low',
        duration: 6
    }, {
        type: 'high',
        duration: 2
    }];

    isHighlighted = 'collapse';

    currentSection = 0;
    elapsedSeconds = 0;
    totalSeconds = 30;
    start = 0;

    private _handler;


    ngOnInit() {

        let gradientSections = 'conic-gradient(';
        let start = 0;
        let end = 0;
        let accum = 0;

        const totalTime = this.plan.reduce((t, section) => t + section.duration, 0);

        this.plan.forEach(p => {

            start = accum * 100 / totalTime;
            end = start + (p.duration * 100 / totalTime);
            accum += p.duration;
            gradientSections += `${p.type === 'high' ? '#faa' : '#bca'} ${start}% ${end}%,`;
        });

        gradientSections += `#eee 0)`;

        this.sections.nativeElement.style.setProperty('background-image', gradientSections);

        this._restartTimer();
    }

    displayTimer() {

        const remaining = this.totalSeconds - this.elapsedSeconds;
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining - (minutes * 60);

        return minutes ? `${minutes} : ${seconds}` : `${seconds}`;
    }

    private _restartTimer() {

        // this.totalSeconds = this.plan.reduce((t, i) => i.duration + t, 0);
        this.totalSeconds = this.plan[this.currentSection].duration;
        this._updateSection();
        this.isHighlighted = 'expand';

        this.elapsedSeconds = 0;
        this.start = 0;
        this._progressTime(0);




        // this._handler = setInterval(() => {



        // }, 1000);

    }


    private _progressTime(t) {

        this.start = this.start > 0 ? this.start : t;

        const progress = t - this.start;
        this.elapsedSeconds = Math.floor(progress / 1000);

        this._updatePie(progress * 100 / (this.totalSeconds * 1000));

        if (this.elapsedSeconds < this.totalSeconds) {

            window.requestAnimationFrame((t) => this._progressTime(t));

        } else {
            // clearInterval(this._handler);
            this.currentSection++;
            this.isHighlighted = 'collapse';
            setTimeout(() => this._restartTimer(), 100);
        }
    }



    private _updatePie(completed: number) {
        // const style = `conic-gradient(#ccc ${completed}%, white 0)`;
        // this.renderer.setStyle(this.pie.nativeElement, 'background-image', style);

        this.pie.nativeElement.style.setProperty('--completed-segment', completed);
    }

    private _updateSection() {
        const currentPlanSection = this.plan[this.currentSection];
        const totalTime = this.plan.reduce((t, section) => t + section.duration, 0);
        const totalElapsed = this.plan.reduce((t, section, index) => {
            return index < this.currentSection ? section.duration + t : t;
        }, 0);

        const highStart = totalElapsed * 100 / totalTime;
        const highEnd = highStart + (currentPlanSection.duration * 100 / totalTime);
        const highColor = currentPlanSection.type === 'low' ? '#bca' : '#faa';

        this.highlight.nativeElement.style.setProperty('--highlight-start', highStart);
        this.highlight.nativeElement.style.setProperty('--highlight-end', highEnd);
        this.highlight.nativeElement.style.setProperty('--highlight-color', highColor);


    }

}
