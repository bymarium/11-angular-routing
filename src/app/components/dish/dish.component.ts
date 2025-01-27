import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay, finalize, forkJoin, map, mergeMap, tap } from 'rxjs';
import { IControls, IOptions } from '../../interfaces/controls.interface';
import { IDish, IDishes } from '../../interfaces/dish.interface';
import { IMenus } from '../../interfaces/menu.interface';
import { IResponse } from '../../interfaces/response.interface';
import { CreateService } from '../../services/create.service';
import { DeleteService } from '../../services/delete.service';
import { GetAllService } from '../../services/get-all.service';
import { GetNameService } from '../../services/get-name.service';
import { UpdateService } from '../../services/update.service';
import { FormComponent } from '../form/form.component';
import { ModalComponent } from '../modal/modal.component';
import { TableComponent } from '../table/table.component';
import { CapitalizeFirstPipe } from '../../capitalize-first.pipe';

@Component({
  selector: 'app-dish',
  imports: [FormComponent, ModalComponent, TableComponent],
  providers: [CurrencyPipe, TitleCasePipe, CapitalizeFirstPipe],
  templateUrl: './dish.component.html',
  styleUrl: './dish.component.scss'
})
export class DishComponent implements OnInit {
  private createDish = inject(CreateService);
  private getDishes = inject(GetAllService);
  private deleteDish = inject(DeleteService);
  private updateDish = inject(UpdateService);
  private formBuilder = inject(FormBuilder);
  private getMenus = inject(GetAllService);
  private currencyPipe = inject(CurrencyPipe);
  private titleCasePipe = inject(TitleCasePipe);
  private capitalizeFirstPipe = inject(CapitalizeFirstPipe);
  private getMenuName = inject(GetNameService);

  public isOpen: boolean = false;
  public message: string = '';
  public action: string = 'Crear';
  public title: string = 'Crear Plato';
  public dishes: IDishes[] = [];
  public columns = [
    { field: 'name', header: 'Nombre' },
    { field: 'description', header: 'Descripcion' },
    { field: 'price', header: 'Precio' },
    { field: 'dishType', header: 'Tipo de Plato' },
    { field: 'menuName', header: 'Menu' }
  ];
  public form: FormGroup = this.formBuilder.group({
    id: [null],
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: ['', [Validators.required, Validators.min(0)]],
    menuId: ['', [Validators.required]]
  });
  private menuOptions: IOptions[] = [];
  public controls: IControls[] = [
    { type: 'input', text: 'Nombre', inputType: 'text', controlName: 'name' },
    { type: 'input', text: 'Descripcion', inputType: 'text', controlName: 'description' },
    { type: 'input', text: 'Precio', inputType: 'number', controlName: 'price' },
    {
      type: 'select', text: 'Menu', controlName: 'menuId',
      options: []
    }
  ];
  private url: string = 'http://localhost:8080/api/dishes';

  ngOnInit(): void {
    this.submit();
    this.getDishesTable();

    this.getMenus.execute<IMenus[]>('http://localhost:8080/api/menus')
      .pipe(
        map(result => result.map(menu => ({ value: menu.id, name: menu.name })))
      )
      .subscribe(options => {
        this.menuOptions = options;
        this.updateMenuOptions();
      });
  }

  public openModal(event: boolean) {
    this.isOpen = event;
  }

  public getDishesTable(): void {
    this.getDishes.execute<IDishes[]>(this.url)
    .pipe(
      map(result => result.map(dish => this.getMenuName.getMenuNameForDish('http://localhost:8080/api/menus', dish.id).pipe(
        map(menu => ({ 
          ...dish, 
          name: this.capitalizeFirstPipe.transform(dish.name),
          description: this.capitalizeFirstPipe.transform(dish.description),
          menuName: this.capitalizeFirstPipe.transform(menu?.name), 
          menuId: menu?.id, 
          price: this.currencyPipe.transform(dish.price, 'COP'),

         }))
      ))),
      mergeMap(result => forkJoin(result)),
    ).subscribe(result => this.dishes = result);
  }

  public deleteDishById(dishId: number): void {
    this.deleteDish.execute<IResponse>(this.url + "/" + dishId)
      .pipe(
        tap(() => this.getDishesTable())
      ).subscribe();
  }

  public updateById(dishId: number): void {
    this.message = '';
    this.action = 'Actualizar';
    this.title = 'Actualizar Plato';
    const dish = this.dishes.find(user => user.id === dishId);

    this.form.patchValue({
      id: dishId,
      name: dish?.name,
      description: dish?.description,
      price: dish?.price,
      menuId: dish?.menuId
    });
  }

  public submit(): void {
    if (this.form.value.id === null) {
      this.create();
    }
    else {
      this.update(this.form.value.id);
    }
  }

  private create(): void {
    if (this.form.valid) {
      this.createDish.execute<IResponse>(this.url, this.form.getRawValue() as unknown as IDish)
        .pipe(
          tap(result => {
            this.message = result.message;
            this.getDishesTable();
          }),
          delay(2000),
          finalize(() => {
            this.message = '';
            this.getDishesTable();
            this.form.reset();
            this.isOpen = false;
          })
        ).subscribe();
    }
  }

  private update(dishId: number): void {
    if (this.form.valid) {
      this.updateDish.execute<IResponse>(this.url + "/" + dishId, this.form.getRawValue() as unknown as IDish)
        .pipe(
          tap(result => this.message = result.message),
          delay(2000),
          finalize(() => {
            this.message = '';
            this.getDishesTable();
            this.action = 'Crear';
            this.title = 'Crear Plato';
            this.form.reset();
            this.isOpen = false;
          })
        ).subscribe();
    }
  }

  private updateMenuOptions() {
    const menuControl = this.controls.find(control => control.controlName === 'menuId');
    if (menuControl) {
      menuControl.options = this.menuOptions;
    }
  }
}