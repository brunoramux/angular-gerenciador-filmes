import { Component, computed, inject, signal } from '@angular/core';
import { email, form, minLength, required, Field } from '@angular/forms/signals';
import { UserApi } from '../../../../core/services/user-api';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ILoginParams } from '../../models/login-params';
import { HttpErrorResponse } from '@angular/common/http';
import { setErrorMessage } from '../../../../shared/utils/set-error-message';

@Component({
  selector: 'app-login-form',
  imports: [Field],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private readonly _userApi = inject(UserApi);
  private readonly _router = inject(Router);
  loginModel = signal({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.email, { message: 'E-mail obrigatório.' });
    email(fieldPath.email, { message: 'E-mail inválido.' });

    required(fieldPath.password, { message: 'Senha obrigatória.' });
    minLength(fieldPath.password, 8, { message: 'A senha deve ter no mínimo 8 caracteres.' });
  });

  // QUANDO ACIONO O BOTAO DE LOGIN, A FUNÇÃO LOGIN É CHAMADA. O SIGNAL LOGINPARAMS É ALTERADO LOGO O LOGINRESOURCE SERÁ ACIONADO, REALIZANDO A CHAMADA A API. O SIGNAL LOGIN ERROR É DO TIPO COMPUTED, OU SEJA, É UM SIGNAL QUE OBSERVA OUTRO SIGNAL, NO CASO O LOGINRESOURCE, SENDO RESPONSÁVEL POR COLETAR QUALQUER ERRO RETORNADO PARA MOSTRAR EM TELA.
  loginParams = signal<ILoginParams | undefined>(undefined);

  loginResource = rxResource({
    params: () => this.loginParams(),
    stream: ({ params }) =>
      this._userApi
        .login(params.email, params.password)
        .pipe(tap(() => this._router.navigate(['/explore']))),
  });

  isButtonDisabled = computed(() => {
    return this.loginForm().invalid();
  });

  loginError = computed(() => {
    const error = this.loginResource.error();
    if (error) {
      return setErrorMessage(error);
    } else {
      return '';
    }
  });

  login() {
    const credentials = this.loginForm().value();

    this.loginParams.set(credentials);
  }
}
