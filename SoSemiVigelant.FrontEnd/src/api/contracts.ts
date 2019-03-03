export interface User {
    name: string;
    refs: number;
}

export interface Auction {
    id: number;
    name: string;
    startBid: number;
    currentBid: number;
    bidAmount: number;
    estimated: Date;
    city: string;
    shippingInfoShort: string;
    shippingInfo: string;
    seller: User;
    description: string;
}

export interface AuctionsListRequest {
    perPage?: number;
    page?: number;
    sortOrder?: string;
    sortDirection?: boolean;
    searchText?: string;
    isActive?: boolean;
}

export interface AuctionsListResponse {
    values: Auction[],
    count: number,
    receivedAt: number
}

export interface AuctionInfoRequest {
    id: number;
}

export interface AuctionInfoResponse {
    id: number;
    auction: Auction,
    receivedAt: number
}
