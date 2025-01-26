import { Component, inject, OnInit } from '@angular/core';
import { CreateService } from '../../services/create.service';
import { GetAllService } from '../../services/get-all.service';
import { DeleteService } from '../../services/delete.service';
import { UpdateService } from '../../services/update.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOrder, IOrders } from '../../interfaces/order.interface';
import { IControls, IOptions } from '../../interfaces/controls.interface';
import { IClients } from '../../interfaces/client.interface';
import { delay, finalize, map, tap } from 'rxjs';
import { IResponse } from '../../interfaces/response.interface';
import { IDishes } from '../../interfaces/dish.interface';
import { FormComponent } from '../form/form.component';
import { ModalComponent } from '../modal/modal.component';
import { TableComponent } from '../table/table.component';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [FormComponent, ModalComponent, TableComponent],
  providers: [CurrencyPipe, DatePipe, TitleCasePipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  private createOrder = inject(CreateService);
  private getOrders = inject(GetAllService);
  private deleteOrder = inject(DeleteService);
  private updateOrder = inject(UpdateService);
  private formBuilder = inject(FormBuilder);
  private getClients = inject(GetAllService);
  private getDishes = inject(GetAllService);
  private currencyPipe = inject(CurrencyPipe);
  private datePipe = inject(DatePipe);
  private titleCasePipe = inject(TitleCasePipe);

  public isOpen: boolean = false;
  public message: string = '';
  public action: string = 'Crear';
  public title: string = 'Crear Pedido';
  public orders: IOrders[] = [];
  public columns = [
    { field: 'date', header: 'Fecha' },
    { field: 'totalPrice', header: 'Precio Total' },
    { field: 'dishesQuantity', header: 'Cantidad de Platos' },
    { field: 'client', header: 'Cliente' },
    { field: 'dowloadDetails', header: 'Descrgar detalles' }
  ];
  public form: FormGroup = this.formBuilder.group({
    id: [null],
    clientId: ['', [Validators.required]],
    orderDetails: this.formBuilder.array([this.formBuilder.group({
      dishId: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(0)]]
    })])
  });

  private clientOptions: IOptions[] = [];
  public dishOptions: IOptions[] = [];
  public controls: IControls[] = [
    {
      type: 'select', text: 'Cliente', controlName: 'clientId',
      options: []
    }
  ];
  private url: string = 'http://localhost:8080/api/orders';

  ngOnInit(): void {
    this.submit();
    this.getOrdesTable();

    this.getClients.execute<IClients[]>('http://localhost:8080/api/clients')
      .pipe(
        map(result => result.map(client => ({ value: client.id, name: client.name }))),
        map(result => result.map(client => ({ ...client, name: this.titleCasePipe.transform(client.name) })))
      )
      .subscribe(options => {
        this.clientOptions = options;
        this.updateClientOptions();
      });

    this.getDishes.execute<IDishes[]>('http://localhost:8080/api/dishes')
      .pipe(
        map(result => result.map(dish => ({ value: dish.id, name: dish.name }))),
        map(result => result.map(dish => ({ ...dish, name: this.titleCasePipe.transform(dish.name) })))
      )
      .subscribe(options => {
        this.dishOptions = options;
        this.updateDishOptions();
      });
  }

  public openModal(event: boolean) {
    this.isOpen = event;
  }

  public getOrdesTable(): void {
    this.getOrders.execute<IOrders[]>(this.url)
      .pipe(
        map(result => result.map(order => ({
          ...order, 
          totalPrice: this.currencyPipe.transform(order.totalPrice, 'COP'), 
          date: this.datePipe.transform(order.date),
          dishesQuantity: order.orderDetails.reduce((acc, orderDetail) => acc + orderDetail.quantity, 0)
        }))),
        tap(result => this.orders = result)
      ).subscribe();
  }

  public deleteOrderById(orderId: number): void {
    this.deleteOrder.execute<IResponse>(this.url + "/" + orderId)
      .pipe(
        tap(result => this.getOrdesTable())
      ).subscribe();
  }

  public updateById(orderId: number): void {
    this.message = '';
    this.action = 'Actualizar';
    this.title = 'Actualizar Plato';
    const order = this.orders.find(order => order.id === orderId);
  }

  public submit(): void {
    console.log(this.form.value.id);
    if (this.form.value.id === null) {
      this.create();
    }
    else {
      this.update(this.form.value.id);
    }
  }

  private create(): void {
    if (this.form.valid) {
      this.createOrder.execute<IResponse>(this.url, this.form.getRawValue() as unknown as IOrder)
        .pipe(
          tap(result => {
            this.message = result.message;
            this.getOrdesTable();
          }),
          delay(2000),
          finalize(() => {
            this.message = '';
            this.getOrdesTable();
            this.form.reset();
            this.isOpen = false;
          })
        ).subscribe(console.log);
    }
  }

  private update(dishId: number): void {
    if (this.form.valid) {
      this.updateOrder.execute<IResponse>(this.url + "/" + dishId, this.form.getRawValue() as unknown as IOrder)
        .pipe(
          tap(result => this.message = result.message),
          delay(2000),
          finalize(() => {
            this.message = '';
            this.getOrdesTable();
            this.action = 'Crear';
            this.title = 'Crear Pedido';
            this.form.reset();
            this.isOpen = false;
          })
        ).subscribe(console.log);
    }
  }

  private updateClientOptions() {
    const clientControl = this.controls.find(control => control.controlName === 'clientId');
    if (clientControl) {
      clientControl.options = this.clientOptions;
    }
  }

  private updateDishOptions() {
    const dishControl = this.controls.find(control => control.controlName === 'dishId');
    if (dishControl) {
      dishControl.options = this.dishOptions;
    }
  }
}