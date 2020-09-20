import React, { useState, useEffect, useRef } from "react"
import Icon from "../icon"
import styled from "styled-components"
import { Form as Toggler } from "../styles"
import { fucss } from 'next-fucss/utils'

let timer = null

const Dropdown = ({ green, showSearch, disabled, placeholder = 'Select', value, options = [], onClick, onChange, reverse = false, transparent, full }) => {
  const inputRef = useRef()
  const menuRef = useRef()
  const [open, setOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [text, setText] = useState(value || '')

  const handleClickOutside = event => {
    if (inputRef.current.contains(event.target)) return
    !disabled && setOpen(!open)
  }

  const handleChange = (name, index) => {
    setIsSearching(false)
    setText(name?.label || name?.text || name?.name || name || '')
    onClick(name, index)
    setOpen(false)
  }

  useEffect(() => {
    const getOption = options && options.find(option => {
      const optValue = option?.symbol || option?.value
      return String(optValue !== undefined ? optValue : option) === String(value)
    })
    const selected = getOption?.name || getOption?.text || getOption?.value || value
    selected && setText(String(selected))
  }, [value])

  useEffect(() => {
    clearTimeout(timer)
    timer = setTimeout(() => { isSearching && onChange && onChange(text)}, 1000)
  }, [text])

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keyup', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keyup', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keyup', handleClickOutside)
    }
  }, [open])

  return (
    <div className={classNameContainer(full)} ref={inputRef}>
      <Toggler theme={open ? { borderColor: '#1fb5a7' } : { borderColor: 'rgba(17,17,17,0.2)' }} className="hv-bd:1px-sd-prim" transparent={transparent} green={green} open={open} disabled={disabled} onClick={() => !disabled && setOpen(!open)}>
        {showSearch ? (
          <input
            className={classNameInput(disabled)}
            disabled={disabled}
            placeholder={placeholder}
            value={disabled ? placeholder : text}
            onChange={e => {
              setIsSearching(true)
              setText(e.target.value)
            }}
            onFocus={() => !open && setOpen(true)}
            onClick={() => !disabled && setOpen(!open)}
          />
        ) : (
            <div className={`w:100pc bg:inherit mnh:38px p-rl:12px hv-bg:prima1 dp:flx ai:c br:4px p-t:2px ${open && 'bg:prima05'}`} style={{
              color: text ? "black" : "grey",
              fontWeight: text ? "bold" : "normal",
            }}>{text || placeholder}</div>
        )}
        <div className={classNameIcon(open, disabled, showSearch)}>
          <Icon icon={open ? "angle-up" : "angle-down"} />
        </div>
      </Toggler>
      {open && (
        <Menu className={classNameMenu(reverse)} ref={menuRef} tabIndex="-1">
          { showSearch && SearchItem({ isSearching, options, text, handleChange }) ||
            options.map((opt, index) => {
              const item = opt.name || opt.text || opt.value || opt
              const optValue = opt.symbol || opt.value || opt
              return (
                <li
                  className={MenuItemClassName(null, null, String(optValue) === String(text))}
                  key={opt.url || index}
                  onClick={() => handleChange(opt, index)}>
                  {item}
                </li>
              )
            })
          }
        </Menu>
      )}
    </div>
  )
}

export default Dropdown

const SearchItem = ({ text, isSearching, options, handleChange }) => {
  const input = typeof text === 'string' && text.toLowerCase() || text

  const matches = isSearching && Boolean(text) && options.reduce((arr, opt) => {
    const name = opt.name || opt.text || opt.label || opt
    const valid = (typeof name === 'string' && name.toLowerCase() || name).startsWith(input)
    return valid ? [opt].concat(arr) : arr.concat([opt])
  }, []) || options

  return matches.map((opt, index) => {
    const item = opt.name || opt.text || opt.label || opt
    const optValue = opt.symbol || opt.value || opt

    return (
      <li
        className={MenuItemClassName(null, null, String(optValue) === String(text))}
        key={opt.url || index}
        onClick={() => handleChange(opt, index)}
      >
        {item}
      </li>
    )
  })
}

const classNameContainer = (full) => fucss({
  'ps:rl dp:ib w:100pc h:40px mnw:124px md-mxw:240px': true,
  'md-mxw:100pc': full
})

const classNameInput = (disabled) => fucss({
  'ps:rl dp:ib w:100pc mxh:40px mxw:300px bg:ts p:8px-12px p-r:50px fw:bold': true,
  'c:black200': !disabled,
  'c:white': disabled
})

const classNameMenu = (reverse, green) => fucss({
  'w:100pc mxh:224px of-y:scroll lis:n bg:white ps:ab z:1 l:0 m:0 bs:3 mnh:40px br:0-0-4px-4px': true,
  't:100pc bd:1px-sd-prim bd-t:0': !reverse,
  'b:100pc bd:1px-sd-prim bd-b:0': reverse
})

const Menu = styled.ul`
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* Chrome/Safari/Webkit */
  }
`

const MenuItemClassName = (disabled, center, match) => fucss({
  'w:100pc bg:white mnh:40px dp:flx ai:c p:8px-12px ol:n fs:14px crs:pnt ta:l hv-bg:prim_c:white ps:rl bd-b:1px-sd-prima15': true,
  'ta:c': center,
  'c:prim fw:bold': match,
  'crs:not-allowed bg:white': disabled,
})

const classNameIcon = (open, disabled, showSearch) => fucss({
  'w,h:40px ta:c dp:flx ai,jc:c ps:ab r:0': true,
  'bg:prima05': open && showSearch,
  'c:black200': !open && !disabled,
  'c:black200': !disabled,
  'c:white': disabled,
  'c:prim': open,
  'bd-l:1px-sd-blacka12 hv-bg:prima1': showSearch,
})