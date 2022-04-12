export const rGeneric = (
    response: {
        message: string;
        rows?: [];
        row?: Object;
        [x: string]: any;
    },
    err: boolean = false,
    abortProcess: boolean = false,
) => {
    return {
        err,
        abortProcess,
        data: {
            ...response,
            ...(err
                ? {
                      messageError: err
                          ? response?.message || 'unexpected error'
                          : undefined,
                  }
                : { message: response.message }),
        },
    };
};

export const rError = (response: { message: string; [x: string]: any }) => {
    return rGeneric(response, true, true);
};

export const rSuccess = (
    response: { message: string; [x: string]: any },
    abortProcess: boolean = false,
) => {
    return rGeneric({ ...response }, false, abortProcess);
};

export const defaultReturnMessage = (code: string) => {
    if ([51, '51', 116, '116', 121, '121', 'A5'].includes(code)) {
        return {
            code: 7,
            message: 'Problemas com o Cartão de Crédito',
        };
    }
    if ([54, '54', 6, '06', 101, '101', 'BV'].includes(code)) {
        return {
            code: 3,
            message: 'Cartão Expirado',
        };
    }
    if ([41, '41', 200, '200', 'FD', 43, '43', 78, '78'].includes(code)) {
        return {
            code: 4,
            message: 'Cartão Bloqueado',
        };
    }

    if (['77', 77].includes(code)) {
        return {
            code: 6,
            message: 'Cartão Cancelado',
        };
    }

    if (['00', 0, '0', 4, '4', '04'].includes(code)) {
        return {
            code: 1,
            message: 'Autorizada',
        };
    }

    return {
        code: 2,
        message: 'Não Autorizada',
    };
};
