import { Component, signal } from '@angular/core';
import { email, form, minLength, required, Field } from '@angular/forms/signals';

@Component({
  selector: 'app-login-form',
  imports: [Field],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
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
}
