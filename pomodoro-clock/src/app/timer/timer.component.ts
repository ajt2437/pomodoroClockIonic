import { Component } from '@angular/core';
import { ITimer } from './model/ITimer';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {

  public sessionInterval = 25; //this.convertMinutesToSeconds(25);
  public shortBreakInterval = 5; //this.convertMinutesToSeconds(5);
  public longBreakInterval = 10; //this.convertMinutesToSeconds(10);

  public timer: ITimer;
  public timerTitle: string;
  public timerDisplay: string;
  public isBreak = false;
  public breakCount = 0;

  // audio
  filename = 'assets/audio/alarm.mp3';

  constructor(
    private platform: Platform,
    private nativeAudio: NativeAudio
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.nativeAudio.preloadSimple('completeTimer', this.filename).then(
          (result) => {
            console.log('nativeAudio preloadSimple successful: ' + result);
          }, (error) => {
            console.log('nativeAudio preloadSimple failed: ' + error);
          }
        );
      }

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
    if (this.platform.is('cordova')) {
      this.nativeAudio.play('completeTimer').then(
        (result) => {
          console.log('nativeAudio play successful: ' + result);
        }, (error) => {
          console.log('nativeAudio play fail: ' + error);
        }
      );
    } else {
      let audioAsset = new Audio(this.filename);
      audioAsset.play().then(
        () => {
          console.log('play successful');
        }, (error) => {
          console.log('play failed ' + error);
        }
      );
    }
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
