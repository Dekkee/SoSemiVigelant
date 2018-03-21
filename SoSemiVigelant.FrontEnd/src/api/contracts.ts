export interface IUser {
    name: string;
    refs: number;
}

export interface IAuction {
    id: number;
    name: string;
    startBid: number;
    currentBid: number;
    bidAmount: number;
    city: string;
    shippingInfoShort: string;
    shippingInfo: string;
    seller: IUser;
    description: string;
}

export interface IAuctionsListRequest {
    perPage?: number;
    page?: number;
    sortOrder?: string;
    sortDirection?: boolean;
    searchText?: string;
}
