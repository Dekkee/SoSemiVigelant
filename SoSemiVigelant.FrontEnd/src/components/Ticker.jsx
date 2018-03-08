import React from 'react';

import moment from 'moment';

require("moment-duration-format");

class Ticker extends React.Component {
    constructor(props) {
        super(props);

        this._interval = 1000;

        this.state = {
            ticks: moment.duration(new Date(props.initialTime) - new Date())
        };

        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, this._interval);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState({ticks: moment.duration(new Date(nextProps.initialTime) - new Date())})
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }

    tick() {
        this.setState({
            ticks: moment.duration(this.state.ticks - this._interval)
        });
    }

    format(duration) {
        if (duration.asDays() > 5) {
            return duration.format('d [дней]');
        } else if (duration.asDays() > 2) {
            return duration.format('d [дня]');
        } else if (duration.asDays() > 1) {
            return duration.format('d [день]');
        } else if (duration.asHours() > 1) {
            return duration.format('d[дней] h[ч] mm[м]');
        } else {
            return duration.format('h[ч] mm[м] ss[с]');
        }
    }

    render() {
        const {ticks} = this.state;
        const time = this.format(ticks);

        return (
            ticks > 0
                ? <div className="ticker">{time}</div>
                : 'Завершен'
        );
    }
}

export default Ticker;
