import { Component, Fragment } from 'react';

import DatePicker from './datepicker';
import Calendar from './calendar';

export default class extends Component {
  render() {
    const date = getDate(this.state.date);
    // const { time } = getTime(this.state.date);

    // console.log({ props: this.props, focus: this.props.focus })

    return (
      <Fragment>
        {this.props.type !== 'calendar'
          ? <DatePicker
            {...this.props}
            date={date}
            time={this.state.time}
            onMouseUp={this.handleMouseUp.bind(this)}
            onMouseDown={this.handleMouseDown.bind(this)} />
          : <Calendar
            {...this.state}
            next={this.next.bind(this)}
            previous={this.previous.bind(this)}
            nextYear={this.nextYear}
            previousYear={this.previousYear}
            // onPickUp={this.pickUpSingleDay.bind(this)}
            // onPickDown={this.pickMultipleDay}
            onClick={this.handleSingleDay} />
        }
      </Fragment>
    )
  }

  constructor(props) {
    super(props);

    const currentDate = props.date || props.value;
    let dateStr;

    // console.log({ currentDate })

    if(props.type === 'date')
      dateStr = currentDate && currentDate.split('/').reverse().join('/');

    if(props.type === 'datetime') {
      // const timer = currentDate && currentDate.split(' ').reverse().shift().split(' ').join(':')
      const timeStr = currentDate && currentDate.split(' ').pop();
      // console.log({timeStr})
      dateStr = currentDate && currentDate.split(' ').shift().split('/').reverse().join('/') + ' ' + timeStr;
    }

    // console.log({dateStr})

    const date = dateStr && new Date(dateStr) || new Date();

    // console.log({date})

    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const currentDay  = date.getDate();
    const time = getTime(date)

    this.state = {
      calendar: null,
      date: date.getTime(),
      time: time,
      day: currentDay,
      month: currentMonth,
      year: currentYear,
      firstDay: (new Date(currentYear, currentMonth)).getDay(),
      daysInMonth: 32 - new Date(currentYear, currentMonth, 32).getDate(),
      selectedDays: props.range || []
    }

  }

  componentWillMount() {
    const now = new Date();
    let dd = '' + now.getDate();
    let mm = '' + (now.getMonth() + 1);
    const yyyy = '' + now.getFullYear();
    let hh = '' + now.getHours();
    let min = '' + now.getMinutes();

    if (dd.length < 2) dd = '0' + dd;
    if (mm.length < 2) mm = '0' + mm;
    if (hh.length < 2) hh = '0' + hh;
    if (min.length < 2) min = '0' + min;

    let date = getDate(this.state.date) || {dd, mm, yyyy};
    let time = this.state.time || {hh, min};

    if (this.props.type === 'datetime') {
      const datetime = Object.values(date).join('/') + ' ' + Object.values(time).join(':');
      return this.props.action && this.props.action(datetime, this.props);
    }
  }

  handleMouseUp() {
    clearTimeout(this.timer);
    setTimeout(() => {
      const date = getDate(this.state.date);
      const time = getTime(this.state.date);
      let dateStr;

      if (this.props.type === 'datetime') {
        dateStr = Object.values(date).join('/') + ' ' + Object.values(time).join(':');
        // console.log({ dateStr })
        this.setState({ time: { hours: time.hours, minutes: time.minutes } })
        return this.props.action && this.props.action(dateStr, this.props);
      }

      this.props.action && this.props.action(Object.values(date).join('/'), this.props);
    }, 10);
  }

  handleMouseDown = (method) => e => {
    const date = getNextDate(this.state.date, method);
    this.setState({ date });
    this.loop(method);
  }

  loop(method, speed = 300) {
    this.timer = setTimeout(() => {
      speed = speed / 2 > 50 ? speed / 1.25 : speed;
      const date = getNextDate(this.state.date, method);
      this.setState({ date });
      this.loop(method, speed);
    }, speed)
  }

  handleSingleDay = (day) => () => {
    let dd = day + ''
    let mm = this.state.month + 1 + ''
    const yyyy = this.state.year

    if (mm === 0) mm += 1

    if (mm.length < 2) mm = '0' + mm;
    if (dd.length < 2) dd = '0' + dd;

    const date = dd + "/" + mm + "/" + yyyy;

    this.setState({ calendar: date, day })

    this.props.action && this.props.action(date, this.props)
  }

  pickMultipleDay = (day) => () => {

    // const [ first, second ] = this.state.selectedDays;

    // const isFirst = day < second;
    // const isSecond = day > second;

    // const firstDay = isFirst && day || isSecond && second || first;
    // const secondDay = isFirst && second || day;

    // this.setState(prevState => ({
    //   ...prevState,
    //   selectedDays: [firstDay, secondDay || null]
    // }))
  }

  nextYear = (currentMonth, currentYear) => () => {
    currentYear = currentYear + 1;
    this.renderCalendar(currentMonth, currentYear);
  }

  previousYear = (currentMonth, currentYear) => () => {
    currentYear = currentYear - 1;
    this.renderCalendar(currentMonth, currentYear)
  }

  next = (currentMonth, currentYear) => () => {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    this.renderCalendar(currentMonth, currentYear);
  }

  previous = (currentMonth, currentYear) => () => {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    this.renderCalendar(currentMonth, currentYear);
  }

  renderCalendar(month, year) {

    // Get the starting day of the month
    let firstDay = (new Date(year, month)).getDay();

    // subtract that date from 32, we get the final day of that month
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    this.setState({
      month,
      year,
      firstDay,
      daysInMonth
    })
  }

}

function getTime(timestamp) {
  const timer = new Date(timestamp)

  let hours = '' + timer.getHours();
  let minutes = '' + timer.getMinutes();

  if (hours.length < 2) hours = '0' + hours;
  if (minutes.length < 2) minutes = '0' + minutes;

  return { hours, minutes }
}

function getDate(timestamp) {
  const today = new Date(timestamp);

  let dd = '' + today.getDate();
  let mm = '' + (today.getMonth() + 1);
  const yyyy = today.getFullYear();

  if (mm.length < 2) mm = '0' + mm;
  if (dd.length < 2) dd = '0' + dd;

  return { dd, mm, yyyy }
}

function getNextDate(timestamp, method) {
  const date = timestamp && new Date(timestamp) || new Date();

  if (method.down && method.type === 'days') {
    const day = new Date(date.setDate(date.getDate() + 1));
    return new Date(day).getTime();
  } else if (!method.down && method.type === 'days') {
    const day = new Date(date.setDate(date.getDate() - 1));
    return new Date(day).getTime();
  }

  if (method.down && method.type === 'months') {
    const month = new Date(date.setMonth(date.getMonth() + 1));
    return new Date(month).getTime();
  } else if (!method.down && method.type === 'months') {
    const month = new Date(date.setMonth(date.getMonth() - 1));
    return new Date(month).getTime();
  }

  if (method.down && method.type === 'years') {
    const year = new Date(date.setFullYear(date.getFullYear() + 1));
    return new Date(year).getTime();
  } else if (!method.down && method.type === 'years') {
    const year = new Date(date.setFullYear(date.getFullYear() - 1));
    return new Date(year).getTime();
  }

  if (method.down && method.type === 'hours') {
    const hours = new Date(date.setHours(date.getHours() + 1));
    return new Date(hours).getTime();
  } else if (!method.down && method.type === 'hours') {
    const hours = new Date(date.setHours(date.getHours() - 1));
    return new Date(hours).getTime();
  }

  if (method.down && method.type === 'minutes') {
    const minutes = new Date(date.setMinutes(date.getMinutes() + 1));
    return new Date(minutes).getTime();
  } else if (!method.down && method.type === 'minutes') {
    const minutes = new Date(date.setMinutes(date.getMinutes() - 1));
    return new Date(minutes).getTime();
  }
}
