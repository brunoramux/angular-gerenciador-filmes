import { HttpErrorResponse } from '@angular/common/http';

export const setErrorMessage = (error: Error | undefined) => {
  const cause = error?.cause as HttpErrorResponse;

  if (!cause) {
    return '';
  }

  if (cause.error.message) {
    return cause.error.message as string;
  }

  return 'Erro inesperado!';
};
