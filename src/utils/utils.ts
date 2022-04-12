import { IncomingMessage } from 'http';
import { RequestOptions } from 'https';
import requestAxios from './request.axios';

import { TCieloTransactionInterface, TErrorGeneric } from '../domain/IAdapter';

export class Utils {
    private cieloConstructor: TCieloTransactionInterface;

    constructor(params: TCieloTransactionInterface) {
        this.cieloConstructor = params;
    }

    public async get<T>(params: { path: string; notContentType?: boolean }) {
        const hostname: String | any = this.cieloConstructor.hostnameQuery;
        const { path, notContentType } = params;
        const method = HttpRequestMethodEnum.GET;        

        const options: IHttpRequestOptions = this.getHttpRequestOptions({
            path,
            hostname,
            method,
            notContentType: notContentType || false,
        });
        
        const response = await this.request<T>(options, {});        

        return response;
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
                        // console.log(paymentId, onSuccess?.payment?.links);
                        // console.log('postToSales :: ok', {
                        //     onSuccess,
                        //     capture,
                        // });
                        return { ...onSuccess, capture };
                    })
                    .catch(error => {
                        console.log('postToSales :: error');
                        return error;
                    });
            },
        );
    }

    /** 33
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

        return resp;
    }

    public getHttpRequestOptions(params: {
        hostname: string;
        path: string;
        method: HttpRequestMethodEnum;
        notContentType?: boolean;
    }): IHttpRequestOptions {
        return {
            method: params.method,
            path: params.path,
            hostname: params.hostname,
            port: 443,
            encoding: 'utf-8',
            timeout: 3000,
            headers: {
                MerchantId: this.cieloConstructor.merchantId,
                MerchantKey: this.cieloConstructor.merchantKey,
                // RequestId: params.method || '',
                ...(params?.notContentType == true
                    ? {}
                    : { 'Content-Type': 'application/json' }),
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
