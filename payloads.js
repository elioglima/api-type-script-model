const contractCancelPayload = {
    contractCancel: {
        residentId: 143,
        description: 'Contrato cancelado',
        unitId: 341,
        enterpriseId: 2,
        finishDate: 1648581143000,
        timestamp: 1648581143584,
    },
};

const issuedInvoice = {
    createInvoice: {
        invoiceId: 452,
        apartmentId: 341,
        residentId: 143,
        enterpriseId: 2,
        stepValue: 0,
        value: 15000,
        condominium: 3000,
        discount: 0,
        tax: 2000,
        refund: 500,
        expense: 800,
        fine: 0,
        fineTicket: 0,
        commission: 0,
        startReferenceDate: 1646092800000,
        endReferenceDate: 1648684800000,
        dueDate: 1648782000000,
        description: undefined,
        anticipation: false,
        firstPayment: false,
        type: 'rent',
        paymentMethod: 'credit',
        statusInvoice: 'issued',
        timestamp: 1648581143584,
    },
};

const createResident = {
    createResident: {
        id: 143,
        apartmentId: 341,
        enterpriseId: 2,
        contractCode: '56234112',
        startDateContract: 1644883200000,
        endDateContract: 1676419200000,
        resident: {
            name: 'João da Silva',
            nationality: 'Brasileiro',
            nickname: undefined,
            email: 'joaodasilva@teste.com',
            birthDate: '1987-05-23',
            smartphone: '+5511985842431',
            documentType: 'CPF',
            document: '63023231001',
            description: undefined,
        },
        invoice: {
            invoiceId: 452,
            apartmentId: 341,
            residentId: 143,
            enterpriseId: 2,
            stepValue: 0,
            value: 15000,
            condominium: 3000,
            discount: 0,
            tax: 2000,
            refund: 500,
            expense: 800,
            fine: 0,
            fineTicket: 0,
            commission: 0,
            startReferenceDate: 1646092800000,
            endReferenceDate: 1648684800000,
            dueDate: 1648782000000,
            description: undefined,
            anticipation: false,
            firstPayment: true,
            type: 'booking',
            paymentMethod: 'credit',
            statusInvoice: 'issued',
        },
        timestamp: 1648581143584,
    },
};

const updatedInvoice = {
    updateInvoice: {
        invoiceId: 452,
        apartmentId: 341,
        residentId: 143,
        enterpriseId: 2,
        stepValue: 0,
        value: 15000,
        condominium: 3000,
        discount: 0,
        tax: 2000,
        refund: 500,
        expense: 800,
        fine: 0,
        fineTicket: 0,
        commission: 0,
        startReferenceDate: 1646092800000,
        endReferenceDate: 1648684800000,
        dueDate: 1648782000000,
        description: undefined,
        anticipation: false,
        firstPayment: false,
        type: 'spot',
        paymentMethod: 'credit',
        statusInvoice: 'issued',
        timestamp: 1648581143584,
    },
};

const externalPayment = {
    externalPayment: {
        invoiceId: 452,
        description: 'Fatura paga em boleto externo ao app',
        paidAt: 1648581143584,
        paymentMethod: 'ticket',
        statusInvoice: 'paid',
    },
};
