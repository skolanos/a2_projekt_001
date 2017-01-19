import { NgModule }     from '@angular/core';
import { Routes }       from '@angular/router';
import { RouterModule } from '@angular/router'

import { LoginUserComponent }    from './components/login-user.component';
import { RegisterUserComponent } from './components/register-user.component';
import { ItemsListComponent }    from './components/items-list.component';

const routes: Routes = [
	{ path: 'items-list',  component: ItemsListComponent },
	{ path: 'login',       component: LoginUserComponent },
	{ path: 'register',    component: RegisterUserComponent },
	{ path: '', redirectTo: '/register', pathMatch: 'full'}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
