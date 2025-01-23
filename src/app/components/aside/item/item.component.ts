import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  public link = input<string>();
  public icon = input<string>();
  public title = input<string>();
}
