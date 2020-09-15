import React, { useState, useEffect } from 'react'
import DatePicker from './date-picker'

export default ({ showPicker, placeholder, value, onClick }) => {
  const [date, setDate] = useState(value)
  const [day, setDay] = useState()
  const [month, setMonth] = useState()
  const [year, setYear] = useState()

  useEffect(() => {
    const timestamp = setTimestamp(date)
    const yyyy = new Date(timestamp).getFullYear()
    const dd = '' + new Date(timestamp).getDate()
    const mm = '' + (new Date(timestamp).getMonth() + 1)

    setDay(setDDMM(dd))
    setMonth(setDDMM(mm))
    setYear(yyyy)
  }, [])

  useEffect(() => {
    const timestamp = setTimestamp(date)
    const yyyy = '' + new Date(timestamp).getFullYear()
    const dd = '' + new Date(timestamp).getDate()
    const mm = '' + (new Date(timestamp).getMonth() + 1)

    setDay(setDDMM(dd))
    setMonth(setDDMM(mm))
    setYear(yyyy)
  }, [date])

  const setDDMM = (randomDDMM) => {
    if (randomDDMM !== 'string') randomDDMM = randomDDMM + ''
    if (randomDDMM.length < 2) return randomDDMM = '0' + randomDDMM
    return randomDDMM
  }

  const setTimestamp = (randomdate) => {
    if (!randomdate) {
      return new Date().getTime()
    };
    const reverse = randomdate.split('/').reverse().join('/')  // '2019-12-30' be able to convert to timestamp
    const timestamp = new Date(reverse).getTime()
    return timestamp
  }

  const handleMouseDown = ({ type, down }) => {
    const timestamp = setTimestamp(date)
    switch (type) {
      case 'days':
        const dd = down
          ? new Date(new Date(timestamp).setDate(new Date(timestamp).getDate() - 1)).getDate()
          : new Date(new Date(timestamp).setDate(new Date(timestamp).getDate() + 1)).getDate()
        const dd_mm = down
          ? new Date(new Date(timestamp).setDate(new Date(timestamp).getDate() - 1)).getMonth() + 1
          : new Date(new Date(timestamp).setDate(new Date(timestamp).getDate() + 1)).getMonth() + 1
        const dd_year = down
          ? new Date(new Date(timestamp).setDate(new Date(timestamp).getDate() - 1)).getFullYear()
          : new Date(new Date(timestamp).setDate(new Date(timestamp).getDate() + 1)).getFullYear()

        setDate(Object.values({ day: setDDMM(dd), month: setDDMM(dd_mm), year: dd_year }).join('/'))
        break
      case 'months':
        let mm = down
          ? new Date(new Date(timestamp).setMonth(new Date(timestamp).getMonth() - 1)).getMonth() + 1
          : new Date(new Date(timestamp).setMonth(new Date(timestamp).getMonth() + 1)).getMonth() + 1
        const mm_year = down
          ? new Date(new Date(timestamp).setMonth(new Date(timestamp).getMonth() - 1)).getFullYear()
          : new Date(new Date(timestamp).setMonth(new Date(timestamp).getMonth() + 1)).getFullYear()
        const mm_dd = down
          ? new Date(new Date(timestamp).setMonth(new Date(timestamp).getMonth() - 1)).getDate()
          : new Date(new Date(timestamp).setMonth(new Date(timestamp).getMonth() + 1)).getDate()

        setDate(Object.values({ day: setDDMM(mm_dd), month: setDDMM(mm), year: mm_year }).join('/'))
        break
      case 'years':
        const yyyy = down ? +year - 1 : +year + 1
        // console.log(year)
        setDate(Object.values({ day, month, year: yyyy }).join('/'))
        break
      default:
        break
    }
  }

  const handleAdd = () => {
    if (!date) {
      const new_date = Object.values({ day, month, year }).join('/')
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
