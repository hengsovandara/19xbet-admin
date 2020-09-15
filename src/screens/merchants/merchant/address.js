import React from 'react'
import useActStore from 'actstore'
import { actions } from './hooks'
import TextField from '../../../@clik/elems/textfield'

const Address = ({ merchant }) => {
  const { act, store, action, handle, route } = useActStore(actions)

  const handleChange = (text, name) => {
    // act('MERCHANT_UPDATE', { id: merchant.id, addresses: [] })
  }

  return (
    <div className="p:20px p-t:0">
      {merchant?.addresses?.length
        ? merchant.addresses.map((address, index) => (
          <div key={index}>
            <h4 className="m-t:20px">{"Registered address"}</h4>
            <div className="m-t:20px">
              <div className="w:180px p-tb:10px">
                <TextField label="Country" placeholder="Country" name="country" value={address.country} action={(text, name) => handleChange(text, name)} />
              </div>
              <div className="w:100pc dp:flx jc:sb p-b:10px">
                <div className="w:180px">
                  <TextField label="City" placeholder="City" name="city" value={address.city} action={(text, name) => handleChange(text, name)} />
                </div>
                <div className="w:180px">
                  <TextField label="Khan" placeholder="Khan" name="district" value={address.district} action={(text, name) => handleChange(text, name)} />
                </div>
                <div className="w:180px">
                  <TextField label="Sangkat" placeholder="Sangkat" name="commune" value={address.commune} action={(text, name) => handleChange(text, name)} />
                </div>
              </div>
              {/* <div className="w:100pc dp:flx jc:sb p-b:10px">
              <div className="w:395px">
                <TextField label="Street Name" placeholder="Street Name" name="" value="" action={text => console.log(text)} />
              </div>
              <div className="w:180px">
                <TextField label="Street Number" placeholder="Street Number" name="" value="" action={text => console.log(text)} />
              </div>
            </div>
            <div className="w:100pc dp:flx jc:sb">
              <div className="w:180px">
                <TextField label="Building Number" placeholder="Building Number" name="" value="" action={text => console.log(text)} />
              </div>
              <div className="w:180px">
                <TextField label="Postal Code" placeholder="Postal Code" name="" value="" action={text => console.log(text)} />
              </div>
            </div> */}
            </div>
          </div>
        ))
        : <div className="dp:flx jc,ai:c mnh:580px">No Addresses</div>
      }
    </div>
  )
}

export default Address
