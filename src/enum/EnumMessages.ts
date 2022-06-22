export const EnMessages = {
    Error: {
        InvoiceIsPaid: {
            status: 422,
            errorCode: 'I0001',
            code: 6,
            message: 'invoice is already paid',
        },
        InvoiceNotFound: {
            status: 422,
            errorCode: 'I0002',
            code: 6,
            message: 'invoice not found in database',
        },
        InvoiceIsExpired: {
            status: 422,
            errorCode: 'I0003',
            code: 7,
            message: 'invoice is expired',
        },
        InvoiceStatusChangeExpired: {
            errorCode: 'I0004',
            code: 10,
            message: 'Invoice status changed to expired, due date expired',
        },
        InvoiceCannotBePaid: {
            status: 422,
            errorCode: 'I0005',
            code: 9,
            message: 'invoice with updated status, cannot be paid',
        },
        InvoiceTypeNotImplemented: {
            status: 422,
            errorCode: 'I0006',
            code: 9,
            message: 'type not implemented for payment',
        },

        ResidentNotFound: {
            status: 422,
            errorCode: 'R0001',
            message: 'resident not found in database, unexpected error',
        },

        HashNotFount: {
            status: 422,
            errorCode: 'HS0001',
            message: 'Hash not found',
        },

        HashDecodingFailed: {
            status: 422,
            errorCode: 'HS0002',
            message: 'Hash decoding failed',
        },

        CardNotFound: {
            status: 422,
            errorCode: 'C0001',
            message: 'Card not found in database',
        },

        UnexpectedError: {
            status: 422,
            errorCode: 'UE0001',
            message: 'Card not found in database',
        },
    },
};
