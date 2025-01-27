import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  public svg = input<string>();
  public text = input<string>();
  public class = input<string>();
  public span = input<string>();
}
