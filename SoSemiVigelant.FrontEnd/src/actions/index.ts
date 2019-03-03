import { getJson, getQuery, getTakeSkipQuery } from '../api/core';
import {
    AuctionInfoRequest,
    AuctionInfoResponse,
    AuctionsListRequest,
    AuctionsListResponse
} from '../api/contracts';

export const fetchAucs = async (props: AuctionsListRequest): Promise<AuctionsListResponse> => {
    const paging = props.perPage ?
        getTakeSkipQuery(props.perPage, props.page) : { full: 'true' };

    const params = {
        ...paging,
        order: props.sortOrder,
        asc: Boolean(props.sortDirection),
        name: props.searchText,
        isActive: props.isActive
    };

    const json = await getJson(`auctions?${getQuery(params)}`);
    return {
        values: json.result,
        count: json.count,
        receivedAt: Date.now()
    };
};

export const fetchAucInfo = async ({ id }: AuctionInfoRequest): Promise<AuctionInfoResponse> => {
    const json = await getJson(`auctions/${id}`);
    return {
        id,
        auction: json,
        receivedAt: Date.now()
    };
};
