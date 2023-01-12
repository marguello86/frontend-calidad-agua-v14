import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuService, LoginService } from 'src/app/services/service.index';
import { Relmenurecursodto } from 'src/app/shared/models/menu-dto/relmenurecursodto';
import { Router } from '@angular/router';
import { LOGIN } from 'src/app/services/constantes';

@Component({
  selector: 'app-menulistitem',
  templateUrl: './menulistitem.component.html',
  styleUrls: ['./menulistitem.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenulistitemComponent implements OnInit {
  expanded: boolean = true;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: Relmenurecursodto;
  @Input() depth: number;
  constructor(public menuService: MenuService, public router: Router, private seguridadService: LoginService) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    this.expanded = (this.item.childrens) ? false : true;
    this.ariaExpanded = this.expanded;
  }
  onItemSelected(item: Relmenurecursodto) {
    if (!item.childrens || !item.childrens.length) {
      if (item.recurso.url === LOGIN) {
        this.seguridadService.logout();
      }
      this.router.navigate([item.recurso.url]);
      // this.navService.closeNav();
    }
    if (item.childrens && item.childrens.length) {
      this.expanded = !this.expanded;
    }
  }
}
