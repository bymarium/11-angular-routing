import { Component, EventEmitter, input, Output } from '@angular/core';
import { IOrders } from '../../interfaces/order.interface';

@Component({
  selector: 'app-view-details',
  imports: [],
  templateUrl: './view-details.component.html',
  styleUrl: './view-details.component.scss'
})
export class ViewDetailsComponent {
  public order = input<IOrders>();
  @Output() finishOrder = new EventEmitter<number>();

  public markAsFinished(): void {
    if (this.order()) {
      this.finishOrder.emit(this.order()?.id);
    }
  }
}
