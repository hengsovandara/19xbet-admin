import { useState } from 'react'
import { fucss } from 'next-fucss/utils'
import styled from 'styled-components'
import { ElemPopup } from '../../comps/fillers'
import { FLAGS } from '../../data'

function Invalid({ openPopup, update, id, flag, options, isLocked }) {
  // const [comments, setComments] = useState('')
  const [selectedOption, setSelectedOption] = useState()

  const handleSubmit = e => {
    e.preventDefault()
    openPopup(false)
    const reason = options.filter(item => item.value === selectedOption)
    // console.log(reason)
    let updateFlags = !isLocked && flag.filter(clikFlag => {
      if (selectedOption == 'reuploadDocument') {
        return (clikFlag !== 'ClikEkycDocument' && clikFlag !== 'ClikEkycDetails')
      } else if (selectedOption == 'reuploadLiveness') {
        console.log('reuploadDocument')
        return clikFlag !== 'ClikEkycFace'
      } else if (selectedOption == 'changePersonalInfo') {
        console.log('changePersonalInfo')
        return clikFlag !== 'ClikEkycProfile'
      } else if (selectedOption == 'changeAddress') {
        console.log('changeAddress')
        return clikFlag !== 'ClikEkycAddress'
      } else {
        return
      }
    })

    if (selectedOption == 'redoProcess') {
      updateFlags = FLAGS
    }

    // console.log(updateFlags)

    isLocked
      ? update({ id, status: 8, reason: reason[0].text })
      : update({ id, status: 3, flag: updateFlags })
  }

  return (
    <ElemPopup onClose={() => openPopup(false)}>
      <div className="w:100pc c:black bg:white br:5px sh:0-1px-2px-000a15 p:15px">
        <div className="dp:flx jc:sb ai:c">
          <h1>{isLocked ? 'Lock' : 'Update'}</h1>
          <p className="fw:800 c:prim p:10px-0">ID: {id}</p>
        </div>
        <form onSubmit={handleSubmit} className="m-t:15px">
          <div className="dp:flx jc:sb ai:c w:100pc p:10px">
            <div>
              <p className="fs:120pc fw:600 ta:l">Reason</p>
              <div className="dp:flx flxw:wrap m-t:10px">
                {options.map((item, index) => (
                  <div key={index} className="flxg:1 flxb:50pc ta:l p-tb:5px">
                    <label className="">
                      <input type="radio" className="m-r:15px" name="reason" value={item.value} checked={selectedOption === item.value} onChange={event => setSelectedOption(event.target.value)} />
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
          </div>
          {/* <div className="m-tb:15px p:10px">
            <p className="fs:120pc fw:600 ta:l m-tb:5px">Comments (optional)</p>
            <input type="text" className="bd-b:1px-sd-ccc ta:l w:100pc m-tb:10px" name="comments" value={comments} onChange={event => setComments(event.target.value)} />
          </div> */}
          <div className="m-t:20px p:10px">
            <SubmitButton
              selectedOption={selectedOption}
              disabled={!selectedOption}
              type="submit"
            >
              Submit
            </SubmitButton>
          </div>
        </form>
      </div>
    </ElemPopup>
  )
}

const SubmitButton = styled.button`
  background-color: white;
  color: ${props => props.theme.prim};
  border-radius: 75px;
  border: 1px solid ${props => props.theme.prim};
  min-width: 150px;
  padding: 10px 25px;
  margin: 10px;
  cursor: ${props => !props.selectedOption ? "not-allowed" : "pointer"};
  opacity: ${props => !props.selectedOption ? 0.5 : 1};
  transition: all;

  &:hover {
    transform: translateY(2px);
    background-color: ${props => props.theme.prim};
    color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  }
`

export default Invalid
