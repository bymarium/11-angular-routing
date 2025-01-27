import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay, finalize, map, tap } from 'rxjs';
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
import { CapitalizeFirstPipe } from '../../capitalize-first.pipe';

@Component({
  selector: 'app-menu',
  imports: [FormComponent, ModalComponent, TableComponent],
  providers: [CapitalizeFirstPipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  private createMenu = inject(CreateService);
  private getMenus = inject(GetAllService);
  private deleteMenu = inject(DeleteService);
  private updateMenu = inject(UpdateService);
  private formBuilder = inject(FormBuilder);
  private capitalizeFirstPipe = inject(CapitalizeFirstPipe);

  public isOpen: boolean = false;
  public message: string = '';
  public action: string = 'Crear';
  public title: string = 'Crear Menu';
  public menus: IMenus[] = [];
  public columns = [
    {field: 'name', header: 'Nombre'},
    {field: 'description', header: 'Descripcion'},
  ];
  public form: FormGroup = this.formBuilder.group({
    id: [null],
    name: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });
  public controls: IControls[] = [
    {type: 'input', text: 'Nombre', inputType: 'text', controlName: 'name'},
    {type: 'input', text: 'Descripcion', inputType: 'text', controlName: 'description'}
  ];
  private url: string = 'http://localhost:8080/api/menus';

  ngOnInit(): void {
    this.submit();
    this.getMenusTable();
  }
  
  public openModal(event: boolean) {
    this.isOpen = event;
  }

  public getMenusTable(): void {
    this.getMenus.execute<IMenus[]>(this.url)
      .pipe(
        map(result => result.map(menu => ({ 
          ...menu, 
          name: this.capitalizeFirstPipe.transform(menu.name),
          description: this.capitalizeFirstPipe.transform(menu.description)
         }))),
        tap(result => this.menus = result)
      ).subscribe();
  }

  public deleteMenuById(menuId: number): void {
    this.deleteMenu.execute<IResponse>(this.url + "/" + menuId)
      .pipe(
        tap(() => this.getMenusTable())
      ).subscribe();
  }

  public updateById(menuId: number): void {
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
      this.createMenu.execute<IResponse>(this.url, this.form.getRawValue() as unknown as IMenu)
        .pipe(
          tap(result => {
            this.message = result.message;
            this.getMenusTable();
          }),
          delay(2000),
          finalize(() => {
            this.message = '';
            this.getMenusTable();
            this.form.reset();
            this.isOpen = false;
          })
        ).subscribe();
    }
  }

  private update(menuId: number): void {
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
}