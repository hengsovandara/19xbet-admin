import React, { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import { Form as Toggler, Paragraph } from "../styles"

const Dropdown = ({
  showSearch = false,
  disabled = false,
  placeholder = "Select",
  value = "",
  options = [],
  onClick
}) => {
  const inputRef = useRef()
  const menuRef = useRef()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState(value)
  const [cursor, setCursor] = useState(0)
  let items = []

  const handleClickOutside = event => {
    if (inputRef.current.contains(event.target)) {
      return
    }
    !disabled && setOpen(!open)
  }

  const handleChange = (name, index) => {
    onClick(name, index)
    setOpen(false)
  }

  const handleKeyDown = e => {
    const key = cursor === -1 ? 0 : cursor

    if (e.keyCode === 9 && value !== (items.length && items[key].name)) {
      // console.log('Items', items)
      items.length > 0 && onClick(items[key], key)
      !items.length && onClick(text)
    }

    if ([38, 40, 13].includes(e.keyCode)) {
      e.stopPropagation()
      e.preventDefault()

      if (!open && [38, 40].includes(e.keyCode)) {
        setOpen(true)
      }

      if (e.keyCode === 13) {
        items.length > 0 && onClick(items[key], key)
        !items.length && onClick(text)
        setOpen(false)
      }
    }
    moveCursor(e.keyCode, menuRef && menuRef.current)

    function moveCursor(key, current) {
      if (!current)
        return

      let newCursor = cursor
      switch (e.keyCode) {
        case 38: newCursor = newCursor <= 0 ? items.length - 1 : newCursor - 1; break
        case 40: newCursor = cursor >= items.length - 1 ? 0 : cursor + 1; break
      }

      setCursor(newCursor)
      current.scrollTo({ top: 34.25 * newCursor, left: 0, behavior: 'smooth' })
    }
  }

  const renderMenuItem = () => {
    const input = text && text.toLowerCase()
    const matches = options.filter(option => {
      const name = option.name || option.text || option.value || option
      if (!input) return options
      if (input && (text === value)) return options

      return name.toLowerCase().includes(input)
    })

    items = matches
    const item = matches.map((opt, index) => {
      const item = opt.name || opt.text || opt.value || opt
      const isCursor = cursor === index
      return (
        <MenuItem
          cursor={isCursor ? 1 : 0}
          key={opt.url || index}
          match={item === value}
          onClick={() => handleChange(opt, index)}
        >
          {item}
        </MenuItem>
      )
    })

    const empty = (
      <MenuItem center={true} disabled={true}>
        <img style={{ cursor: "not-allowed" }} src="static/imgs/empty.png" width={60} height={60} />
        <Paragraph className="ta:c-!">No Options</Paragraph>
      </MenuItem>
    )

    return matches.length ? item : empty
  }

  useEffect(() => {
    setText(value)
  }, [value])

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keyup", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keyup", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keyup", handleClickOutside)
    }
  }, [open])

  return (
    <Container ref={inputRef}>
      <Toggler open={open} disabled={disabled} onClick={() => !disabled && setOpen(true)}>
        {showSearch ? (
          <input
            className="w:100pc bg:white bg:inherit tt:capitalize"
            disabled={disabled}
            style={{
              color: text ? "#134168" : "#8d8d8d",
              fontWeight: text ? "bold" : "normal",
              cursor: disabled ? `not-allowed` : `pointer`
            }}
            placeholder={placeholder}
            value={text || ''}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => !open && setOpen(true)}
            // onKeyUp={() => (text === value) && setOpen(true)}
            onClick={() => !disabled && setOpen(!open)}
          />
        ) : (
            <div
              className="w:100pc bg:inherit fs:90pc"
              style={{
                color: text ? "#134168" : "#8d8d8d",
                fontWeight: text ? "bold" : "normal",
                cursor: disabled ? `not-allowed` : `pointer`
              }}
            >
              {text || placeholder}
            </div>
          )}
        <div className="w:20px ta:c c:ccc" style={{ color: open && '#1fb5a7' }}>
          {open ? <FontAwesomeIcon icon="caret-up" /> : <FontAwesomeIcon icon="caret-down" />}
        </div>
      </Toggler>
      {open && (
        <Menu ref={menuRef} tabIndex="-1">
          {renderMenuItem()}
        </Menu>
      )}
    </Container>
  )
}

export default Dropdown

const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  color: #134168; /* sec */
`

const Menu = styled.ul`
  width: 100%;
  max-height: 120px;
  overflow-y: scroll;
  list-style: none;
  background: white;
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 0;
  margin: 0;
  border: 1px solid #1fb5a7; /* prim */
  border-top: 0;
  border-radius: 0 0 3px 3px;

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* Chrome/Safari/Webkit */
  }
`

const MenuItem = styled.li`
  width: 100%;
  background: white;
  padding: 8px 12px;
  outline: none;
  font-size: 14px;
  cursor: pointer;
  text-align: ${props => props.center ? `center` : `left`};

  ${props => props.cursor && `
    background: #1fb5a7;
    color: white;
  `};

  ${props => props.match ? `
    background: #069C8E;
    color: white;

    &:hover {
      background: #069C8E;
    }` : `
    &:hover {
      background: #1fb5a7;
      color: white;
    }
  `};

  ${props => props.disabled && `
    cursor: not-allowed;
    background: white;

    &:hover {
      background: none;
      color: ${props.theme.sec};
    }
  `};
`
