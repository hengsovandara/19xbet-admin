import React from 'react'
import useActStore from 'actstore'
import Layout from '../../@clik/comps/layout'
import { VictoryChart, VictoryTheme, VictoryPie, VictoryArea, VictoryLine, VictoryLabel, VictoryAxis } from 'victory'

const colors = {
	approved: 'rgba(69, 196, 196, 1)',
	assigned: 'rgba(254, 182, 47, 1)',
	outstanding: 'rgba(115, 177, 235, 1)',
	returned: 'rgba(149, 117, 205, 1)',
	rejected: 'rgba(229, 115, 115, 1)'
}

const alt = [
	{ x: 1, y: 0 },
	{ x: 2, y: 9 },
	{ x: 3, y: 3 },
  { x: 4, y: 8 },
  { x: 5, y: 6 },
]

export default props => {
	const { act } = useActStore({ actions }, ['ready'])
	const [stats, setStats] = React.useState([])

	React.useEffect(() => { act('STATS_TASKS').then(setStats) }, [])

	const data = stats.filter(stat => stat.key !== 'total') || []
	const total = stats.find(stat => stat.key === 'total') || {}

	return (
		<Layout maxWidth title="Dashboard" titleAlt filter>
			<div className="w:100pc h:calc(100pc-80px) dp:flx ai:fs mdx-flxd:col p:24px p-t:0 bg:blacka06">
        <div className="w:100pc dp:flx mdx-flxd:col">
          <div className="w:100pc md-w:65pc dp:flx flxd:col bg:white bd:1px-sd-blacka12 br:8px p:24px mdx-m-b:24px">
            <h3 className="ta:l m-b:24px tt:uc">Account Overview</h3>
            <div className="h:100pc dp:flx mdx-flxd:col md-ai:c md-jc:sb md-m-rl:24px">
              <div className="w:100pc ps:rl p-t:12px mdx-m-b:48px md-mxw:50pc md-m-r:48px">
                <svg viewBox="0 0 400 400" style={{maxWidth: '300px'}} >
                  <VictoryLabel
                    textAnchor="middle" verticalAnchor="middle"
                    x={200} y={190}
                    style={{ fontSize: 44, fontFamily: 'inherit', fontWeight: 'bold' }}
                    text={total.value}
                  />
                  <VictoryLabel
                    textAnchor="middle" verticalAnchor="middle"
                    x={200} y={230}
                    style={{ fontSize: 14, fontFamily: 'inherit', fontWeight: 'bold', textTransform: 'uppercase' }}
                    text="Total Accounts"
                  />
                  <VictoryPie
                    colorScale={data.map(stat => stat.color)}
                    padding={0} width={400} height={400} innerRadius={155}
                    standalone={false}
                    data={data.map(stat => stat.value)} style={{ labels: { fontSize: 0 } }}
                  />
                </svg>
              </div>
              <div className="w:100pc dp:flx fd:col md-mxw:50pc">
                {data.map( stat => <Bar {...stat} total={total.value} />)}
              </div>
            </div>
          </div>
          <div className="dp:flx flxd:col w:100pc md-w:calc(35pc-24px) md-m-l:24px">
            <div className="bg:white br:8px w:100pc p:24px p-b:12px m-b:12px dp:flx flxd:col bd:1px-sd-blacka12">
              <h3 className="m-b:16px ta:l tt:uc">False Acceptance Rates</h3>
              <div className="dp:flx jc:fs fs:150pc"><h2>10.13%</h2></div>
              <div className="dp:flx ai:c">
                <div className="w:100pc">
                  <VictoryChart
                    padding={{ bottom: 12, top: 16, left: 16, right: 0 }}
                    width={250} height={70}
                    theme={VictoryTheme.material}>
                    <VictoryAxis 
                      style={{
                        tickLabels: { fontSize: 8, fontWeight: 500, padding: 0 },
                        axis: { stroke: 'white' }, ticks: { stroke: 'white' }
                      }}
                      domain={[0, 10]}
                      tickValues={[0, 5, 10]} 
                      dependentAxis
                    />
                    <VictoryLine interpolation="natural" style={{ data: { stroke: 'rgba(68, 196, 195,1)' } }} data={alt} />
                    <VictoryArea interpolation="natural" style={{ data: { fill: 'rgba(68, 196, 195,0.2)' } }} data={alt} />
                  </VictoryChart>
                </div>
              </div>
            </div>
            <div className="bg:white br:8px w:100pc p:24px p-b:12px m-t:12px dp:flx flxd:col bd:1px-sd-blacka12">
              <h3 className="m-b:16px ta:l tt:uc">False Rejection Rates</h3>
              <div className="dp:flx jc:fs fs:150pc"><h2>5.10%</h2></div>
              <div className="dp:flx ai:c">
                <div className="w:100pc">
                  <VictoryChart
                    padding={{ bottom: 12, top: 16, left: 16, right: 0 }}
                    width={250} height={70}
                    theme={VictoryTheme.material}>
                    <VictoryAxis
                      style={{
                        tickLabels: { fontSize: 8, fontWeight: 500, padding: 0 }, axis: { stroke: 'white' },
                        ticks: { stroke: 'white' } }
                      }
                      domain={[0, 10]}
                      tickValues={[0, 5, 10]}
                      dependentAxis
                    />
                    <VictoryLine interpolation="natural" style={{ data: { stroke: 'rgba(254, 182, 46, 1)' } }} data={alt} />
                    <VictoryArea interpolation="natural" style={{ data: { fill: 'rgba(254, 182, 46, 0.2)' } }} data={alt} />
                  </VictoryChart>
                </div>
              </div>
            </div>
          </div>
        </div>
			</div>
		</Layout>
	)
}

const Bar = ({ value = 100, label = 'Label', total = 50, color = 'black' }) => {
	const percentage = (value / total) * 100
	return <div className="m-b:36px last-m-b:0">
		<div className="dp:flx jc:sb m-b:8px">
			<h4 className="tt:cap">{label}</h4>
			<h4>{value} ({percentage.toFixed(2)}%)</h4>
		</div>
		<div className="bg:blacka06 h:8px w:100pc of:hd">
			<div className="h:100pc" style={{ backgroundColor: color, width: percentage.toFixed(2) + '%' }} />
		</div>
	</div>
}

const actions = ({ act }) => ({
	//returned: Consumers_aggregate(where: { status: { _eq: 2 }}){ aggregate{ count } }
	STATS_TASKS: () => {
    return []
		return act('GQL', { query: `{
		  total: Consumers_aggregate(where: { status: { _neq: 0 }}) { aggregate { count } }
		  approved: Consumers_aggregate(where: { status: { _eq: 4 }}){ aggregate{ count } }

		  assigned: Consumers_aggregate(where: { _and: [{ status: {_in: [2, 3]} }, {_or: [
		    {assignments: { finishedAt: { _is_null: true}}}
		  ]} ]}) { aggregate { count } }

		  outstanding: Consumers_aggregate(where: { _and: [{ status: {_eq: 2} }, {_or: [
		    { _not: {assignments: {}}},
		    { _not: {assignments: { finishedAt: { _is_null: true}}}}
		  ]} ]}) { aggregate { count } }

		  returned: Consumers_aggregate(where: { _and: [{ status: {_eq: 3} }, {_or: [
		    { _not: {assignments: {}}},
		    { _not: {assignments: { finishedAt: { _is_null: true}}}}
		  ]} ]}) { aggregate { count } }
			rejected: Consumers_aggregate(where: { status: { _eq: 8 }}){ aggregate{ count } }
		}`}).then(stats => Object.keys(stats).reduce((arr, key) => arr.concat({ key, label: key, value: stats[key].aggregate.count, color: colors[key]  }), [])).catch(err => [])
	}
})

// const Comp = () => {
//   return (
//     <Comps.Layout empty={false} loading={false}>
//       <Elems.Wrap fucss="dp:flx ai,jc:c fd:col mnh:calc(100vh-124px) mxw:600px m-rl:auto">
//         <Styled.Title>{`${I18n.t('info')} ${I18n.t('dashboard')}`}</Styled.Title>
//         <Styled.Subtitle>{I18n.t('dashboardMsg')}</Styled.Subtitle>
//         <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
//           <VictoryBar x="quarter" y="earnings" data={[
//             {quarter: 1, earnings: 13000},
//             {quarter: 2, earnings: 16500},
//             {quarter: 3, earnings: 14250},
//             {quarter: 4, earnings: 19000}
//           ]} />
//         </VictoryChart>
//       </Elems.Wrap>
//     </Comps.Layout>
//   )
// }
//
// export default Comp
//
// const Styled = Actheme.create({
//   Title: ['Text', 'fs:s10 c:white'],
//   Subtitle: ['Text', 'fs:s4 c:white xw:s100 mt:15 ta:c mh:auto']
// })
