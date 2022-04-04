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
