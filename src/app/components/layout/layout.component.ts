import { Component } from '@angular/core';
import { AsideComponent } from "../aside/aside.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  imports: [AsideComponent, RouterOutlet, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
