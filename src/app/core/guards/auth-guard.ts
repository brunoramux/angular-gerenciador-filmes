import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserTokenStore } from '../services/user-token-store';
import { UserApi } from '../services/user-api';
import { catchError, map, of } from 'rxjs';

// INTERCEPTOR GUARD PARA PROTEGER ROTAS QUE REQUEREM AUTENTICAÇÃO
// MaybeAsync<GuardResult> RETORNA URL TREE, PORTANTO PODEMOS RETORNA UM DIRECIONAMENTO PARA OUTRA URL. PODE RETORNAR TAMBEM UM BOOLEAN ONDE TRUE INDICA ROTA AUTENTICADA COM SUCESSO E FALSE REDIRECIONA PARA PÁGINA DE LOGIN.

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): MaybeAsync<GuardResult> => {
  const userTokenStore = inject(UserTokenStore);
  const userApi = inject(UserApi);
  const router = inject(Router);

  // CRIA URL PARA DIRECIONAMENTO A PÁGINA DE LOGIN, NO CASO DE USUÁRIO NÃO LOGADO OU TOKEN INVALIDO
  const loginRoute = router.createUrlTree(['/auth/login']);

  const HAS_TOKEN = userTokenStore.hasToken();

  if (!HAS_TOKEN) {
    return loginRoute;
  }

  return userApi.validateToken().pipe(
    map(() => true),
    catchError(() => {
      userTokenStore.removeToken();
      return of(loginRoute);
    }),
  );
};
