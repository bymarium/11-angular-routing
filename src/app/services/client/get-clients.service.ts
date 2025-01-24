import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '../../interfaces/response.interface';
import { IClients } from '../../interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class GetClientsService {
  private http = inject(HttpClient);

  execute(): Observable<IClients[]> {
    return this.http.get<IClients[]>('http://localhost:8080/api/clients', { headers: this.getHeaders() });
  }

  private getHeaders() {
    return new HttpHeaders()
    .append('Content-Type', 'application/json')
  }
}
