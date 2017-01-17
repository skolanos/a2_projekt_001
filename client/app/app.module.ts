import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AuthenticationService } from './services/authentication.service';

import { AppComponent }   from './app.component';
import { MainComponent}   from './components/main.component';
import { LoginComponent } from './components/login.component';
import { RegisterUserComponent } from './components/register-user.component';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		AppRoutingModule
	],
	declarations: [
		AppComponent,
		MainComponent,
		LoginComponent,
		RegisterUserComponent
	],
	providers: [
		AuthenticationService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
