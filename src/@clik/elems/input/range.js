import { Component } from 'react'

const LEFT = 'LEFT'
const RIGHT = 'RIGHT'
export default class extends Component {
  render() {
    const { mode, value, stats, min = 0, max = 100, name } = this.props
    const { percentageLeft, percentageRight } = this.state
    // console.log({ value, name, mode });
    return (
      <div className="ps:rl p:7px-0px w:100pc dp:bk">
        <div
          className="ta:l bg:sec600 p:2px"
          id="bar"
          onClick={e => {
            mode === 'multiple' ? (e.clientX < e.target.getBoundingClientRect().width / 2 + e.target.getBoundingClientRect().left ? this.calcPercentage(e, e.clientX, LEFT, true, mode) : this.calcPercentage(e, e.clientX, RIGHT, true, mode)) : this.calcPercentage(e, e.clientX, LEFT, true, mode)
          }}>
          {mode === 'single' ? <div className="bg:tert w:30pc p:3px m:0 ts:w" style={{ width: percentageLeft + '%' }} /> : <div className="bg:tert w:30pc p:3px m:0 ts:all" style={{ width: percentageRight - percentageLeft + '%', marginLeft: percentageLeft + '%' }} />}
        </div>
        <span draggable={true} onTouchStart={e => this.calcPercentage(e, e.touches[0].pageX, LEFT, false, mode, true)} onTouchMove={e => this.calcPercentage(e, e.touches[0].pageX, LEFT, false, mode, true)} onTouchEnd={e => this.calcPercentage(e, this.state.leftX, LEFT, true, mode, true)} onDragStart={e => e.dataTransfer.setDragImage(document.createElement('img'), 0, 0)} onDrag={e => this.calcPercentage(e, e.clientX, LEFT, false, mode)} onDragEnd={e => this.calcPercentage(e, e.clientX, LEFT, true, mode)} className="br:50pc bg:prim ps:ab t:0 trl:50npc ts:all bs:2 w,h,lh:25px ta:c fs:75pc fw:800" style={{ left: `calc(${percentageLeft > 90 ? '90' : percentageLeft}% + 10px)` }}>
          {this.state.value}
        </span>
        {mode === 'multiple' && (
          <span draggable={true} onTouchStart={e => this.calcPercentage(e, e.touches[0].pageX, RIGHT, false, mode, true)} onTouchMove={e => this.calcPercentage(e, e.touches[0].pageX, RIGHT, false, mode, true)} onTouchEnd={e => this.calcPercentage(e, this.state.rightX, RIGHT, true, mode, true)} onDragStart={e => e.dataTransfer.setDragImage(document.createElement('img'), 0, 0)} onDrag={e => this.calcPercentage(e, e.clientX, RIGHT, false, mode)} onDragEnd={e => this.calcPercentage(e, e.clientX, RIGHT, true, mode)} className="br:50pc bg:prim ps:ab t:0 trl:50npc ts:all bs:2 w,h,lh:25px ta:c fs:75pc fw:800" style={{ left: `calc(${percentageRight}% - 10px)` }}>
            {value || percentageRight || max}
          </span>
        )}
        {stats && (
          <div className="fs:80pc mrg-t:10px fw:900">
            {mode === 'multiple' && <span className="fl:l">{this.percentageToValue(percentageLeft)}</span>}
            <span className="fl:r">{mode === 'single' ? this.state.value : this.percentageToValue(percentageRight)}</span>
          </div>
        )}
      </div>
    )
  }

  constructor(props) {
    super(props)

    const minRange = props.min || 0
    const maxRange = props.max || 100
    const value = props.value || minRange

    this.state = {
      minRange,
      maxRange,
      value,
      percentageLeft: this.valueToPercentage(value || minRange, maxRange, minRange),
      percentageRight: this.valueToPercentage(value || maxRange, maxRange, minRange),
      leftX: 0,
      rightX: 0
    }
    this.baseState = this.state
  }

  componentDidMount() {
    this.props.rangeMethods &&
      this.props.rangeMethods({
        resetRange: () => this.setState(this.baseState),
        valueToPercentage: this.valueToPercentage
      })
  }

  percentageToValue = percentage => {
    const { minRange, maxRange } = this.state

    return parseInt(((maxRange - minRange) / 100) * percentage + minRange)
  }

  valueToPercentage = (value, maxRange, minRange) => {
    return ((value - minRange) / maxRange) * 100
  }

  calcPercentage = (e, bubbleX, pos, callAction = false, mode = 'single', isTouch = false) => {
    // console.log({ mode })

    //throttles the state changes by
    if (!isTouch)
      if (callAction !== true)
        if (this.state.delay) return
        else setTimeout(() => this.setState({ delay: false }), 40)

    let bar = document.getElementById('bar').getBoundingClientRect()
    let state = {
      ...this.state,
      delay: !isTouch && true
    }
    // console.log(state.percentageLeft)
    let perc = pos === LEFT ? state.percentageLeft : state.percentageRight

    pos === LEFT ? (state.leftX = bubbleX) : (state.rightX = bubbleX)

    if (bubbleX < bar.left) perc = 0
    else if (bubbleX > bar.right) perc = 100
    else perc = parseInt(((bubbleX - bar.left) * 100) / bar.width)

    if (mode === 'multiple') {
      pos === LEFT && perc >= state.percentageRight && (perc = state.percentageRight - 10)
      pos === RIGHT && perc <= state.percentageLeft && (perc = state.percentageLeft + 10)
    }

    pos === LEFT
      ? (state = {
          ...state,
          percentageLeft: perc,
          value: this.percentageToValue(perc)
        })
      : (state = {
          ...state,
          percentageRight: perc
        })

    this.setState(state)

    // console.log(state.value)

    const value = mode === 'multiple' ? { min: state.percentageLeft, max: state.percentageRight } : this.percentageToValue(state.percentageLeft)

    // console.log({ value });
    // console.log(callAction)
    callAction && this.props.action && this.props.action(value, this.props)
  }
}
