import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { IClient, IClients } from '../../interfaces/client.interface';
import { IResponse } from '../../interfaces/response.interface';
import { CreateService } from '../../services/create.service';
import { DeleteService } from '../../services/delete.service';
import { GetAllService } from '../../services/get-all.service';
import { UpdateService } from '../../services/update.service';
import { FormComponent } from "../form/form.component";
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-client',
  imports: [FormComponent, TableComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit {
  private createClient = inject(CreateService);
  private getClients = inject(GetAllService);
  private deleteClient = inject(DeleteService);
  private updateClient = inject(UpdateService);
  private formBuilder = inject(FormBuilder);

  public message: string = '';
  public action: string = '';
  public title: string = '';

  private url: string = 'http://localhost:8080/api/clients';

  public users: IClients[] = [];
  public columns = [
    {field: 'name', header: 'Nombre'},
    {field: 'lastName', header: 'Apellido'},
    {field: 'email', header: 'Correo'},
    {field: 'userType', header: 'Tipo de Usuario'}
  ];

  public isOpen: boolean = false;

  openModal(event: boolean) {
    this.isOpen = event;
  }

  public form: FormGroup = this.formBuilder.group({
    id: [null],
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  
  ngOnInit(): void {
    this.submit();
    this.getClientsTable();
  }

  create(): void {
    this.action = 'Crear';
    this.title = 'Crear Cliente';

    if (this.form.valid) {
      this.createClient.execute<IResponse>(this.url, this.form.getRawValue() as unknown as IClient)
        .pipe(
          tap(result => {
            this.message = result.message;
            this.getClientsTable();
            this.action = 'Crear';
            this.title = 'Crear Cliente';
          })
        ).subscribe(console.log);
    }
  }

  getClientsTable(): void {
    this.getClients.execute<IClients[]>(this.url)
      .pipe(
        tap(result => this.users = result)
      ).subscribe();
  }

  deleteClientById(clientId: number): void {
    this.deleteClient.execute<IResponse>(this.url + "/" + clientId)
      .pipe(
        tap(result => this.getClientsTable())
      ).subscribe();
  }

  updateById(clientId: number): void {
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

  update(clientId: number): void {
    if (this.form.valid) {
      this.updateClient.execute<IResponse>(this.url + "/" + clientId, this.form.getRawValue() as unknown as IClient)
        .pipe(
          tap(result => {
            this.message = result.message;
            this.getClientsTable();
            this.action = 'Actualizar';
            this.title = 'Actualizar Cliente';
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
