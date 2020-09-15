import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fucss } from 'next-fucss/utils'

const Match = ({ isMatched, isMerchant }) => {
  return (
    <div className={classNameMatch(isMatched, isMerchant)}>
      <FontAwesomeIcon className="bs:1 br:50pc p:1px" icon="circle" />
    </div>
  )
}

const classNameMatch = (match, merchant) => fucss({
  'ta:c': true,
  'c:red': (typeof match === 'number' && match < 60) || (!match && !merchant),
  'c:orange': typeof match === 'number' && (match >= 60 && match < 85),
  'c:green': (typeof match === 'number' && match >= 85) || match,
  'c:prim': merchant
})

export default Match
