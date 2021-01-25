import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TimerComponent } from './timer.component';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule],
    declarations: [TimerComponent],
    exports: [TimerComponent]
})
export class TimerComponentModule { }