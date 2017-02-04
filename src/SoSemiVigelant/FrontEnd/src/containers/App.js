import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchAucsIfNeeded } from '../actions'

class App extends Component {
    static propTypes = {
        aucs: PropTypes.array.isRequired,
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number,
        dispatch: PropTypes.func.isRequired
    }

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(fetchAucsIfNeeded())
    }

    componentWillReceiveProps(nextProps) {
        if (/*nextProps.selectedReddit !== this.props.selectedReddit*/true) {
            const { dispatch } = nextProps
            dispatch(fetchAucsIfNeeded())
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