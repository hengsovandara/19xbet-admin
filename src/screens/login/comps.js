import React, { useEffect, useState } from 'react'
import Layout from '../../@clik/comps/layout'
import { Button, Input, Paragraph } from '../../@clik/elems/styles'
import { actions } from './hooks'
import { ElemLogo } from './elems'
import useActStore from 'actstore'

export default () => {
  const { act, handle, init, cookies, store } = useActStore({ actions })
  const [phoneNumber, setPhoneNumber] = useState('17577719')
  const [password, setPassword] = useState('123')
  const [focusPhone, setFocusPhone] = useState(false);
  const [focusPin, setFocusPin] = useState(false);
  const [session, setSession] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <Layout empty nospace isLoading={isLoading}>
      <div className="mxw:550px w:100pc c:black m:auto">

        <div className="c:sec m-tb:30px p:20px-30px br:5px bd:1px-sd-FCCD12 bg:black">
          <div className="bd-b:1px-sld-grey200">
            <ElemLogo {...init} />
            <p className="p-b:15px fw:400 c:FCCD12">CASA-79 Admin Management</p>
          </div>

          <div className="md-dp:flx ai:c jc:c">

            <div className="md-w:50pc mdx-m-t:20px m-tb:30px">
              <form onSubmit={e => {
                e.preventDefault();
                act('USER_LOGIN', { phoneNumber, password });
              }}>
                <Paragraph className="fw:normal-! c:FCCD12">Phone</Paragraph>
                
                  <Input type="text" name="phone" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} 
                    onFocus={() => setFocusPhone(true)} onBlur={() => setFocusPhone(false)}  
                  />
                
                <Paragraph className="fw:normal-! c:FCCD12">Password</Paragraph>
                
                  <Input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} 
                    onFocus={() => setFocusPin(true)} onBlur={() => setFocusPin(false)}
                  />
                
                <Button type="submit" className="w:100pc m-t:16px btn-login c:black-!">Log In</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
