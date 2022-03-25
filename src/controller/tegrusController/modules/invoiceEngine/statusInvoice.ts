const statusInvoice = async (toReceive: any) => {
    try {
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
                statusInvoice: {
                    ...toReceive.statusInvoice,
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

export { statusInvoice };
