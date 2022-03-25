const updateInvoice = async (toReceive: any) => {
    try {
        // retorno do app >> bff >> tegrus
        console.log(toReceive);
        /* 

            return {
            err: true,
            data: {
                // resposta de erro
            }
            }

        */
        return {
            err: false,
            data: {
                updateInvoice: {
                    ...toReceive?.updateInvoice,
                    returnOpah: {
                        message: 'success',
                    },
                },
            },
        };
    } catch (error: any) {
        return {
            err: true,
            data: {
                message: error?.message || 'Erro inesperado',
            },
        };
    }
};

export { updateInvoice };
