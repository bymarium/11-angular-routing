import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IClient } from '../../interfaces/client.interface';
import { Observable } from 'rxjs';
import { IResponse } from '../../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class CreateService {
  private http = inject(HttpClient);

  execute(client: IClient): Observable<IResponse> {
    return this.http.post<IResponse>('http://localhost:8080/api/clients', client, { headers: this.getHeaders() });
  }

  private getHeaders() {
    return new HttpHeaders()
    .append('Content-Type', 'application/json')
  }
}
