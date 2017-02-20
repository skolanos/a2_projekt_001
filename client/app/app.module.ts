import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { EventEmitterService }   from './services/event-emitter.service';
import { AuthenticationService } from './services/authentication.service';
import { ItemsService }          from './services/items.service';
import { CartService }           from './services/cart.service';

import { AppComponent }          from './app.component';
import { NavbarComponent }       from './components/navbar.component';
import { LoginUserComponent }    from './components/login-user.component';
import { RegisterUserComponent } from './components/register-user.component';
import { ItemsListComponent}     from './components/items-list.component';
import { PricesComponent }       from './components/prices-component';
import { CartListComponent }     from './components/cart-list.component';

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
		ItemsListComponent,
		PricesComponent,
		CartListComponent
	],
	providers: [
		EventEmitterService,
		AuthenticationService,
		ItemsService,
		CartService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
