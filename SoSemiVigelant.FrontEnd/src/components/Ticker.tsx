import * as React from 'react';
import * as moment from 'moment';
import 'moment-duration-format';
import { Duration } from 'moment';
import 'moment/locale/ru';

export interface IProps {
    initialTime: Date;
    className?: string;
}

interface IState {
    ticks: Duration;
}

type DurationWithFormat = Duration & { format: (str: string) => string };

export class Ticker extends React.Component<IProps, IState> {
    private readonly _interval = 1000;
    private timer: number | null = null;

    constructor (props: IProps) {
        super(props);

        this.state = {
            ticks: moment.duration(moment(props.initialTime).diff(moment.now()))
        };
    }

    componentDidMount () {
        this.timer = window.setInterval(this.tick.bind(this), this._interval);
    }

    componentWillReceiveProps (nextProps: IProps) {
        if (this.props !== nextProps) {
            this.setState({
                ticks: moment.duration(moment(new Date(nextProps.initialTime)).diff(moment.now()))
            });
        }
    }

    componentWillUnmount () {
        clearInterval(this.timer!);
        this.timer = null;
    }

    tick () {
        this.setState({
            ticks: this.state.ticks.subtract(1, 'seconds')
        });
    }

    format (duration: DurationWithFormat): string {
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

    render () {
        const { ticks } = this.state;

        return (
            ticks.milliseconds() > 0
                ? <div className="ticker">{ this.format(ticks as DurationWithFormat) }</div>
                : 'Завершен'
        );
    }
}
