import { TErrorGeneric, returnError, PromiseExec } from '../../../domain/Generics'

/*

*/

type reqCreateHash = {
    invoiceId: number,
    url?: any
}

type resCreateHash = {
    invoiceId: number,
    link?: string,
    hash?: string
}

const createHash = (data: reqCreateHash): Promise<resCreateHash | TErrorGeneric> => {
    try {
        const hash: string = 'hash 512 base64'
        return PromiseExec({
            invoiceId: data.invoiceId,
            link: `https://payment.jfl?h=${hash}`,
            hash: hash,
        });
    } catch (error: any) {
        return returnError(error?.message);
    }

}

export { createHash }