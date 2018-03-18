interface IUser {
    name: string;
    refs: number;
}

interface IAuction {
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
