import { Component } from '@angular/core';
import { ITimer } from './model/ITimer';
import { Platform } from '@ionic/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {

  public sessionInterval = this.convertMinutesToSeconds(25);
  public shortBreakInterval = this.convertMinutesToSeconds(5);
  public longBreakInterval = this.convertMinutesToSeconds(10);

  public timer: ITimer;
  public timerTitle: string;
  public timerDisplay: string;
  public isBreak = false;
  public breakCount = 0;

  constructor(
    private platform: Platform,
    private vibration: Vibration
  ) {
    this.platform.ready().then(() => {
      this.timer = {
        title: 'Session',
        secondsRemaining: this.sessionInterval,
        isPaused: true
      };

      this.updateUI();
    });
  }

  private convertMinutesToSeconds(minutes: number) {
    return minutes * 60;
  }

  private getSecondsAsDigitalClock(inputSeconds: number) {
    var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    var minutes = Math.floor(sec_num / 60);
    var seconds = sec_num - (minutes * 60);
    var minutesString = '';
    var secondsString = '';
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return minutesString + ':' + secondsString;
  }

  private timerTick() {
    this.updateUI();

    setTimeout(() => {
      if (this.timer.isPaused) { return; }

      this.timer.secondsRemaining--;
      this.updateUI();
      if (this.timer.secondsRemaining > 0) {
        this.timerTick();
      } else {
        this.nextTimer();
      }
    }, 1000);
  }

  private nextTimer() {
    this.vibration.vibrate([2000,1000,2000]);

    if (this.isBreak) {
      this.timer = {
        title: 'Session',
        secondsRemaining: this.sessionInterval,
        isPaused: this.timer.isPaused
      };
    } else {
      this.breakCount += 1;
      var breakInterval = this.breakCount % 4 == 0 ?
        this.longBreakInterval :
        this.shortBreakInterval;

      this.timer = {
        title: 'Break',
        secondsRemaining: breakInterval,
        isPaused: this.timer.isPaused
      };
    }

    this.isBreak = !this.isBreak;
    this.timerTick();
  }

  updateUI() {
    this.timerDisplay = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    this.timerTitle = this.timer.title;
  }

  playPauseTimer() {
    this.timer.isPaused = !this.timer.isPaused;
    this.timerTick();
    this.vibration.vibrate(0);
  }
}
