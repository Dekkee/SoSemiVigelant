import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchAucsIfNeeded } from '../actions'
import Auctions from '../components/Auctions'

class App extends Component {
    static propTypes = {
        aucs: PropTypes.array.isRequired,
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number,
        dispatch: PropTypes.func.isRequired
    }

    componentDidMount() {
        const { dispatch } = this.props
        console.log('didMount');
        console.log(this.props);
        dispatch(fetchAucsIfNeeded(this.props))
    }

    componentWillReceiveProps(nextProps) {
        if (/*nextProps.selectedReddit !== this.props.selectedReddit*/true) {
            const { dispatch } = nextProps
            dispatch(fetchAucsIfNeeded(this.props))
        }
    }

    render () {
        const { aucs, isFetching, lastUpdated } = this.props
        const isEmpty = !!aucs && aucs.length === 0
        return (
            <main>
                <header>
                    <h1>React TODO!1</h1>
                </header>

                <section className="aucs">
                    {isEmpty
                        ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
                        : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                            <Auctions aucs={aucs} />
                        </div>
                    }
                </section>
            </main>
        )
    }
}

const mapStateToProps = state => {
  const { getAucs } = state
  const {
    isFetching,
    lastUpdated,
    items: aucs
  } = getAucs['data'] || {
    isFetching: true,
    items: []
  }

  return {
    aucs,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)