import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AuthenticationService } from './services/authentication.service';
import { ItemsService }          from './services/items.service';

import { AppComponent }          from './app.component';
import { NavbarComponent }       from './components/navbar.component';
import { LoginUserComponent }    from './components/login-user.component';
import { RegisterUserComponent } from './components/register-user.component';
import { ItemsListComponent}     from './components/items-list.component';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		AppRoutingModule
	],
	declarations: [
		AppComponent,
		NavbarComponent,
		LoginUserComponent,
		RegisterUserComponent,
		ItemsListComponent
	],
	providers: [
		AuthenticationService,
		ItemsService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
