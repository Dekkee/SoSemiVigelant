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
    estimated: Date;
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

export interface IAuctionsListResponse {
    values: IAuction[],
    count: number,
    receivedAt: number
}

export interface IAuctionInfoRequest {
    id: number;
}

export interface IAuctionInfoResponse {
    id: number;
    auction: IAuction,
    receivedAt: number
}
