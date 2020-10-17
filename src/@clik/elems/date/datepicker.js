import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fucss } from 'next-fucss/utils';

export default (props) => {
  const { date, time } = props;

  return (
    <div key="data" className={classNameContainer()}>
      {
        props.type === 'time'
          ? null
          : <React.Fragment>
            <span className="p:10px-5px w:100pc">
              <div className={classNameDate()}
                onMouseDown={props.onMouseDown({ type: 'days', down: true })}
                onMouseUp={props.onMouseUp}>
                <FontAwesomeIcon className="ta:c" icon="chevron-up" />
              </div>
              <div className={classNameValue()}>{date.dd}</div>
              <div className={classNameDate()}
                onMouseDown={props.onMouseDown({ type: 'days' })}
                onMouseUp={props.onMouseUp}>
                <FontAwesomeIcon className="ta:c" icon="chevron-down" />
              </div>
            </span>
            <span className="p:10px-5px w:100pc">
              <div className={classNameDate()}
                onMouseDown={props.onMouseDown({ type: 'months', down: true })}
                onMouseUp={props.onMouseUp}>
                <FontAwesomeIcon className="ta:c" icon="chevron-up" />
              </div>
              <div className={classNameValue()}>{date.mm}</div>
              <div className={classNameDate()}
                onMouseDown={props.onMouseDown({ type: 'months' })}
                onMouseUp={props.onMouseUp}>
                <FontAwesomeIcon icon="chevron-down" />
              </div>
            </span>
            <span className="p:10px-5px w:100pc">
              <div className={classNameDate()}
                onMouseDown={props.onMouseDown({ type: 'years', down: true })}
                onMouseUp={props.onMouseUp}>
                <FontAwesomeIcon icon="chevron-up" />
              </div>
              <div className={classNameValue()}>{date.yyyy}</div>
              <div className={classNameDate()}
                onMouseDown={props.onMouseDown({ type: 'years' })}
                onMouseUp={props.onMouseUp}>
                <FontAwesomeIcon icon="chevron-down" />
              </div>
            </span>
          </React.Fragment>
      }

      {props.type === 'date'
        ? null
        : <React.Fragment>
          {/* <div className="p:1px ps:ab m-rl:15px bg:sec h:100pc" /> */}
          <div className="p:1px bg:grey200 m-rl:5px"/>
          <span className="p:10px-5px w:100pc">
            <div className={classNameDate()}
              onMouseDown={props.onMouseDown({ type: 'hours', down: true })}
              onMouseUp={props.onMouseUp}>
              <FontAwesomeIcon icon="chevron-up" />
            </div>
            <div className={classNameValue()}>{time.hours}</div>
            <div className={classNameDate()}
              onMouseDown={props.onMouseDown({ type: 'hours' })}
              onMouseUp={props.onMouseUp}>
              <FontAwesomeIcon icon="chevron-down" />
            </div>
          </span>

          <span className="p:10px-5px w:100pc">
            <div className={classNameDate()}
              onMouseDown={props.onMouseDown({ type: 'minutes', down: true })}
              onMouseUp={props.onMouseUp}>
              <FontAwesomeIcon icon="chevron-up" />
            </div>
            <div className={classNameValue()}>{time.minutes}</div>
            <div className={classNameDate()}
              onMouseDown={props.onMouseDown({ type: 'minutes' })}
              onMouseUp={props.onMouseUp}>
              <FontAwesomeIcon icon="chevron-down" />
            </div>
          </span>
        </React.Fragment>
      }
    </div>)
}

const classNameContainer = () => fucss({
  // 'bg:tert ta:c dp:flx jc:sb w:100pc': true,
  'dp:flx jc:sb ta:c ps:ab l,b:0 bd:1px-sld-grey200 br:2px w:100pc bg:grey100': true
})

const classNameDate = () => fucss({
  'c:grey300 ac-scl:1.3 crs:pt fs:90pc ta:c lh:1 p:5px': true
})

const classNameLine = () => fucss({
  'bg:grey200 w:100pc p-t:1px lh:1 m-tb:6px': false
})

const classNameValue = () => fucss({
  'fw:800 fs:115pc bg:grey200 lh:1 p:7px m:3px br:2px c:sec': true
})
