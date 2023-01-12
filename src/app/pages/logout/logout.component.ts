import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  private isLocal: boolean = false;

  constructor(private seguridadService: LoginService, private router: Router, ) {
    this.isLocal = environment.local;
    if (this.isLocal) {
      this.seguridadService.logout();
      this.router.navigate(['login']);
    } else {
      this.seguridadService.logout();
      window.location.href = `http://${window.location.host}/portalminsa/`;
    }
  }

  ngOnInit() { }

}
