import { HttpErrorResponse } from '@angular/common/http';

export function getApiErrorMessage(
  error: HttpErrorResponse,
  fallback = 'Erro ao processar a solicitação.',
): string {
  return typeof error.error?.message === 'string' ? error.error.message : fallback;
}
