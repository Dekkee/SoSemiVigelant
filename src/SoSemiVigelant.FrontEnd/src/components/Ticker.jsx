import React from 'react';

import moment from 'moment';
require("moment-duration-format");

class Ticker extends React.Component {
    constructor(props) {
        super(props);

        this._interval = 1000;

        this.state = {
            running: true,
            ticks: moment.duration(props.initialTime / 10000)
        };

        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(this.tick, this._interval);
    }

    tick() {
        if (this.state.running) {
            this.setState({
                ticks: moment.duration(this.state.ticks - this._interval)
            });
        } else {
            this.setState({
                running: false,
                ticks: 0
            });
        }
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
        const time = this.format(this.state.ticks);

        return (
            <div className="ticker">{time}</div>
        );
    }
}

export default Ticker;