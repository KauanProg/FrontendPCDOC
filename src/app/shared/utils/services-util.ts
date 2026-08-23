import { HttpParams } from "@angular/common/http";

export const createParams = (params?: Record<string, any>): HttpParams => {
    let httpParams = new HttpParams();

    if (!params) {
        return httpParams;
    }

    Object.keys(params).forEach((key) => {
        const value = params[key];

        if (
            value !== null &&
            value !== undefined &&
            value !== ''
        ) {
            if (Array.isArray(value)) {
                value.forEach((item) => {
                    httpParams = httpParams.append(key, item);
                });

                return;
            }

            httpParams = httpParams.set(key, value);
        }
    });

    return httpParams;
}