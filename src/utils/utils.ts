import { IncomingMessage } from 'http';
import { RequestOptions } from 'https';
import requestAxios from './request.axios';

import { TCieloTransactionInterface, TErrorGeneric } from '../domain/IAdapter';

export class Utils {
    private cieloConstructor: TCieloTransactionInterface;

    constructor(params: TCieloTransactionInterface) {
        this.cieloConstructor = params;
    }

    public get<T>(params: { path: string }): Promise<T | TErrorGeneric> {
        const hostname: String | any = this.cieloConstructor.hostnameQuery;
        const { path } = params;
        const method = HttpRequestMethodEnum.GET;

        const options: IHttpRequestOptions = this.getHttpRequestOptions({
            path,
            hostname,
            method,
        });
        return this.request<T>(options, {});
    }

    public postToSales<T, U>(data: U): Promise<T | TErrorGeneric> {
        return this.post<T, U>({ path: '/1/sales/' }, data).then(
            (onSuccess: any) => {
                const { paymentId }: any = onSuccess?.payment;
                return this.put<T, U>(
                    { path: `/1/sales/${paymentId}/capture` },
                    data,
                )
                    .then(capture => {
                        console.log('postToSales :: ok');
                        return { ...onSuccess, capture };
                    })
                    .catch(error => {
                        console.log('postToSales :: error');
                        return error;
                    });
            },
        );
    }

    /**
     * Realiza um post na API da Cielo
     * @param params path do post
     * @param data payload de envio
     */
    public post<T, U>(
        params: { path: string },
        data: U,
    ): Promise<T | TErrorGeneric> {
        const { path } = params;
        const options: IHttpRequestOptions = this.getHttpRequestOptions({
            method: HttpRequestMethodEnum.POST,
            path,
            hostname: this.cieloConstructor.hostnameTransacao,
        });

        return this.request<T>(options, data);
    }

    /**
     * Realiza um put na API da Cielo
     * @param params path do put
     * @param data payload de envio
     */
    public async put<T, U>(
        params: { path: string },
        data?: U,
    ): Promise<T | TErrorGeneric> {
        const { path } = params;
        const options: IHttpRequestOptions = this.getHttpRequestOptions({
            method: HttpRequestMethodEnum.PUT,
            path,
            hostname: this.cieloConstructor.hostnameTransacao,
        });
        const resp: any = await this.request<T>(options, data);

        console.log(9858585, resp);

        return resp;
    }

    public getHttpRequestOptions(params: {
        hostname: string;
        path: string;
        method: HttpRequestMethodEnum;
    }): IHttpRequestOptions {
        return {
            method: params.method,
            path: params.path,
            hostname: params.hostname,
            port: 443,
            encoding: 'utf-8',
            headers: {
                MerchantId: this.cieloConstructor.merchantId,
                MerchantKey: this.cieloConstructor.merchantKey,
                RequestId: params.method || '',
                'Content-Type': 'application/json',
            },
        } as IHttpRequestOptions;
    }

    public request<T>(options: IHttpRequestOptions, data: any): Promise<T> {
        return new Promise(async resolve =>
            resolve(requestAxios(data, options)),
        );
    }

    public validateJSON(text: string): boolean {
        return (
            !/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
                text.replace(/"(\\.|[^"\\])*"/g, ''),
            ) && eval('(' + text + ')')
        );
    }

    
}

export enum HttpRequestMethodEnum {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
}

export interface IHttpRequestOptions extends RequestOptions {
    method: HttpRequestMethodEnum;
    path: string;
    hostname: string;
    headers: any;
    encoding: string;
    port: number;
}

export interface IHttpRequestReject {
    statusCode: string;
    request: string;
    response: IncomingMessage;
}

/**
 * Interface com dados que serão retornados em todas as requisições
 */
export interface IHttpResponse {
    statusCode: number;
    statusMessage: string;
    data?: any;
}
