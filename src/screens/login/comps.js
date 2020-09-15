import React, { useEffect, useState } from 'react'
import Layout from '../../@clik/comps/layout'
// import Input from '../../@clik/elems/input'
import { Button, Input, Paragraph } from '../../@clik/elems/styles'
import { actions } from './hooks'
import { ElemLogo } from './elems'
import useActStore from 'actstore'

export default () => {
  const { act, handle, init, cookies, store } = useActStore({ actions })
  const [phone, setPhone] = useState('012345678')
  const [pin, setPin] = useState('12345')
  const [focusPhone, setFocusPhone] = useState(false);
  const [focusPin, setFocusPin] = useState(false);
  const [session, setSession] = useState()
  let timer
  let qr = session && session.qr

  useEffect(() => {
    act('USER_QR_FETCH').then(setSession)
  }, [])

  useEffect(() => {
    handleSession(timer)
    return () => clearTimeout(timer)
  }, [session])

  async function handleSession() {
    if (!session || (session && !session.session)) return clearTimeout(timer)

    if (await act('USER_SESSION_FETCH', session)) return clearTimeout(timer), setSession({ qr: null, session: null })

    timer = setTimeout(() => handleSession(), 2000)
  }

  return (
    <Layout empty nospace isLoading={!qr}>
      <div className="mxw:550px w:100pc c:black m:auto">

        <div className="c:sec m-tb:30px p:20px-30px br:5px bd:1px-sd-FCCD12 bg:black">
          <div className="bd-b:1px-sld-grey200">
            <ElemLogo {...init} />
            <p className="p-b:15px fw:400 op:0.7">IBC79 Admin Management</p>
          </div>

          <div className="md-dp:flx ai:c jc:c">

            <div className="md-w:50pc mdx-m-t:20px pb:10px">
              <form onSubmit={e => {
                e.preventDefault();
                act('USER_LOGIN', { phone, pin });
              }}>
                <Paragraph className="fw:normal-!">Phone</Paragraph>
                
                  <Input type="text" name="phone" value={phone} onChange={e => setPhone(e.target.value)} 
                    onFocus={() => setFocusPhone(true)} onBlur={() => setFocusPhone(false)}  
                  />
                
                <Paragraph className="fw:normal-!">Password</Paragraph>
                
                  <Input type="password" name="password" value={pin} onChange={e => setPin(e.target.value)} 
                    onFocus={() => setFocusPin(true)} onBlur={() => setFocusPin(false)}
                  />
                
                <Button type="submit" className="w:100pc m-t:16px btn-login c:black">Log In</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
