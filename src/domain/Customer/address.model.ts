export interface AddressModel {
    /**
     * Endereço do Comprador.
     * Número do endereço do Comprador.
     * Complemento do endereço do Comprador.br
     * CEP do endereço do Comprador.
     * Bairro do Comprador.
     * Cidade do endereço do Comprador.
     * Estado do endereço do Comprador.
     * Pais do endereço do Comprador.
     */
    street?: string;
    number?: string;
    complement?: string;
    zipCode?: string;
    district?: string;
    city?: string;
    state?: string;
    country?: string;
}
