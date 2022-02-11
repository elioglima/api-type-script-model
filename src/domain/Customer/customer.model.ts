import { AddressModel } from './address.model';

export interface CustomerModel {
    name?: string;
    status?: string;
    identity?: string;
    identityType?: string;
    email?: string;
    birthdate?: string;
    address?: AddressModel;
    deliveryAddress?: AddressModel;
    phone?: string;
    [x: string]: any;
}
