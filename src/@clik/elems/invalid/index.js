import React from 'react'
import styled from 'styled-components'
import { ElemPopup } from '../../comps/fillers'
import Button from '../../elems/button'

function Invalid(props) {
  const { onClose, onSubmit, flag, options, title, subtitle, popup } = props
  const [note, setNote] = React.useState('')
  const [selectedOption, setSelectedOption] = React.useState(options.length === 1 ? options[0].value : !options.length ? true : null)
  const [height, setHeight] = React.useState(80)
  const textarea = React.useRef()

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit({ ...options.find(item => item.value === selectedOption), note })
    onClose()
  }

  return (
    <ElemPopup onClose={() => onClose()}>
      <div className="w:100pc c:black bg:white br:5px sh:0-1px-2px-000a15 p:24px nw:500px">
        <div className="dp:flx jc:sb ai:c m-b:30px">
          <h1>{title || 'Select one of the options'}</h1>
        </div>
        <form onSubmit={handleSubmit}>
          {!!subtitle && <div className="dp:flx jc:sb ai:c w:100pc p:12px-5px m-b:16px">
            <div>
              <p className="fs:120pc fw:600 ta:l">{subtitle}:</p>
              <div className="m-t:12px">
                {options.map((item, index) => (
                  <div key={index} className="flxg:1 ta:l p-tb:5px">
                    <label>
                      <input
                        type="radio"
                        className="m-r:16px"
                        name="reason"
                        value={item.value}
                        checked={selectedOption === item.value}
                        onChange={event => setSelectedOption(event.target.value)} />
                      {item.text}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ backgroundImage: `url()` }}></div>
              <div style={{ backgroundImage: `url()` }}></div>
            </div>
          </div>}
          <div className="m-b:16px">
            <p className="fs:120pc fw:600 ta:l m-b:5px">{`Notes ${popup?.status === 'rejected' ? '(requried)' : '(optional)'}`}</p>
            <textarea
              ref={textarea}
              className="bd:1px-sd-ccc ta:l w:100pc m-tb:12px h:auto br:5px p:16px"
              style={{ height: height + 'px' }}
              name="note"
              placeholder="Enter the note"
              value={note}
              onChange={e => setNote(e.target.value)} />
          </div>
          <div className="dp:flx ai:c jc:fe">
            <Button simple action={onClose}>Cancel</Button>
            <Button prim selectedOption={selectedOption} disabled={!selectedOption || (popup?.status === 'rejected' && !note)} type="submit">Confirm</Button>
          </div>
        </form>
      </div>
    </ElemPopup>
  )
}

const SubmitButton = styled.button`
  background-color: white;
  color: ${props => props.theme.prim};
  border-radius: 5px;
  border: 1px solid ${props => props.theme.prim};
  min-width: 124px;
  height:40px;
  margin-left: 16px;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.5s;

  &:hover {
    background-color: ${props => props.disabled ? "transparent" : props.theme.prim};
    color: ${props => props.disabled ? props.theme.prim : "white"};
  }
`

export default Invalid
