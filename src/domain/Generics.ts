export type TErrorGeneric = {
    message: string;
    error?: boolean;
    name?: string;
    stack?: string;
    data?: any;
}


export const returnError = (message: string): Promise<TErrorGeneric> => {
    return new Promise<TErrorGeneric>((resolve) => resolve({
        error: true,
        message: message || 'unexpected error did not return message'
    }))
}

export const PromiseExec = <T, U>(data: U): Promise<T | TErrorGeneric> => {
    return new Promise<T | TErrorGeneric>((resolve: any) => resolve(data))
}
