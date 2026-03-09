import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUserTokenSuccessAuthResponse } from '../../shared/models/user-token-success-auth-response';
import { IUserLoginSuccessResponse } from '../../shared/models/user-login-success-response';
import { tap } from 'rxjs';
import { UserTokenStore } from './user-token-store';
import { IUserRegisterSuccessResponse } from '../../shared/models/user-register-success-response';
import { UserInfo } from './user-info';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private readonly _httpClient = inject(HttpClient);
  private readonly _userTokenStore = inject(UserTokenStore);
  private readonly _userInfo = inject(UserInfo);

  validateToken() {
    return this._httpClient
      .get<IUserTokenSuccessAuthResponse>('http://localhost:3000/users/validate-token')
      .pipe(
        tap(({ id, name, email }) => {
          this._userInfo.setUserInfo({
            id,
            name,
            email,
          });
        }),
      );
  }

  login(email: string, password: string) {
    return this._httpClient
      .post<IUserLoginSuccessResponse>('http://localhost:3000/users/login', {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this._userTokenStore.saveToken(response.token);
        }),
      );
  }

  register(name: string, email: string, password: string) {
    return this._httpClient.post<IUserRegisterSuccessResponse>('http://localhost:3000/users', {
      name,
      email,
      password,
    });
  }
}
