import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fucss } from 'next-fucss/utils';

export default (props) => {
  const { month, year, daysInMonth, firstDay, selectedDays } = props;

  const mm = new Date().getMonth();
  const yyyy = new Date().getFullYear();

  const daysOfWeek = daysInWeek.map(day => (
    <span key={day} className="p-tb:10px ta:c c:white" style={{ width: `calc(100% / 7)` }}>
      {day}
    </span>
  ));

  return (
    <div className="mxw:400px">
      <header className="dp:flx bg:sec p:10px ta:c">
        <div onMouseDown={props.previousYear(month, year)}><FontAwesomeIcon icon="angle-double-left" /></div>
        <div onMouseDown={props.previous(month, year)}><FontAwesomeIcon icon="angle-left" /></div>
        <div className="c:white fs:100pc ls:2px fs:90pc w:60pc">
          <span className="fw:900">{monthsInYear[month]}</span> <span>{year}</span>
        </div>
        <div onMouseDown={props.next(month, year)} ><FontAwesomeIcon icon="angle-right" /></div>
        <div onMouseDown={props.nextYear(month, year)}><FontAwesomeIcon icon="angle-double-right" /></div>
      </header>

      <div className="w:100pc bg:seca5 ta:c">
        <div className="fs:70pc fw:600">
          {daysOfWeek}
        </div>

        <div className="ta:l h:195px">
          {Array.from(Array(42)).map((d, i) => {
            const day = i + 1 - firstDay;
            const dayStr = i >= firstDay && day <= daysInMonth ? day : false;
            const today = new Date();
            let isActive;

            if (selectedDays && selectedDays.length === 2) {
              isActive = dayStr >= selectedDays[0] && dayStr <= selectedDays[1];
            } else if (day) {
              isActive = props.day === day && props.month === mm && props.year === yyyy;
            } else {
              isActive = !!(day === today.getDate() && month === today.getMonth());
            }

            return (dayStr > 0 && dayStr <= daysInMonth) && <span
              // onMouseDown={props.onPickDown(day)}
              // onMouseUp={props.onPickUp}
              key={i}
              onClick={props.onClick(day)}
              className={classNameToday(isActive)} style={{ width: `calc(100% / 7)` }}>
              {dayStr || ''}
            </span>
          })}
        </div>
      </div>

    </div>
  )
}

const classNameToday = (isActive) => fucss({
  'db:ib p-tb:10px ta:c ta:l crs:pt ': true,
  'bg:prim br:2px': isActive,
});

const monthsInYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
