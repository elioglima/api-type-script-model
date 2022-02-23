import { IncomingMessage } from 'http';
import { request, RequestOptions } from 'https';
import camelcaseKeys from 'camelcase-keys';
import axios from 'axios';

import {
    TCieloTransactionInterface,
    TErrorGeneric
} from '../domain/IAdapter';

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
        return this.post<T, U>({ path: '/1/sales/' }, data);
    }

    /**
     * Realiza um post na API da Cielo
     * @param params path do post
     * @param data payload de envio
     */
    public post<T, U>(params: { path: string }, data: U): Promise<T | TErrorGeneric> {

        const { path } = params;
        const options: IHttpRequestOptions = this.getHttpRequestOptions({
            method: HttpRequestMethodEnum.POST,
            path,
            hostname: this.cieloConstructor.hostnameTransacao,
        });

        return this.request<T>(options, data);
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

    private parseHttpRequestError(
        _options: IHttpRequestOptions,
        data: string,
        responseHttp: any,
        responseCielo: any,
    ): IHttpRequestReject {
        responseHttp.Code =
            (Array.isArray(responseCielo) &&
                responseCielo[0] &&
                responseCielo[0].Code) ||
            '';
        responseHttp.Message =
            (Array.isArray(responseCielo) &&
                responseCielo[0] &&
                responseCielo[0].Message) ||
            '';
        return {
            statusCode: responseHttp.statusCode || '',
            request: JSON.stringify(data).toString(),
            response: responseHttp,
        } as IHttpRequestReject;
    }

    private parseHttpPutResponse(response: IncomingMessage): IHttpResponse {
        return {
            statusCode: response.statusCode || 0,
            statusMessage: response.statusMessage || '',
        };
    }

    public httpRequest(
        options: IHttpRequestOptions,
        data: any,
    ): Promise<IHttpResponse> {

        const dataPost = JSON.stringify(data)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        return new Promise<IHttpResponse>(async (resolve, reject) => {
            try {

                if (options && options.headers)
                    options.headers['Content-Length'] = Buffer.byteLength(dataPost);

                const response: any = await axios.post(`${options.hostname}/${options.path}`, dataPost,
                    {
                        headers: options.headers
                    });

                // if (
                //     response.statusCode &&
                //     [200, 201].indexOf(response.statusCode) === -1
                // )
                //     return reject(
                //         {
                //             err: true,
                //             data: {
                //                 message: response.message || 'erro inesperado'
                //             }
                //         }
                //     )

                return resolve({
                    ...this.parseHttpPutResponse(response.data),
                    data: camelcaseKeys(response.data, { deep: true }),
                });
            } catch (error) {
                console.log(error)
            }

        });
        // const req = request(options, (res: IncomingMessage) => {
        //     var chunks: string = '';
        //     res.on('data', (chunk: any) => (chunks += chunk));
        //     res.on('end', () => {
        //         const response =
        //             chunks.length > 0 && this.validateJSON(chunks)
        //                 ? JSON.parse(chunks)
        //                 : '';
        //         if (
        //             res.statusCode &&
        //             [200, 201].indexOf(res.statusCode) === -1
        //         )
        //             return reject(
        //                 this.parseHttpRequestError(
        //                     options,
        //                     data,
        //                     res,
        //                     response,
        //                 ),
        //             );
        //         if (options.method === 'PUT' && chunks.length === 0)
        //             return resolve(this.parseHttpPutResponse(res));
        //         return resolve({
        //             ...this.parseHttpPutResponse(res),
        //             data: camelcaseKeys(response, { deep: true }),
        //         });
        //     });
        // });

        // req.write(dataPost);
        // req.on('error', err => reject(err));
        // req.end();
    }


    public request<T>(options: IHttpRequestOptions, data: any): Promise<T> {
        return new Promise(async (resolve, reject) => {

            const dataPost = JSON.stringify(data)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');

            if (options && options.headers)
                options.headers['Content-Length'] = Buffer.byteLength(dataPost);

            const response: any = await axios.post(`${options.hostname}/${options.path}`, dataPost,
                {
                    headers: options.headers
                });


            if (
                response.statusCode &&
                [200, 201].indexOf(response.statusCode) === -1
            )
                return reject(
                    {
                        err: true,
                        data: {
                            message: response.message || 'erro inesperado'
                        }
                    }
                )


            const dataReturn = {
                ...camelcaseKeys(response.data, { deep: true }),
            }

            console.log(dataReturn)
            return resolve(dataReturn);
        });
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
