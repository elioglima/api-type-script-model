export enum EnumCartCategory {
    Yes = 'Yes', // Em caso de divergência entre endereços de cobrança e entrega, atribui risco baixo ao pedido
    No = 'No', // Em caso de divergência entre endereços de cobrança e entrega, atribui risco alto ao pedido (default)
    Off = 'Off', // Diferenças entre os endereços de cobrança e entrega não afetam a pontuação
}
