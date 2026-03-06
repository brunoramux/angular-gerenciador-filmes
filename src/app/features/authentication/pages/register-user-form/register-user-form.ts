import { Component, computed, inject, signal } from '@angular/core';
import { email, Field, form, minLength, required, validate } from '@angular/forms/signals';
import { IRegisterParams } from '../../models/register-params';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserApi } from '../../../../core/services/user-api';
import { setErrorMessage } from '../../../../shared/utils/set-error-message';

@Component({
  selector: 'app-register-user-form',
  imports: [Field],
  templateUrl: './register-user-form.html',
  styleUrl: './register-user-form.css',
})
export class RegisterUserForm {
  private readonly _userApi = inject(UserApi);

  registerModel = signal<IRegisterParams>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  registerForm = form(this.registerModel, (fieldPath) => {
    required(fieldPath.name, { message: 'O Nome é obrigatório.' });

    required(fieldPath.email, { message: 'O E-mail é obrigatório.' });
    email(fieldPath.email, { message: 'O E-mail está inválido.' });

    required(fieldPath.password, { message: 'A Senha é obrigatória.' });
    minLength(fieldPath.password, 8, { message: 'A Senha deve ter no minímo 8 caracteres.' });

    validate(fieldPath.confirmPassword, ({ value, valueOf }) => {
      const confirmPassword = value();
      const password = valueOf(fieldPath.password);

      if (confirmPassword != password) {
        return {
          kind: 'confirmPassword',
          message: 'As senhas devem ser iguais',
        };
      }

      return null;
    });
  });

  registerParams = signal<IRegisterParams | undefined>(undefined);
  registerResource = rxResource({
    params: () => this.registerParams(),
    stream: ({ params }) => this._userApi.register(params.name, params.email, params.password),
  });

  registerError = computed(() => {
    const error = this.registerResource.error();
    if (error) {
      return setErrorMessage(error);
    } else {
      return '';
    }
  });

  isButtonDisabled = computed(() => {
    return this.registerForm().invalid();
  });

  successMessage = computed(() => {
    const SUCCESS_REGISTRATION = this.registerResource.hasValue();

    return SUCCESS_REGISTRATION ? 'Usuário cadastrado com sucesso!' : undefined;
  });

  register() {
    const userInfo = this.registerForm().value();
    this.registerParams.set(userInfo);
  }
}
