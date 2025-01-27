import { CurrencyPipe, DatePipe, registerLocaleData, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay, finalize, forkJoin, map, mergeMap, tap } from 'rxjs';
import { IClients } from '../../interfaces/client.interface';
import { IControls, IOptions } from '../../interfaces/controls.interface';
import { IDishes } from '../../interfaces/dish.interface';
import { IOrder, IOrders } from '../../interfaces/order.interface';
import { IResponse } from '../../interfaces/response.interface';
import { CreateService } from '../../services/create.service';
import { DeleteService } from '../../services/delete.service';
import { GetAllService } from '../../services/get-all.service';
import { GetNameService } from '../../services/get-name.service';
import { UpdateService } from '../../services/update.service';
import { FormComponent } from '../form/form.component';
import { ModalComponent } from '../modal/modal.component';
import { TableComponent } from '../table/table.component';
import { ViewDetailsComponent } from '../view-details/view-details.component';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');
@Component({
  selector: 'app-order',
  imports: [FormComponent, ModalComponent, TableComponent, ViewDetailsComponent],
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
  private getClientName = inject(GetNameService);

  public isOpen: boolean = false;
  public isOpenDetails: boolean = false;
  public message: string = '';
  public action: string = 'Crear';
  public title: string = 'Crear Pedido';
  public orders: IOrders[] = [];
  public order!: IOrders;
  public columns = [
    { field: 'date', header: 'Fecha' },
    { field: 'totalPrice', header: 'Precio Total' },
    { field: 'dishesQuantity', header: 'Cantidad de Platos' },
    { field: 'clientName', header: 'Cliente' }
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

  public closeDetailsModal() {
    this.isOpenDetails = false;
  }

  public openDetailsModal(id: number) {
    this.isOpenDetails = true;
    this.order = this.getDetails(id) as IOrders;
  }

  public getDetails(orderId: number): IOrders | undefined {
    return this.orders.find((_, i) => i === orderId);
  }

  public getOrdesTable(): void {
    this.getOrders.execute<IOrders[]>(this.url)
      .pipe(
        map(result => result.map(order => this.getClientName.getClientNameForOrder('http://localhost:8080/api/clients', order.id).pipe(
          map(client => ({
            ...order,
            clientName: this.titleCasePipe.transform(client?.name + ' ' + client?.lastName),
            clientId: client?.id,
            totalPrice: this.currencyPipe.transform(order.totalPrice, 'COP'),
            date: this.datePipe.transform(order.date, 'longDate', undefined,'es'),
            dishesQuantity: order.orderDetails.reduce((acc, orderDetail) => acc + orderDetail.quantity, 0),
            orderDetails: order.orderDetails.map(orderDetail => ({
              ...orderDetail,
              unitPrice: this.currencyPipe.transform(orderDetail.unitPrice, 'COP'),
              subTotal: this.currencyPipe.transform(orderDetail.subTotal, 'COP')
            }))
          }))
        ))),
        mergeMap(result => forkJoin(result)),
      ).subscribe(result => this.orders = result);
  }

  public deleteOrderById(orderId: number): void {
    this.deleteOrder.execute<IResponse>(this.url + "/" + orderId)
      .pipe(
        tap(() => this.getOrdesTable())
      ).subscribe();
  }

  public updateById(orderId: number): void {
    this.message = '';
    this.action = 'Actualizar';
    this.title = 'Actualizar Plato';
    const order = this.orders.find(order => order.id === orderId);

    const orderDetailsArray = this.form.get('orderDetails') as FormArray;
    orderDetailsArray.clear();

    order?.orderDetails.forEach(orderDetail => {
      orderDetailsArray.push(this.formBuilder.group({
        dishId: [orderDetail.dish.id, [Validators.required]],
        quantity: [orderDetail.quantity, [Validators.required, Validators.min(0)]]
      }));
    });

    this.form.patchValue({
      id: orderId,
      clientId: order?.clientId
    });
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
        ).subscribe();
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
        ).subscribe();
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