import React from 'react'
import useActStore from 'actstore'
import { actions } from './hooks'
import TextField from '../../../@clik/elems/textfield'

const Addresses = ({ merchant }) => {
  const { act, store, action, handle, route } = useActStore(actions)

  const handleChange = (id, text, name) => {
    const addresses = merchant.addresses && merchant.addresses.map(address => {
      if (address.id === id) { return { ...address, [name]: text } }
      return address
    })
    act('MERCHANT_UPDATE', { id: merchant.id, addresses })
  }

  return (
    <div className="m-t:24px">
      {merchant?.addresses?.length
        ? merchant.addresses.map((address, index) => <Address key={index} index={index} address={address} handleChange={handleChange} />)
        : null
      }
    </div>
  )
}

const Address = ({ index, address = {}, handleChange }) => {
  return (
    <div className="ta:l">
      <h4 className="p-t:24px tt:capitalize">{address.type ? address.type : 'New'} address</h4>
      <div className="">
        <div className="w:180px p-tb:12px">
          <TextField label="Country" placeholder="Country" name="country" value={address.country} action={(text, name) => handleChange(address.id, text, name)} />
        </div>
        <div className="w:100pc dp:flx jc:sb p-b:12px">
          <div className="w:180px">
            <TextField label="City" placeholder="City" name="city" value={address.city} action={(text, name) => handleChange(address.id, text, name)} />
          </div>
          <div className="w:180px">
            <TextField label="Khan" placeholder="Khan" name="district" value={address.district} action={(text, name) => handleChange(address.id, text, name)} />
          </div>
          <div className="w:180px">
            <TextField label="Sangkat" placeholder="Sangkat" name="commune" value={address.commune} action={(text, name) => handleChange(address.id, text, name)} />
          </div>
        </div>
        <div className="w:100pc dp:flx jc:sb p-b:12px">
          <div className="w:395px">
            <TextField label="Street Name" placeholder="Street" name="street" value="" action={text => console.log(text)} />
          </div>
          <div className="w:180px">
            <TextField label="Street Number" placeholder="House" name="house" value="" action={text => console.log(text)} />
          </div>
        </div>
        <div className="w:100pc dp:flx jc:sb">
          {/* <div className="w:180px">
            <TextField label="Building Number" placeholder="Building Number" name="" value="" action={text => console.log(text)} />
          </div> */}
          <div className="w:180px">
            <TextField label="Postal Code" placeholder="Postal Code" name="" value="" action={text => console.log(text)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Addresses
