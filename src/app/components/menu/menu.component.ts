import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay, finalize, tap } from 'rxjs';
import { IControls } from '../../interfaces/controls.interface';
import { IMenu, IMenus } from '../../interfaces/menu.interface';
import { IResponse } from '../../interfaces/response.interface';
import { CreateService } from '../../services/create.service';
import { DeleteService } from '../../services/delete.service';
import { GetAllService } from '../../services/get-all.service';
import { UpdateService } from '../../services/update.service';
import { FormComponent } from '../form/form.component';
import { ModalComponent } from '../modal/modal.component';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-menu',
  imports: [FormComponent, ModalComponent, TableComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  private createMenu = inject(CreateService);
  private getMenus = inject(GetAllService);
  private deleteMenu = inject(DeleteService);
  private updateMenu = inject(UpdateService);
  private formBuilder = inject(FormBuilder);

  public message: string = '';
  public action: string = '';
  public title: string = '';

  private url: string = 'http://localhost:8080/api/menus';

  public menus: IMenus[] = [];
  public columns = [
    {field: 'name', header: 'Nombre'},
    {field: 'description', header: 'Descripcion'},
  ];

  public isOpen: boolean = false;

  openModal(event: boolean) {
    this.isOpen = event;
  }

  public form: FormGroup = this.formBuilder.group({
    id: [null],
    name: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });

  public controls: IControls[] = [
    {type: 'input', text: 'Nombre', inputType: 'text', controlName: 'name'},
    {type: 'input', text: 'Descripcion', inputType: 'text', controlName: 'description'}
  ];

  
  ngOnInit(): void {
    this.submit();
    this.getMenusTable();
  }

  create(): void {
    this.action = 'Crear';
    this.title = 'Crear Menu';

    if (this.form.valid) {
      this.createMenu.execute<IResponse>(this.url, this.form.getRawValue() as unknown as IMenu)
        .pipe(
          tap(result => {
            this.message = result.message;
            this.getMenusTable();
            this.action = 'Crear';
            this.title = 'Crear Menu';
          }),
          delay(2000),
          finalize(() => {
            this.isOpen = false;
          })
        ).subscribe(console.log);
    }
  }

  getMenusTable(): void {
    this.getMenus.execute<IMenus[]>(this.url)
      .pipe(
        tap(result => this.menus = result)
      ).subscribe();
  }

  deleteMenuById(menuId: number): void {
    this.deleteMenu.execute<IResponse>(this.url + "/" + menuId)
      .pipe(
        tap(result => this.getMenusTable())
      ).subscribe();
  }

  updateById(menuId: number): void {
    this.message = '';
    this.action = 'Actualizar';
    this.title = 'Actualizar Menu';
    const menu = this.menus.find(menu => menu.id === menuId);

    this.form.patchValue({
      id: menuId,
      name: menu?.name,
      description: menu?.description
    });
  }

  update(menuId: number): void {
    if (this.form.valid) {
      this.updateMenu.execute<IResponse>(this.url + "/" + menuId, this.form.getRawValue() as unknown as IMenu)
        .pipe(
          tap(result => this.message = result.message),
          delay(2000),
          finalize(() => {
            this.message = '';
            this.getMenusTable();
            this.action = 'Crear';
            this.title = 'Crear Menu';
            this.form.reset();
            this.isOpen = false;
          })
        ).subscribe(console.log);
    }
  }

  submit(): void {
    console.log(this.form.value.id);
    if (this.form.value.id === null) {
      this.create();
    }
    else {
      this.update(this.form.value.id);
    }
  }
}
