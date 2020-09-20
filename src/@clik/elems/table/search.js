import { useState, useEffect, useRef, useCallback } from 'react'
import Icon from '../icon'
import { fucss } from 'next-fucss/utils'

let timeout = null
let input = ''

function Search({ name = '', onClick }) {
  const inputRef = useRef(null)
  const [text, setText] = useState(name)
  const [focus, setFocus] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState(0)

  useEffect(() => {
    !name && setText('')
    Boolean(name) && inputRef.current.focus()
  }, [name])

  const updateText = (e, now) => {
    typingTimeout && clearTimeout(typingTimeout)
    const searchText = typeof e === 'string' ? e : e.target?.value
    setText(searchText)

    now
      ? onClick(searchText)
      : setTypingTimeout(setTimeout(() => { onClick(searchText) }, 2000))
  }

  return (
    <div className={classNameWrapper(focus)}>
      <form
        autoComplete="off"
        className="w,h:100pc dp:flx jc:c ai:c"
        onSubmit={event => {
          event.preventDefault()
        }}
      >
        <input
          ref={inputRef}
          className="w:100pc p-rl:12px mnh:40px c:black fs:90pc"
          placeholder="Search"
          value={text}
          onChange={updateText}
          autofocus={true}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyDown={event => {
            if (event.keyCode === 13) {
              event.preventDefault()
              updateText(text, true)
            }
          }}
        />
        <button onClick={() => updateText(Boolean(text) ? '' : text, true)} className={classNameButton(focus)}>
          <Icon icon={Boolean(text) ? 'times' : 'search'} />
        </button>
      </form>
    </div>
  )
}

const classNameWrapper = focus => fucss({
  'w:100pc md-mnw:240px md-mxw:400px of:hd br:4px h:40px hv-bd:1px-sd-prim': true,
  'bs:1 bd:1px-sd-prim': focus,
  'bd:1px-sd-blacka12': !focus
})

const classNameButton = focus => fucss({
  'p:8px-12px crs:pt bg:white': true,
  'c:prim': focus,
  'c:black400': !focus
})

export default Search
