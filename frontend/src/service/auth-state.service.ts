import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthStateService {
  private loggedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('user'));
  public logged$ = this.loggedSubject.asObservable();

  setLogged(status: boolean) {
    this.loggedSubject.next(status);
  }

  isLogged(): boolean {
    return this.loggedSubject.value;
  }
}
