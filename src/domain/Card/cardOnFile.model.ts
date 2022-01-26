export interface CardOnFileModel {
    /**
     * First se o cartão foi armazenado e é seu primeiro uso.
     * Used se o cartão foi armazenado e ele já foi utilizado anteriormente em outra transação
     * Veja Mais - https://developercielo.github.io/faq/faq-api-3-0#pagamento-com-credenciais-armazenadas
     */
    usage?: string;
    reason?: string;
}
