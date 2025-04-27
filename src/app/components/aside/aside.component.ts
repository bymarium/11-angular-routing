import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { ItemComponent } from './item/item.component';

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
      link: '/clients',
      icon: 'client',
      title: 'Clientes'
    },
    {
      link: '/orders',
      icon: 'order',
      title: 'Pedidos'
    }
  ];
}
