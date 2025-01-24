import { Component, inject, OnInit } from '@angular/core';
import { CreateService } from '../../services/client/create.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IClient, IClients } from '../../interfaces/client.interface';
import { Observable, tap } from 'rxjs';
import { GetClientsService } from '../../services/client/get-clients.service';
import { DeleteService } from '../../services/client/delete.service';
import { UpdateService } from '../../services/client/update.service';
import { TableComponent } from "../table/table.component";

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, TableComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  private createClient = inject(CreateService);
  private getClients = inject(GetClientsService);
  private deleteClient = inject(DeleteService);
  private updateClient = inject(UpdateService);
  private formBuilder = inject(FormBuilder);
  public message!: string;
  public users: IClients[] = [];
  public columns = [
    {field: 'name', header: 'Nombre'},
    {field: 'lastName', header: 'Apellido'},
    {field: 'email', header: 'Correo'},
    {field: 'userType', header: 'Tipo de Usuario'}
  ];

  public form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  submit(): void {
    if (this.form.valid) {
      this.createClient.execute(this.form.getRawValue() as unknown as IClient)
        .pipe(
          tap(result => {
            this.message = result.message;
            this.getClientsTable()
          })
        ).subscribe();
    }
  }

  ngOnInit(): void {
    this.getClientsTable();
  }

  getClientsTable(): void {
    this.getClients.execute()
      .pipe(
        tap(result => this.users = result)
      ).subscribe(console.log);
  }

  deleteClientById(clientId: number): void {
    this.deleteClient.execute(clientId)
      .pipe(
        tap(result => this.getClientsTable())
      ).subscribe(console.log);
  }

  updateClientById(clientId: number): void {
    const client = this.users.find(user => user.id === clientId);

    this.form = this.formBuilder.group({
      name: [client?.name, [Validators.required]],
      lastName: [client?.lastName, [Validators.required]],
      email: [client?.email, [Validators.required, Validators.email]]
    });

    if (this.form.valid) {
      this.updateClient.execute(clientId, this.form.getRawValue() as unknown as IClient)
        .pipe(
          tap(result => {
            this.message = result.message;
            this.getClientsTable()
          })
        ).subscribe();
    }
  }
}
