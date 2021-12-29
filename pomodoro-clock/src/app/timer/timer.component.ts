import { Component } from '@angular/core';
import { ITimer } from './model/ITimer';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@capacitor-community/native-audio'

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {

  public sessionInterval = 5;
  public shortBreakInterval = this.convertMinutesToSeconds(5);
  public longBreakInterval = this.convertMinutesToSeconds(10);

  public timer: ITimer;
  public timerTitle: string;
  public timerDisplay: string;
  public isBreak = false;
  public breakCount = 0;

  constructor(
    private platform: Platform
  ) {
    this.platform.ready().then(() => {

      NativeAudio.preload({
        assetId: "completeTimer",
        assetPath: "alarm.mp3",
        audioChannelNum: 1,
        isUrl: false
      }).then(
        (result) => {
          console.log('nativeAudio preloadSimple successful: ' + result);
        }, (error) => {
          console.log('nativeAudio preloadSimple failed: ' + error);
        }
      );

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
    this.playTune();

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

  private playTune() {
    NativeAudio.play({
      assetId: 'completeTimer',
      time: 0.0
    }).then(
      (result) => {
        console.log('nativeAudio play successful: ' + result);
      }, (error) => {
        console.log('nativeAudio play fail: ' + error);
      }
    );
  }

  updateUI() {
    this.timerDisplay = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    this.timerTitle = this.timer.title;
  }

  playPauseTimer() {
    this.timer.isPaused = !this.timer.isPaused;
    this.timerTick();
  }
}
