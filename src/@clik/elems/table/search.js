import { useState, useEffect, useRef, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fucss } from 'next-fucss/utils'

let timeout = null
let input = ''

function Search({ name = '', onClick }) {
  const inputRef = useRef(null)
  const [text, setText] = useState(name)
  const [focus, setFocus] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState(0)

  useEffect(() => {
    if (!name) setText('')
  }, [name])

  const updateText = e => {
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    const searchText = e.target.value
    setText(searchText)
    setTypingTimeout(setTimeout(() => {
      onClick(searchText)
    }, 2000))
  }

  return (
    <div className={classNameWrapper(focus)}>
      <form
        autoComplete="off"
        className="w:100pc dp:flx jc:c ai:c"
        onSubmit={event => {
          event.preventDefault()
          // if (!text) return;
          // onClick(text);
        }}
      >
        <input
          // id="search"
          ref={inputRef}
          className="w:100pc p:7px-0-7px-12px c:sec"
          placeholder="Search"
          // defaultValue={name}
          value={text}
          onChange={updateText}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        // onKeyDown={event => {
        //   if (event.keyCode === 13) {
        //     event.preventDefault();
        //     onClick(text);
        //   }
        // }}
        // onKeyUp={e => {
        //   e.persist()
        //   clearTimeout(timeout)
        //   timeout = setTimeout(() => {
        //     console.log("keyup", document.getElementById('search'))
        //     // onClick(text)
        //   }, 1500)
        // }}
        />
        <button className={classNameButton(focus)}>
          <FontAwesomeIcon icon="search" />
        </button>
      </form>
    </div>
  )
}

const classNameWrapper = focus => fucss({
  'w:100pc of:hd bd:1px-sd-e8e8e8 br:3px': true,
  'bs:1 bd:1px-sd-prim': focus
})

const classNameButton = focus => fucss({
  'p:7px-14px crs:pt hv-c:white_bg:prim': true,
  'bs:1 bd-l:1px-sd-prim bg:prim c:white': focus,
  'bg:blacka1 bd:none c:sec': !focus
})

export default Search
