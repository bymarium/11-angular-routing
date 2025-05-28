import { Component, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOrders } from '../../interfaces/order.interface';

@Component({
  selector: 'app-view-details',
  imports: [CommonModule],
  templateUrl: './view-details.component.html',
  styleUrl: './view-details.component.scss'
})
export class ViewDetailsComponent {
  public order = input<IOrders>();
  @Output() confirmOrder = new EventEmitter<number>();
  @Output() cancelOrder = new EventEmitter<number>();
  @Output() prepareOrder = new EventEmitter<number>();
  @Output() completeOrder = new EventEmitter<number>();
  @Output() deliverOrder = new EventEmitter<number>();

  private readonly orderStates = ['Creada', 'Confirmada', 'En preparacion', 'Completado', 'Entregada', 'Cancelada'];

  public isButtonEnabled(buttonState: string): boolean {
    if (!this.order() || !this.order()?.stateInfo?.state) return false;
    
    const currentState = this.order()?.stateInfo?.state || '';
    
    if (currentState === 'Cancelada') return false;

    if (buttonState === 'cancelar') {
      return ['Creada', 'Confirmada'].includes(currentState);
    }
    
    const buttonStateMap: Record<string, string> = {
      'confirmar': 'Confirmada',
      'preparar': 'En preparacion',
      'finalizar': 'Completado',
      'entregar': 'Entregada'
    };
    
    const currentIndex = this.orderStates.indexOf(currentState);
    const nextState = this.orderStates[currentIndex + 1];
    
    return buttonStateMap[buttonState] === nextState;
  }

  public markAsConfirmed(): void {
    if (this.order() && this.isButtonEnabled('confirmar')) {
      this.confirmOrder.emit(this.order()?.id);
    }
  }

  public markAsCanceled(): void {
    if (this.order() && this.isButtonEnabled('cancelar')) {
      this.cancelOrder.emit(this.order()?.id);
    }
  }

  public markAsPrepared(): void {
    if (this.order() && this.isButtonEnabled('preparar')) {
      this.prepareOrder.emit(this.order()?.id);
    }
  }

  public markAsCompleted(): void {
    if (this.order() && this.isButtonEnabled('finalizar')) {
      this.completeOrder.emit(this.order()?.id);
    }
  }

  public markAsDelivered(): void {
    if (this.order() && this.isButtonEnabled('entregar')) {
      this.deliverOrder.emit(this.order()?.id);
    }
  }
}
