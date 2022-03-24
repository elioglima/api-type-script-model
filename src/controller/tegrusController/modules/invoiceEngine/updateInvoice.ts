const updateInvoice = async (req: any) => {
    try {
        // retorno do app >> bff >> tegrus
        console.log(req);
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
                // resposta de sucesso
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
