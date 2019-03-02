import * as React from 'react';
import * as classNames from 'classnames';

import { AuctionItem } from '../AuctionItem';
import { AuctionListControls } from '../AuctionListControls';

import { connect } from '../../utils/connect';
import { actions } from '../../actions/auctions';
import { selector } from '../../selectors/auctions';
import { IAuction, IAuctionsListRequest } from '../../api/contracts';
import { Action } from 'redux';

import './AuctionList.scss';

type IProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    searchText?: string;
}

interface IDispatchProps {
    loadAuctions?: (request: IAuctionsListRequest) => Action;
}

interface IStateProps {
    items?: IAuction[];
    lastUpdated?: number;
    page?: number;
    perPage?: number;
    sortOrder?: string;
    sortDirection?: boolean;
    count?: number;
    isFetching?: boolean;
    isActive?: boolean;
}

interface IState {
    columns: {
        name: string;
        label: string;
    }[]
}

const mapStateToProps = (state): IStateProps => ({
    isActive: true,
    ...selector(state)
});

const mapDispatchToProps: IDispatchProps = {
    loadAuctions: actions.fetch.init,
};

@connect<IStateProps, IDispatchProps>(mapStateToProps, mapDispatchToProps)
export class AuctionList extends React.Component<IProps, IState> {

    constructor (props) {
        super(props);

        this.state = {
            columns: [
                {
                    name: 'name',
                    label: 'Название'
                },
                {
                    name: 'estimated',
                    label: 'До конца'
                },
                {
                    name: 'currentBid',
                    label: 'Ставка'
                }
            ]
        };
    }

    componentDidMount () {
        const { loadAuctions, page, perPage, sortOrder, sortDirection, searchText, isActive } = this.props;
        loadAuctions({
            page,
            perPage,
            sortOrder,
            sortDirection,
            searchText,
            isActive,
        });
    }

    handlePageChange (page) {
        const { loadAuctions, sortOrder, sortDirection, perPage, searchText, isActive } = this.props;
        loadAuctions({
            page,
            perPage,
            sortOrder,
            sortDirection,
            searchText,
            isActive,
        });
    }

    handlePageSizeChange (perPage) {
        const { loadAuctions, sortOrder, sortDirection, page, searchText, isActive } = this.props;
        loadAuctions({
            page,
            perPage,
            sortOrder,
            sortDirection,
            searchText,
            isActive,
        });
    }

    handleSearchTextChange (searchText) {
        const { loadAuctions, sortOrder, sortDirection, page, perPage, isActive } = this.props;
        loadAuctions({
            page,
            perPage,
            sortOrder,
            sortDirection,
            searchText,
            isActive,
        });
    }

    handleSort (obj) {
        const { loadAuctions, sortOrder, page, sortDirection, perPage, searchText, isActive } = this.props;
        let direction = true;

        if (sortOrder === obj) {
            direction = !sortDirection;
        }

        loadAuctions({
            page,
            perPage,
            sortOrder: obj,
            sortDirection: direction,
            searchText,
            isActive,
        });
    }

    render () {
        const { items, isFetching, lastUpdated, count, page, perPage, sortOrder, sortDirection } = this.props;
        const isEmpty = !!items && items.length === 0;
        const { columns } = this.state;
        return (
            <div>
                <div className="auctionList">
                    <AuctionListControls
                        count={count}
                        page={page}
                        pageSize={perPage}
                        onPageSizeChanged={this.handlePageSizeChange.bind(this)}
                        onPageChanged={this.handlePageChange.bind(this)}
                        onSearchTextChange={this.handleSearchTextChange.bind(this)}
                        showSearchInput={true}/>

                    <div className="auctionList-header">
                        {
                            columns.map((column, i) => {
                                const cn = classNames(
                                    'auctionList-header-item',
                                    `auctionList-header-item-${column.name}`,
                                    `auction-column-${column.name}`,
                                    {
                                        'sort-by': sortOrder === column.name && sortDirection,
                                        'sort-by-desc': sortOrder === column.name && !sortDirection
                                    }
                                );
                                return <span className={cn} onClick={() => this.handleSort(column.name)}
                                             key={i}>{column.label}</span>;
                            })
                        }
                    </div>
                    {
                        isFetching && isEmpty
                            ? <h2 className="loading">Loading...</h2> :
                            isEmpty ? <h2>Empty.</h2>
                                :
                                <div className="auctionList-body" style={{ opacity: isFetching ? 0.5 : 1 }}>
                                    {items.map((auction, i) =>
                                        <AuctionItem {...auction} key={i}/>
                                    )}
                                </div>
                    }
                    <AuctionListControls
                        count={count}
                        page={page}
                        pageSize={perPage}
                        onPageSizeChanged={this.handlePageSizeChange.bind(this)}
                        onPageChanged={this.handlePageChange.bind(this)}/>
                </div>
            </div>
        );
    }
}
