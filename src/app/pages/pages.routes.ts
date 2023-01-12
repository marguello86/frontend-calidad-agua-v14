import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../services/guards/auth.guard';
import { RoleGuard } from '../services/guards/role.guard';
import { HelpComponent } from './help/help.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { titulo: 'Resumen' },
    canActivate: [AuthGuard],
  },
  { path: 'ayuda', component: HelpComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'no-page-found', pathMatch: 'full' },
];

export const PAGES_ROUTES = RouterModule.forChild(routes);
