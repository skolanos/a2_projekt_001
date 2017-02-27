import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './routing/app-routing.module';
import { CartListGuard }    from './routing/cart-list.guard';
import { OrdersListGuard }  from './routing/orders-list.guard';

import { EventEmitterService }   from './services/event-emitter.service';
import { AuthenticationService } from './services/authentication.service';
import { ItemsService }          from './services/items.service';
import { CartService }           from './services/cart.service';
import { OrdersService }         from './services/orders.service';

import { AppComponent }          from './app.component';
import { NavbarComponent }       from './components/navbar.component';
import { LoginUserComponent }    from './components/login-user.component';
import { RegisterUserComponent } from './components/register-user.component';
import { ItemsListComponent}     from './components/items-list.component';
import { PricesComponent }       from './components/prices-component';
import { CartListComponent }     from './components/cart-list.component';
import { OrdersListComponent }   from './components/orders-list.component';

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
		CartListComponent,
		OrdersListComponent
	],
	providers: [
		CartListGuard,
		OrdersListGuard,
		EventEmitterService,
		AuthenticationService,
		ItemsService,
		CartService,
		OrdersService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
