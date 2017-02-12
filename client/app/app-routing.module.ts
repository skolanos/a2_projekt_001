import { NgModule }     from '@angular/core';
import { Routes }       from '@angular/router';
import { RouterModule } from '@angular/router'

import { RegisterUserComponent } from './components/register-user.component';
import { ItemsListComponent }    from './components/items-list.component';
import { CartListComponent }     from './components/cart-list.component';

const routes: Routes = [
	{ path: 'register',    component: RegisterUserComponent },
	{ path: 'items-list',  component: ItemsListComponent },
	{ path: 'cart-list',   component: CartListComponent },
	{ path: '', redirectTo: '/register', pathMatch: 'full'}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
