import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-action',
  imports: [],
  templateUrl: './confirm-action.component.html',
  styleUrl: './confirm-action.component.scss'
})
export class ConfirmActionComponent {
  public isOpen = input<boolean>();
  public clickConfirm = output<boolean>();
  public clickCancel = output<boolean>();

  public confirm() {
    this.clickConfirm.emit(true);
  }

  public cancel() {
    this.clickCancel.emit(false);
  }
}
