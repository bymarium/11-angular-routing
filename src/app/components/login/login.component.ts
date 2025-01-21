import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private activatedRoute: ActivatedRoute) {

  }

  handle(): void {
    this.activatedRoute.params.subscribe(console.log)
    this.activatedRoute.data.subscribe(console.log)
  }
}
