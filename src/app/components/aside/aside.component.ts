import { Component } from '@angular/core';
import { ItemComponent } from './item/item.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-aside',
  imports: [ItemComponent, FooterComponent],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {
  public items = [
    {
      link: '/menus',
      icon: 'menu',
      title: 'Menus'
    },
    {
      link: '/dishes',
      icon: 'dish',
      title: 'Platos'
    },
    {
      link: '/orders',
      icon: 'order',
      title: 'Pedidos'
    },
    {
      link: '/clients',
      icon: 'client',
      title: 'Clientes'
    }
  ];
}
