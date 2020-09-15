import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fucss } from 'next-fucss/utils'
import Link from 'next/link'
import { Button } from '../../../../@clik/elems/styles'

export default props => {
  // console.log(props)
  const { faceMatchPercentage, liveness, tamperingPhysical, tamperingDigital, isBlacklisted, handleResolve } = props
  const items = [
    {
      label: 'Face Match',
      name: 'faceMatchPercentage',
      value: Number(faceMatchPercentage) ? `${faceMatchPercentage}%` : '0%',
      isValid: Number(faceMatchPercentage) >= 80,
      action: handleResolve
    },
    {
      label: 'Liveness',
      name: 'liveness',
      value: Number(liveness) ? `${liveness}%` : '0%',
      isValid: Number(liveness) >= 80,
      action: handleResolve
    },
    {
      label: 'Tampering - Physical',
      name: 'tamperingPhysical',
      value: Number(tamperingPhysical) || Number(tamperingPhysical) == 0 ? `${tamperingPhysical}%` : 'N/A',
      isValid: Number(tamperingPhysical) < 80,
      action: handleResolve,
      reverse: true
    },
    {
      label: 'Tampering - Digital',
      name: 'tamperingDigital',
      value: Number(tamperingDigital) || Number(tamperingDigital) == 0 ? `${tamperingDigital}%` : 'N/A',
      isValid: Number(tamperingDigital) < 80,
      action: handleResolve,
      reverse: true
    },
    {
      label: 'Blacklist',
      name: 'blacklist',
      value: isBlacklisted ? 'Yes' : 'No',
      isValid: !isBlacklisted,
      action: handleResolve
    }
  ]

  return (
    <div className="w:100pc c:sec ta:c p:10px md-p:15px">
      {items.map((item, index) => (
        <div key={index} className={classNameRow(index % 2)}>
          <div className="w:30px">
            <FontAwesomeIcon icon={item.isValid ? 'check-circle' : 'exclamation-circle'}
              className="mnw:15px"
              style={{ color: item.isValid ? '#00d061' : '#f57167' }} />
          </div>
          <div className="ta:l flxb:calc(60pc-30px) md-flxb:calc(40pc-30px)">{item.label}</div>
          <div className="flxb:40pc fw:800 md-flxb:calc(60pc-120px)">{item.value}</div>
          <div className="w:100pc md-w:auto md-flxb:120px">
            {item.name !== 'blacklist' && (item.isValid
              ? <button
                className="bg:grey200 c:black br:5px fs:.85em p:7px-15px m-t:15px md-m-t:0 w:120px bs:1 hv-try:1px ts:all"
                onClick={() => item.action({ [item.name]: item.reverse ? 100 : 0, id: props.id })} id="undo" name={item.name}>
                Undo
              </button>
              : <button
                className="bg:F57167 c:white br:5px fs:.85em p:7px-15px m-t:15px md-m-t:0 w:120px bs:1 hv-try:1px ts:all fw:bold"
                onClick={() => item.action({ [item.name]: item.reverse ? 0 : 100, id: props.id })} id="resolve" name={item.name}>
                Resolve
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="dp:flx jc:c md-jc:fe m-t:10px md-m-t:15px p-t:15px bd-t:1px-sd-e8e8e8">
        <Link href={props.nextStep[1].href}>
          <Button link>
            Next
            <FontAwesomeIcon icon="arrow-right" className="m-l:10px" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

const classNameRow = isEven => fucss({
  'ta:c dp:flx ai:c flxw:wrap md-flxw:np p:20px-10px mnh:60px': true,
  'bg:F8F9FC': isEven
})
