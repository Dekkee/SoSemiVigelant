import * as React from 'react';
import * as classNames from 'classnames';

import { AuctionItem } from './AuctionItem'
import { AuctionListControls } from './AuctionListControls'

import { fetchAucInfo, fetchAucsIfNeeded } from '../actions/index'
import { connect } from 'react-redux';

type IProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    searchText?: string;
}

interface IDispatchProps {
    loadAucs?: (request: any) => void;
}

interface IStateProps {
    items?: any[];
    lastUpdated?: number;
    page?: number;
    perPage?: number;
    sortOrder?: string;
    sortDirection?: boolean;
    count?: number;
    isFetching?: boolean;
}

interface IState {
    columns: {
        name: string;
        label: string;
    }[]
}

const mapStateToProps: (state) => IStateProps = state => state.auctions;

function mapDispatchToProps (dispatch): IDispatchProps {
    return {
        loadAucs: request => dispatch(fetchAucsIfNeeded(request))
    }
}

@(connect<IStateProps, IDispatchProps>(mapStateToProps, mapDispatchToProps) as any)
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
        const { loadAucs, page, perPage, sortOrder, sortDirection, searchText } = this.props;
        loadAucs({
            page,
            perPage,
            sortOrder,
            sortDirection,
            searchText
        });
    }

    handlePageChange (page) {
        const { loadAucs, sortOrder, sortDirection, perPage, searchText } = this.props;
        loadAucs({
            page,
            perPage,
            sortOrder,
            sortDirection,
            searchText
        });
    }

    handlePageSizeChange (perPage) {
        const { loadAucs, sortOrder, sortDirection, page, searchText } = this.props;
        loadAucs({
            page,
            perPage,
            sortOrder,
            sortDirection,
            searchText
        });
    }

    handleSearchTextChange (searchText) {
        const { loadAucs, sortOrder, sortDirection, page, perPage } = this.props;
        loadAucs({
            page,
            perPage,
            sortOrder,
            sortDirection,
            searchText
        });
    }

    handleSort (obj) {
        const { loadAucs, sortOrder, page, sortDirection, perPage, searchText } = this.props;
        let direction = true;

        if (sortOrder === obj) {
            direction = !sortDirection;
        }

        loadAucs({
            page,
            perPage,
            sortOrder: obj,
            sortDirection: direction,
            searchText
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
                        count={ count }
                        page={ page }
                        pageSize={ perPage }
                        onPageSizeChanged={ this.handlePageSizeChange.bind(this) }
                        onPageChanged={ this.handlePageChange.bind(this) }
                        onSearchTextChange={ this.handleSearchTextChange.bind(this) }
                        showSearchInput={ true }/>

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
                                return <span className={ cn } onClick={ () => this.handleSort(column.name) }
                                             key={ i }>{ column.label }</span>;
                            })
                        }
                    </div>
                    {
                        isFetching && isEmpty
                            ? <h2 className="loading">Loading...</h2> :
                            isEmpty ? <h2>Empty.</h2>
                                :
                                <div className="auctionList-body" style={ { opacity: isFetching ? 0.5 : 1 } }>
                                    { items.map((auc, i) =>
                                        <AuctionItem
                                            { ...auc }
                                            key={ i }/>
                                    ) }
                                </div>
                    }
                    <AuctionListControls
                        count={ count }
                        page={ page }
                        pageSize={ perPage }
                        onPageSizeChanged={ this.handlePageSizeChange.bind(this) }
                        onPageChanged={ this.handlePageChange.bind(this) }/>
                </div>
            </div>
        );
    }
}
