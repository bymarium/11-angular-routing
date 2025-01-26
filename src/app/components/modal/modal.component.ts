import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [NgClass],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  public open = input.required<boolean>();
  public clickClose = output<boolean>();

  public closeModal() {
    this.clickClose.emit(false);
  }
}
