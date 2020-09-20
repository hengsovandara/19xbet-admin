import React, { useState } from 'react'
import Layout from '../../@clik/comps/layout'
import { Input, Paragraph } from '../../@clik/elems/styles'
import Button from 'clik/elems/button'
import actions from './actions'
import useActStore from 'actstore'

export default () => <Layout empty nospace backgroundColor background="/static/imgs/pattern.svg"><Inner /></Layout>

const Inner = () => {
  const { act, init } = useActStore({ actions }, [])
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [focusPhone, setFocusPhone] = useState(false)
  const [focusPin, setFocusPin] = useState(false)
  const [session, setSession] = useState()

  return <div className="mxw:360px w:100pc c:white m:auto">

    <Logo {...init} />

    <div className="c:black p:24px bd:1px-sd-blacka12 bg:white br:12px">
      <div className="p-b:24px m-b:24px bd-b:1px-sld-blacka12">
        <h2 className="fs:200pc m-b:16px">Login</h2>
        <p className="c:black">Know your consumers management System</p>
      </div>

      <div className="md-dp:flx ai:c jc:sb">
        {!!session?.qr && <div className="m-t:12px md-p-r:30px">
          {false && <object id="svg1" data={session?.qr} type="image/svg+xml" />}
          <img className="w:212px" src={session?.qr} type="image/svg+xml" />
          <p className="md-fs:85pc md-mxw:150px m-t:12px m-rl:auto fw:400">Scan QR code using your clik consumer app</p>
        </div>}

        <div className="md-w:100pc mdx-m-t:24px">
          <form onSubmit={e => {
            e.preventDefault()
            act('USER_LOGIN', { phone, pin })
          }}>
            <div className="m-b:12px">
              <Paragraph>Phone</Paragraph>
              <Input type="text" placeholder="Enter phone" name="phone" value={phone} onChange={e => setPhone(e.target.value)}
                onFocus={() => setFocusPhone(true)} onBlur={() => setFocusPhone(false)}
              />
            </div>
            <div>
              <Paragraph>PIN</Paragraph>
              <Input type="password" placeholder="Enter PIN" name="pin" value={pin} onChange={e => setPin(e.target.value)}
                onFocus={() => setFocusPin(true)} onBlur={() => setFocusPin(false)}
              />
            </div>
            <Button type="submit" prim className="w:100pc m-t:36px m-b:24px btn-login">Log In</Button>
          </form>
          <div>
            <Button link href="#forgotPassword">Resend PIN</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export const Logo = ({ version, env, slogan = 'Safer than cash', logo = 'static/imgs/clik-logo.png' }) => (
  <div className="dp:flx ai:c jc:c m-b:36px">
    <div>
      <img style={{ width: '100px', marginRight: '24px' }} src={logo} />
    </div>
    <div className="ps:rl">
      <div className="ta:r fs:50pc c:black">
        v{version} {env}
      </div>
      <h1 className="fs:400pc fw:800 lh:1 c:black">Clik!</h1>
      <p className="tt:uc fs:80pc c:black">{slogan}</p>
    </div>
  </div>
)
