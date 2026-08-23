export function toDisplayText(value?: string | number | null): string {
  if (value === null || value === undefined) {
    return '-';
  }

  return String(value).trim() || '-';
}

export function toFormText(value?: string | number | null): string {
  return toDisplayText(value) === '-' ? '' : String(value).trim();
}
