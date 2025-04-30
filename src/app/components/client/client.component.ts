import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, delay, EMPTY, finalize, map, tap } from 'rxjs';
import { IClient, IClients } from '../../interfaces/client.interface';
import { IControls } from '../../interfaces/controls.interface';
import { IResponse } from '../../interfaces/response.interface';
import { CreateService } from '../../services/create.service';
import { DeleteService } from '../../services/delete.service';
import { GetAllService } from '../../services/get-all.service';
import { UpdateService } from '../../services/update.service';
import { FormComponent } from "../form/form.component";
import { ModalComponent } from '../modal/modal.component';
import { TableComponent } from '../table/table.component';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-client',
  imports: [FormComponent, ModalComponent, TableComponent],
  providers: [TitleCasePipe],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit {
  private createClient = inject(CreateService);
  private getClients = inject(GetAllService);
  private deleteClient = inject(DeleteService);
  private updateClient = inject(UpdateService);
  private formBuilder = inject(FormBuilder);
  private titleCasePipe = inject(TitleCasePipe);

  public isOpen: boolean = false;
  public message: string = '';
  public messageColor: string = '';
  public action: string = 'Crear';
  public title: string = 'Crear Cliente';
  public users: IClients[] = [];
  public columns = [
    {field: 'name', header: 'Nombre'},
    {field: 'lastName', header: 'Apellido'},
    {field: 'email', header: 'Correo'},
    {field: 'userType', header: 'Tipo de Usuario'},
    {field: 'quantity', header: 'Cantidad de pedidos'}
  ];
  public form: FormGroup = this.formBuilder.group({
    id: [null],
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });
  public controls: IControls[] = [
    {type: 'input', text: 'Nombre', inputType: 'text', controlName: 'name'},
    {type: 'input', text: 'Apellido', inputType: 'text', controlName: 'lastName'},
    {type: 'input', text: 'Correo', inputType: 'email', controlName: 'email'}
  ];
  private url: string = 'http://localhost:8080/api/clients';
 
  ngOnInit(): void {
    this.submit();
    this.getClientsTable();
  }

  public openModal(event: boolean) {
    this.isOpen = event;
  }

  public getClientsTable(): void {
    this.getClients.execute<IClients[]>(this.url)
      .pipe(
        map(result => result.map(client => ({ 
          ...client, 
          name: this.titleCasePipe.transform(client.name),
          lastName: this.titleCasePipe.transform(client.lastName),
          quantity: client.orders?.length || 0 
         }))),
        tap(result => this.users = result)
      ).subscribe();
  } 

  public deleteClientById(clientId: number): void {
    this.deleteClient.execute<IResponse>(this.url + "/" + clientId)
      .pipe(
        tap(() => this.getClientsTable())
      ).subscribe();
  }

  public updateById(clientId: number): void {
    this.message = '';
    this.action = 'Actualizar';
    this.title = 'Actualizar Cliente';
    const client = this.users.find(user => user.id === clientId);

    this.form.patchValue({
      id: clientId,
      name: client?.name,
      lastName: client?.lastName,
      email: client?.email
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
      this.createClient.execute<IResponse>(this.url, this.form.getRawValue() as unknown as IClient)
        .pipe(
          tap(result => {
            this.message = result.message;
            this.messageColor = 'green';
            this.getClientsTable();
          }),
          delay(2000),
          catchError((error) => {
            this.message = error?.error?.message;
            this.messageColor = 'red';
            return EMPTY;
          }),
          finalize(() => {
            setTimeout(() => {
              if (this.messageColor == "green") {
                this.message = '';  
                this.getClientsTable();  
                this.form.reset();  
                this.isOpen = false; 
              }
            }, 3000);
          })
        ).subscribe();
    }
  }

  private update(clientId: number): void {
    if (this.form.valid) {
      this.updateClient.execute<IResponse>(this.url + "/" + clientId, this.form.getRawValue() as unknown as IClient)
        .pipe(
          tap(result => {
            this.message = result.message;
            this.messageColor = 'green';
          }),
          delay(2000),
          catchError((error) => {
            this.message = error?.error?.message;
            this.messageColor = 'red';
            return EMPTY;
          }),
          finalize(() => {
            if (this.messageColor == "green") {
              setTimeout(() => {
                this.message = '';
                this.getClientsTable();
                this.action = 'Crear';
                this.title = 'Crear Cliente';
                this.form.reset();
                this.isOpen = false;
              }, 3000);
            }
          })
        ).subscribe();
    }
  }
}