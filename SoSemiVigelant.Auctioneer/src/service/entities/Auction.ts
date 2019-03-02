export interface AuctionEntity {
    id: number;
    lot: string;
    date_estimated: Date;
    image: string;
    start_bid: number;
    current_bid: number;
    bid_amount: number;
    shipping_info_quick: string;
    shipping_info: string;
    bin_value: number;
    date_published: Date;
    thumb_is_generic: boolean;
    with_post: boolean;
    city: string;
    seller_ip: string;
    seller: string;

    [index: string]: any;
}
