import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cnpj',
    standalone: true,
})
export class CnpjPipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '-';

        const numbers = value.replace(/\D/g, '');

        return numbers.replace(
            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/,
            '$1.$2.$3/$4-$5'
        );
    }

}

@Pipe({
    name: 'cpf',
    standalone: true,
})
export class CpfPipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '-';

        const numbers = value.replace(/\D/g, '');

        return numbers.replace(
            /^(\d{3})(\d{3})(\d{3})(\d{2}).*/,
            '$1.$2.$3-$4'
        );
    }

}

@Pipe({
    name: 'phone',
    standalone: true,
})
export class PhonePipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '-';

        const numbers = value.replace(/\D/g, '');

        if (numbers.length === 11) {
            return numbers.replace(
                /^(\d{2})(\d{5})(\d{4}).*/,
                '($1) $2-$3'
            );
        }

        if (numbers.length === 10) {
            return numbers.replace(
                /^(\d{2})(\d{4})(\d{4}).*/,
                '($1) $2-$3'
            );
        }

        return value;
    }
}

@Pipe({
    name: 'cep',
    standalone: true,
})
export class CepPipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '-';

        const numbers = value.replace(/\D/g, '');

        return numbers.replace(
            /^(\d{5})(\d{3}).*/,
            '$1-$2'
        );
    }

}