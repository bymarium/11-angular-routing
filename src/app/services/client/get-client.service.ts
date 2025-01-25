import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetClientService {
  private http = inject(HttpClient);

  execute(client: IClient): Observable<IResponse> {
    return this.http.post<IResponse>('http://localhost:8080/api/clients', client, { headers: this.getHeaders() });
  }

  private getHeaders() {
    return new HttpHeaders()
    .append('Content-Type', 'application/json')
  }
}
