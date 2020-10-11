import React, { useState } from 'react'
import Layout from '../../@clik/comps/layout'
import { Input, Paragraph } from '../../@clik/elems/styles'
import Button from 'clik/elems/button'
import actions from './actions'
import useActStore from 'actstore'

const Login = () => <Layout empty nospace backgroundColor background="/static/imgs/pattern.svg"><Inner /></Layout>

const Inner = () => {
  const { act, init } = useActStore({ actions }, [])
  const [phoneNumber, setPhoneNumber] = useState('17577719')
  const [password, setPassword] = useState('123')
  const [focusPhone, setFocusPhone] = useState(false)
  const [focusPin, setFocusPin] = useState(false)
  const [session, setSession] = useState()

  return <div className="mxw:360px w:100pc c:black m:auto">

    <Logo {...init} />

    <div className="c:black p:24px bd:1px-sd-blacka12 bg:black br:12px">
      <div className="p-b:24px m-b:24px bd-b:1px-sld-blacka12">
        <h2 className="fs:200pc m-b:16px c:FCCD12">កំណត់ចូល</h2>
        <p className="c:FCCD12">Casa-79 Management Dashboard</p>
      </div>

      <div className="md-dp:flx ai:c jc:sb">
        {!!session?.qr && <div className="m-t:12px md-p-r:30px">
          {false && <object id="svg1" data={session?.qr} type="image/svg+xml" />}
          <img className="w:212px" src={session?.qr} type="image/svg+xml" />
          <p className="md-fs:85pc md-mxw:150px m-t:12px m-rl:auto fw:400 c:FCCD12">Scan QR code using your clik consumer app</p>
        </div>}

        <div className="md-w:100pc mdx-m-t:24px">
          <form onSubmit={e => {
            e.preventDefault()
            act('USER_LOGIN', { phoneNumber, password })
          }}>
            <div className="m-b:12px">
              <Paragraph className="c:FCCD12" >Phone Number</Paragraph>
              <Input type="text" placeholder="Enter Phone Number" name="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                onFocus={() => setFocusPhone(true)} onBlur={() => setFocusPhone(false)}
              />
            </div>
            <div>
              <Paragraph className="c:FCCD12">Password</Paragraph>
              <Input type="password" placeholder="Enter Password" name="password" value={password} onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusPin(true)} onBlur={() => setFocusPin(false)}
              />
            </div>
            <Button type="submit" prim className="w:100pc m-t:36px m-b:24px btn-login c:black bg:FCCD12">Log In</Button>
          </form>
        </div>
      </div>
    </div>
  </div>
}

export const Logo = ({ version, env, slogan = 'Safer than cash', logo = 'static/imgs/casa.png' }) => (
  <div className="ai:c jc:c m-b:36px">
    <img style={{ width: '250px', marginRight: '24px' }} src={logo} />
    <p className="tt:uc fs:80pc c:black">v{version} {env}</p>
  </div>
)

export default Login