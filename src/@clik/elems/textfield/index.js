import React from 'react'

const TextField = ({ label = '', name, placeholder, value, action }) => {
  const handleKeyUp = e => {
    const val = e.target.value
    const name = e.target.name
    const keyCode = e.keyCode
    val !== '' && keyCode === 13 && action(val, name)
  }

  const handleBlur = e => {
    const val = e.target.value
    const name = e.target.name
    val !== '' && action(val, name)
  }

  const inputStyle = {
    outline: "none",
    color: value && "#134168",
    fontWeight: value && "bold",
  }

  return (
    <div className="w:100pc ta:l">
      <label className="c:blacka5 fs:80pc lh:2.35">{label}</label>
      <input
        autoComplete="off"
        type="text"
        name={name}
        placeholder={placeholder}
        className="w:100pc fs:90pc p-rl:12px br:4px bd:1px-sd-eb8e8e8 lh:2.35 fc-bd:1px-sd-prim"
        style={inputStyle}
        defaultValue={value}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
      />
    </div>
  )
}

export default TextField
