import React, { useEffect } from 'react'
import useActStore from 'actstore'
import Layout from '../../@clik/comps/layout'
import { Card } from './elems'
import { fucss } from 'next-fucss/utils'

export default props => {
	const { act, store, cookies } = useActStore({ }, ['stats'])
	const { socket, stats } = store.get('socket', 'stats')

	return (
		<Layout title="Traffic Light">
			<div className="w:100pc dp:flx jc:c flxw:wrap fd:col md-fd:row md-m-rl:10npx">
				{stats && stats.map((item, index) =>
					<div key={index} className={classNameCardWrap(index == 0)}>
						<Card
							key={item.label}
							link={item.label}
							label={item.label}
							total={item.total}
							pendingNumber={item.pendingNumber}
							activatedNumber={item.activatedNumber}
							declinedNumber={item.declinedNumber}
						/>
					</div>
				)}
			</div>
		</Layout>
	)
}

const classNameCardWrap = (index) =>
	fucss({
		'w:100pc md-w:50pc md-p-rl:24px dp:flx ai:c jc:c bd-t:1px-sd-blacka12 md-bd-t:0 md-bd-l:1px-sd-e8e8e8': true,
		'bd-t:0-! bd-l:0-!': index
	})
