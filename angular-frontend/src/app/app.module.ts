import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // 👈 Needed for ngModel
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule // 👈 Add this
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
