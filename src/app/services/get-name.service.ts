import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IClients } from '../interfaces/client.interface';
import { IMenus } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class GetNameService {
  private http = inject(HttpClient);

  execute<T>(url: string): Observable<T> {
    return this.http.get<T>(url, { headers: this.getHeaders() });
  }

  private getHeaders() {
    return new HttpHeaders()
    .append('Content-Type', 'application/json')
  }

  getMenuNameForDish(menuUrl: string, dishId: number): Observable<IMenus | undefined> {
    return this.execute<IMenus[]>(menuUrl).pipe(
      map(menus => {
        return menus.find(menu => menu.dishes?.some(dish => dish.id === dishId));
      })
    );
  }

  getClientNameForOrder(clientUrl: string, orderId: number): Observable<IClients | undefined> {
    return this.execute<IClients[]>(clientUrl).pipe(
      map(clients => {
        return clients.find(client => client.orders?.some(client => client.id === orderId));
      })
    );
  }
}
