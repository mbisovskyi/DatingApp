import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = 'https://localhost:5001/api/';
  private currentUserSource = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  login(model: any){
    return this.httpClient.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(model: any) {
    return this.httpClient.post<User>(this.baseUrl + "account/register", model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
