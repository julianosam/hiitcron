import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';

@Component({
    selector: 'hc-chronometer',
    templateUrl: './chronometer.component.html',
    styleUrls: ['./chronometer.component.scss']
})
export class ChronometerComponent implements OnInit {

    constructor(private renderer: Renderer2) { }

    @ViewChild('pie')
    pie: ElementRef;

    elapsedSeconds = 0;
    totalSeconds = 30;
    start = 0;

    private _handler;


    ngOnInit() {
        this._restartTimer();
    }

    displayTimer() {

        const remaining = this.totalSeconds - this.elapsedSeconds;
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining - (minutes * 60);

        return minutes ? `${minutes} : ${seconds}` : `${seconds}`;
    }

    private _restartTimer() {

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

        this._updatePie( progress * 100 / (this.totalSeconds * 1000) );

        if (this.elapsedSeconds <= this.totalSeconds) {

            window.requestAnimationFrame((t) => this._progressTime(t));
            
        } else {
            // clearInterval(this._handler);
            this.elapsedSeconds = this.totalSeconds;
        }
    }



    private _updatePie(completed: number) {
        // const style = `conic-gradient(#ccc ${completed}%, white 0)`;
        // this.renderer.setStyle(this.pie.nativeElement, 'background-image', style);

        this.pie.nativeElement.style.setProperty('--completed-segment', completed);
    }

}
