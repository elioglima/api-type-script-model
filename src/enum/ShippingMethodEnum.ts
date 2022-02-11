export enum EnumShippingMethod {
    SameDay = 'SameDay', //	Meio de entrega no mesmo dia
    OneDay = 'OneDay', //	Meio de entrega no próximo dia
    TwoDay = 'TwoDay', //	Meio de entrega em dois dias
    ThreeDay = 'ThreeDay', //	Meio de entrega em três dias
    LowCost = 'LowCost', //	Meio de entrega de baixo custo
    Pickup = 'Pickup', //	Retirada na loja
    Other = 'Other', //	Outro meio de entrega
    None = 'None', //	Sem meio de entrega, pois é um serviço ou assinatura
}
