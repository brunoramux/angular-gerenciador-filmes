import { Injectable, signal } from '@angular/core';
import { IUserInfo } from '../../shared/models/user-info';

@Injectable({
  providedIn: 'root',
})
export class UserInfo {
  private readonly user = signal<IUserInfo | undefined>(undefined);

  userInfo = this.user.asReadonly();
  setUserInfo(user: IUserInfo) {
    this.user.set(user);
  }
}
