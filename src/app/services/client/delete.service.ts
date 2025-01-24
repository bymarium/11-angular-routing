import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IResponse } from '../../interfaces/response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {
  private http = inject(HttpClient);

  execute(clientId: number): Observable<IResponse> {
    return this.http.delete<IResponse>('http://localhost:8080/api/clients/' + clientId, { headers: this.getHeaders() });
  }

  private getHeaders() {
    return new HttpHeaders()
    .append('Content-Type', 'application/json')
  }
}
