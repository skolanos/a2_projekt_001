import { NgModule }     from '@angular/core';
import { Routes }       from '@angular/router';
import { RouterModule } from '@angular/router'

import { MainComponent }  from './components/main.component';
import { LoginComponent } from './components/login.component';
import { RegisterUserComponent } from './components/register-user.component';

const routes: Routes = [
	{ path: 'main',  component: MainComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterUserComponent },
	{ path: '', redirectTo: '/register', pathMatch: 'full'}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
