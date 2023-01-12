import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-page-found',
  templateUrl: './no-page-found.component.html',
  styleUrls: ['./no-page-found.component.scss']
})
export class NoPageFoundComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.router.navigate(['logout']);
  }

}
