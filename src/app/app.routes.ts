import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NextStepLoginComponent } from './pages/next-step-login/next-step-login.component';
import { PagesComponent } from './pages/pages.component';
import { NoPageFoundComponent } from './shared/components/no-page-found/no-page-found.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { AuthGuard } from './services/guards/auth.guard';



const routes: Routes = [
    {
        path: 'login', component: LoginComponent, data: { titulo: 'Inicio Sesión' }
    },
    {
        path: 'uservalidated', component: NextStepLoginComponent, data: { titulo: 'Inicio Sesión' }
    },
    {
        path: 'logout', component: LogoutComponent, data: { titulo: 'Cierra Sesión' }
    },
    {
        path: '',
        component: PagesComponent,
        loadChildren: () => import('src/app/pages/pages.module').then(m => m.PagesModule),
        canActivate: [AuthGuard],
    },
    { path: 'no-page-found', component: NoPageFoundComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'no-page-found', pathMatch: 'full' }
];

export const APP_ROUTES = RouterModule.forRoot(routes, { useHash: true });
