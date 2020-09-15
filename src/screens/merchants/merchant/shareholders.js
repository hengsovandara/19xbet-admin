import React from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Shareholder from './shareholder'

const columns = [
  { title: 'Name', key: 'name', },
  { title: 'Scan ID', key: 'scanId', width: '100px', },
  { title: 'OCR-MRZ', key: 'ocr-mrz', width: '100px', },
  { title: 'Address', key: 'address', width: '100px', },
]

const Shareholders = () => {
  const [isClikAccount, setIsClikAccount] = React.useState()

  const router = useRouter()

  // const handleGotoShareholder = e => {
  //   e.preventDefault()
  //   router.push('/mer')
  // }

  if (isClikAccount === 'clikAccount') {
    return <Shareholder />
  }

  return (
    <table cellSpacing="0" cellPadding="0" className="h,w:100pc bd:none p-t:20px" >
      <thead>
        <tr className="bg:E8E8E8 fs:100pc">
          {columns.map(({ title, key, width }) => (
            <th key={key} className="p-tb:10px fw:600" style={{ width: width }}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {columns.map((_, index) => (
          <tr key={index} className="w,h:100pc" style={{ backgroundColor: !!(index % 2) && '#F8F9FC' }} onClick={() => setIsClikAccount('clikAccount')}>
            <td style={{ verticalAlign: "middle" }}>
              <div className="dp:flx ai:c jc:sb p:10px">
                <div className="dp:flx ai:c">
                  <div className="bg:e8e8e8 w,h:48px bd:1px-sd-e8e8e8 br:24px m-r:10px">
                  </div>
                  <div>
                    <p className="fs:90pc fw:600 m-b:4px ta:l" style={{ maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Restaurant Brand International</p>
                    <p className="fs:80pc ta:l">+85512345678</p>
                  </div>
                </div>
                <div className="p:4px-12px br:4px c:prim fw:600 bg:prima2">
                  <p className="fs:80pc">Clik account</p>
                </div>
              </div>
            </td>
            <td className="va:m">
              <div className="p:10px">
                <FontAwesomeIcon icon="exclamation-circle" color="#f57167" />
              </div>
            </td>
            <td className="va:m">
              <div className="p:10px">
                <FontAwesomeIcon icon="exclamation-circle" color="#f57167" />
              </div>
            </td>
            <td className="va:m">
              <div className="p:10px">
                <FontAwesomeIcon icon="check-circle" color="#00d061" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Shareholders
