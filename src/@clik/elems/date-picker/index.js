import React, { useState, useEffect } from 'react'
import DatePicker from './date-picker'

const DatePickerComp = ({ showPicker, placeholder, value, onClick }) => {
  const [date, setDate] = useState(value)
  const [day, setDay] = useState()
  const [month, setMonth] = useState()
  const [year, setYear] = useState()

  useEffect(() => {
    const yyyy = new Date(date).getFullYear()
    const dd = new Date(date).getDate()
    const mm = new Date(date).getMonth() + 1

    setDay(dd)
    setMonth(mm)
    setYear(yyyy)
    setDate(`${yyyy}/${mm}/${dd}`)
  }, [date])

  const handleMouseDown = ({ type, down }) => {
    switch (type) {
      case 'days':
        const currentDate = new Date(date)
        const getDate = currentDate.getDate()
        const newDate = new Date(currentDate.setDate(down ? getDate - 1 : getDate + 1))
        let dd = newDate.getDate()
        let newMonth = newDate.getMonth() + 1
        setDay(dd)
        newMonth !== month && setMonth(newMonth)
        setDate(`${newDate.getFullYear()}/${newMonth}/${dd}`)
        onClick(`${newDate.getFullYear()}/${newMonth}/${dd}`)
        break
      case 'months':
        const getMonth = new Date(date).getMonth() + 1
        let mm = down ? getMonth - 1 : getMonth + 1
        let newYear = 0
        if(mm < 1){
          mm = 12; newYear -= 1;
        }

        if(mm > 12){
          mm = 1; newYear += 1;
        }

        setMonth(mm)
        setDate(`${year + newYear}/${mm}/${day}`)
        onClick(`${year + newYear}/${mm}/${day}`)
        break
      case 'years':
        const getYear = new Date(date).getFullYear()
        const yy = down ? getYear - 1 : getYear + 1
        setYear(yy)
        setDate(`${yy}/${month}/${day}`)
        onClick(`${year + newYear}/${mm}/${day}`)
        break
      default:
        break
    }
  }

  const handleAdd = () => {
    if (!date) {
      const new_date = `${year}/${month}/${day}`
      setDate(new_date)
      return onClick(new_date)
    }
    setDate(date)
    onClick(date)
  }

  return (
    <DatePicker
      showPicker={showPicker}
      placeholder={placeholder}
      date={date} setDate={setDate}
      day={day} month={month} year={year}
      handleMouseDown={handleMouseDown}
      handleAdd={handleAdd}
    />
  )
}

export default DatePickerComp
