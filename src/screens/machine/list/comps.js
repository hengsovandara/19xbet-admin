import { useEffect, useState, useRef } from 'react'
import useActStore from 'actstore'
import { GET, POST } from 'fetchier'
import Router from 'next/router'
import Table from '../../../@clik/elems/table'
import { actions } from './hooks'
import { fucss } from 'next-fucss/utils'
import Button from 'clik/elems/button'
import Match from 'clik/elems/match'
import { ElemProgressCircle } from 'clik/comps/fillers'
import Icon from '../../../@clik/elems/icon'

export default props => {
  const { act, store } = useActStore(actions);
  const { socket, facesList = [], count: overall = 0, training } = store.get('socket', 'facesList', 'count', 'training')
  const ref = useRef()
  const { query } = props;
  const [selected, setSelected] = useState({})
  const hasSelected = !!Object.keys(selected).length
  const [pagination, setPagination] = useState({ offset: 0, limit: 15 })
  const { progressPercentage = 0, isOngoing = true, statusText = 'N/A', details, isError = false, location, start, finish } = training || {}
  const [isTraining, setIsTraining] = useState(isOngoing)
  const [toggled, setToggled] = React.useState()

  useEffect(() => {
    if(socket) {
      let newPagination = query.page
        ? { ...pagination, offset: parseInt(query.page - 1) * pagination.limit }
        : pagination
      act('FETCH_LIST_DATA', newPagination)
      setPagination(newPagination)
    }
    return () => act('UNSUB', { id: 'faceVideos' })
  }, [socket, query.page])

  useEffect(() => {
    if(socket) act('SUB_LATEST_TRAINING')
    return () => act('UNSUB', { id: 'training' })
  }, [socket])

  useEffect(() => setIsTraining(isOngoing), [isOngoing])

  useEffect(() => {
    setSelected({})
    if(!query.id || !facesList.length) return

    const res = facesList.find(({ id: itemId }) => itemId === query.id) || {}
    const vdoTag = ref.current
    window && vdoTag && (vdoTag.src = null)
    setSelected(res)

    var request = new XMLHttpRequest()
    request.open('GET', res.url, true)
    request.responseType = 'blob'
    request.onload = function () {
      window.URL = window.URL || window.webkitURL
      vdoTag && (vdoTag.src = window.URL.createObjectURL(request.response))
    }
    request.send()
  }, [query.id, facesList])

  const handlePagination = pageNum => {
    Router.push(['/learning', `page=${pageNum}`].join('?'))
  }

  return (
    <>
      <div className="c:black200 dp:flx p-tb:24px">
        <div className="w:100pc xl-w:calc(100pc-400px) p-rl:24px">
          <Table
            light
            pagination={{ ...pagination, overall }}
            handlePagination={handlePagination}
            fields={['classification','prediction status', 'prediction percentage', 'name', 'created at', 'action']}
            data={renderItem(facesList, query)}
          />
        </div>
        <div className={classNameProfile(toggled)}>
          <div className={classNameProfileToggle(toggled)} onClick={() => setToggled(!toggled)}>
            <Icon icon="ellipsis-v" />
          </div>
          <div className="dp:flx flxd:col ai:c">
            {hasSelected
              ? <video
                  ref={ref}
                  className="w:100pc h:400px br:5px bg:white dp:bk bd:1px-sd-blacka12"
                  style={{'object-fit':'cover'}}
                  poster={selected.imageUrl}
                  autoPlay loop muted></video>
              : <div className="fw:400 w:100pc h:400px dp:flx flxd:col ai,jc:c bg:white br:5px c:prim bd:1px-sd-blacka12">
                  <Icon icon="user" size="3x" />
                  <p className="mxw:200px m-t:24px">Select consumer to preview the video</p>
                </div>
            }
            <div className="w:100pc m-t:24px dp:flx ai:c">
              <Button icon="times" name="FAKE" className="h:55px w:50pc m-r:12px jc:c" alert disabled={!hasSelected} action={() => act('LABEL_DATA', { obj: selected, bool: false })} />
              <Button icon="check" name="REAL" className="h:55px w:50pc m-l:12px jc:c" prim disabled={!hasSelected} action={() => act('LABEL_DATA', { obj: selected, bool: true })} />
            </div>
          </div>
          <div className="w:100pc m-t:24px ps:rl dp:flx flxd:col br:5px">
            <div className="m-b:24px">
              <div className="dp:flx ai:fe jc:sb m-b:5px fs:.75em fw:600">
                <p className="w:35pc ta:l">
                  <span>{isTraining ? 'Progress' : 'Latest training result'}</span>
                </p>
                <p className={classNameStatus(isError)}>
                  {statusText}
                </p>
              </div>
              <div className="w:100pc ps:rl bg:c8c8c8 br:5px lh:1">
                <span style={{ width: `${progressPercentage}%` }} className={classNameProgress(progressPercentage)}>
                  {progressPercentage + '%'}
                </span>
              </div>
              <div className="dp:flx jc:sb m-t:5px fw:600">
                <div className="w:50pc dp:flx flxd:col ai:fs">
                  <span className="fs:75pc">Start:</span>
                  <p className="fs:65pc">{start && new Date(start).toLocaleString() || 'N/A'}</p>
                </div>
                <div className="w:50pc dp:flx flxd:col ai:fe">
                  <span className="fs:75pc">Finish:</span>
                  <p className="fs:65pc">{finish && new Date(finish).toLocaleString() || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="dp:flx ai,jc:c">
              <Button
                prim
                className="w:100pc jc:c"
                spinIcon={isTraining}
                icon={isTraining ? 'sync-alt' : 'hourglass-start'}
                name={isTraining ? 'Please wait' : 'Start new training'}
                disabled={isTraining}
                action={() => {
                  setIsTraining(true)
                  GET({ url: 'https://liveliness201.clik.asia/dev/train' })
                    .then(() => setIsTraining(false)).catch(() => setIsTraining(false))
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function renderItem(items, query) {
  const data = items.map(obj => {
    const { id, liveness, consumer, createdAt, classifications } = obj

    const { firstName, lastName } = consumer || {}
    const fullName = firstName || lastName
      ? [firstName || '', lastName || ''].join(' ').trim()
      : 'N/A'

    const { prediction = 'N/A', percentage = 0 } = liveness || {}

    const selected = query.id === id
    const extraStyles = {
      'bd-l:4px-sld-prim': classifications && classifications === 'real',
      'bd-l:4px-sld-red': classifications && classifications === 'fake',
    }

    return {
      classification: { title: classifications && classifications.toUpperCase() || 'N/A', center: true, type: 'label' },
      'prediction status': { component: Match, props: { isMatched: prediction === 'real' } },
      'prediction percentage': { component: ElemProgressCircle, props: { score: parseInt(percentage * 100) }, center: true },
      name: { title: fullName, bold: true, full: true },
      'created at': { value: new Date(createdAt).toLocaleString(), mobile: false, center: true, type: 'label' },
      id,
      _href: { pathname: '/learning', query: { id } },
      action: { component: ButtonRetest, props: { ...obj } },
      _options: { selected, extraStyles }
    }
  })

  return data
}

const ButtonRetest = props => {
  const [testing, setTesting] = useState(false)
  const { act, store } = useActStore(actions)
  return <div className="w100pc dp:flx ai,jc:c p-rl:16px">
    <Button
      bordered
      prim
      icon={testing ? 'sync-alt' : 'hourglass-start'}
      name={testing ? 'Wait' : 'Retest'}
      disabled={testing}
      action={() => {
        setTesting(true)
        POST({ url: 'https://liveliness201.clik.asia/dev/test', body: { url: props.url } })
          .then(async res => {
            await act('UPDATE_FACE_LIVENESS', { face: props, data: res.data })
            setTesting(false)
          }).catch(e => {
            console.error(e)
            setTesting(false)
          })
      }}
    />
  </div>
}

const classNameProfile = (toggled) => fucss({
  'smx-w:280px w:320px xl-w:400px ps:fx t:70px r:0 b:0 bg:f3f3f3 bd-l:1px-sd-blacka12 p:24px dp:flx flxd:col jc:sb ts:all': true,
  'r:0': toggled,
  'smx-r:280npx r:320npx xl-r:0': !toggled
})

const classNameProfileToggle = (toggled) => fucss({
  'h:40px w:30px br:4px-0-0-4px bg:prim ps:ab t:50pc try:50npc l:30npx dp:flx ai,jc:c c:white crs:pt fs:16px xl-dp:n': true
})

const classNameProgress = percentage => fucss({
  'mnw:15pc h:20px p-t:1px br:4px jc:c c:white fw:600 dp:flx ai:c m:0 ts:all': true,
  'bg:f57167': percentage < 50,
  'bg:orange': percentage >= 50 && percentage < 90,
  'bg:green': percentage >= 90,
})

const classNameStatus = error => fucss({
  'fw:bold w:65pc dp:flx jc:fe ta:r': true,
  'c:red': error,
  'c:green': !error
})
