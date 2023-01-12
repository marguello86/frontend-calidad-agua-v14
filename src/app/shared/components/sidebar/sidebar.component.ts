import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MenuService } from 'src/app/services/service.index';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  private isLocal: boolean = false;

  constructor(private router: Router, private seguridadService: LoginService, public menuService: MenuService) {
    if (!seguridadService.getLocalStorageItem('JWT')) { return; }
    this.menuService.cargarMenu(6506, 68).subscribe(resp => console.log('menu: ', resp));
  }

  ngOnInit() {
    // this.menuService.cargarMenu(6506, 68);
    this.isLocal = environment.local;
    // console.log('this.isLocal', this.isLocal);

  }

  cierreSesion() {
    this.router.navigate(['logout']);
    /*this.seguridadService.logout();
    if (this.isLocal) {
     // this.router.navigate(['']);
      return '';
    } else {
     return window.location.href = `http://${window.location.host}/portalminsa/`;
    }*/
  }
}
