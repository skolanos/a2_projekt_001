import { NgModule }     from '@angular/core';
import { RouterModule, Routes }       from '@angular/router';

import { CartListGuard }   from './cart-list.guard';
import { OrdersListGuard } from './orders-list.guard';

import { RegisterUserComponent } from '../components/register-user.component';
import { ItemsListComponent }    from '../components/items-list.component';
import { CartListComponent }     from '../components/cart-list.component';
import { OrdersListComponent }   from '../components/orders-list.component';

const routes: Routes = [
	{ path: 'register',    component: RegisterUserComponent },
	{ path: 'items-list',  component: ItemsListComponent },
	{ path: 'cart-list',   component: CartListComponent,     canActivate: [ CartListGuard ] },
	{ path: 'orders-list', component: OrdersListComponent,   canActivate: [ OrdersListGuard ] },
	{ path: '', redirectTo: '/register', pathMatch: 'full'}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
