import React, { Fragment } from 'react'
import Icon from '../../../@clik/elems/icon'
import { Paragraph, } from '../../../@clik/elems/styles'
import Select from '../../../@clik/elems/select'
import { fucss } from 'next-fucss/utils'
import styled from "styled-components"

export const Stats = ({ items, validations, onPress }) => {
  return <div className="c:title200 ta:c m-t:16px bd-t:1px-sd-blacka12 of:auto">
    { items.map((item, index) => <StatsRow key={index} item={item} index={index} validations={validations} onPress={onPress} />)}
  </div>
}

export const Form = ({ items, validations, onPress }) => {
  return <div className="mnw:100pc c:black200 ta:c p-b:12px of:hd of-x:auto">
    <div className="ta:l dp:ib mnw:100pc va:m m-t:16px bd-tb:1px-sd-blacka12 m-b:24px">
      <div className="dp:flx ai:c w:100pc p-rl:16px">
        <div className={classNameSection()}>OCR</div>
        <div className={classNameSection()}>MRZ</div>
        <div className={classNameSection()}>USER INPUT</div>
        <div className={classNameSection()}>ACCEPTED INFORMATION</div>
      </div>
    </div>
    { items.map((item, index) => <FormRow key={index} item={item} validations={validations} onPress={onPress} index={index} />) }
  </div>
}

const classNameSection = () => fucss({
  'flxb:24pc mnw:120px p-tb:16px fs:80pc m-rl:8px ta:c c:blacka5 fw:600 last-flxb:28pc_mnw:300px': true
})

const FormRow = ({ item, validations, onPress, index }) => {
  const validation = validations.find(validation => validation?.field === item?.field) || {}
  const disabled = item?.disabled || null

  const rows = [
    { label: (item?.ocr?.label || item?.ocr?.name || item?.ocr?.text || item?.ocr), value: (item?.ocr?.value || item?.ocr?.symbol || item?.ocr?.name || item?.ocr)},
    { label: (item?.mrz?.label || item?.mrz?.name || item?.mrz?.text || item?.mrz), value: (item?.mrz?.value || item?.mrz?.symbol || item?.mrz?.name || item?.mrz)},
    { label: (item?.value?.label || item?.value?.name || item?.value?.text || item?.value), value: (item?.value?.symbol || item?.value?.value || item?.value?.name || item?.value)},
  ]

  return <div className={classNameRow(index % 2 === 0)}>
    <Paragraph label="true" className={classNameLabel(index % 2 === 0)}>{item.label}</Paragraph>
    <div className={classNameRowInner(disabled, index % 2 === 0)}>
      { rows.map((row, index) => (
        <div key={index} className={classNameCol(index % 2 === 0)}>
          { row.value
            ? <Span onClick={() => (row.value !== validation.value && !disabled) && onPress('accepted', { ...validation, value: row.value})} className={classNameSpan(row.value === validation.value)}>{row.label}</Span>
            : <Span className={classNameSpan(false, true)}>N/A</Span>
          }
        </div>
      ))}
      <div className={classNameColLast(index % 2 === 0)}>
        { Dropdown(item, validation, onPress) }
        {(!item.disabled || !item.value) && <Item
          onPress={() => onPress('requested', { ...validation, value: '', field: item.field, label: item.label })}
          active={validation.status === 'requested'}
          type="info"
          disabled={item.disallow && item.disallow.includes('requested') && !item.value}
          icon="concierge-bell" />
        }
        {!item.disabled && <Item
          onPress={() => onPress('escalated', { ...validation, value: '' })}
          active={validation.status === 'escalated'}
          type="danger"
          disabled={item.disallow && item.disallow.includes('escalated')}
          icon="arrow-up" />
        }
      </div>
    </div>
  </div>
}

const classNameRow = (odd) => fucss({
  'ps:rl p-rl:16px dp:ib mnw:100pc bd-t:1px-sd-blacka08': true,
  'bg:seca02': odd
})

const classNameRowInner = () => fucss({
  'ta:l dp:flx fw:600 ai:c mnh:80px p-t:16px p-b:20px w:100pc': true
})

const classNameLabel = () => fucss({
  'ps:ab t:8npx p-rl:4px h,lh:16px-! br:4px m-l:4npx bg:white': true
})

const Span = styled.div`
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    background: transparent; /* Chrome/Safari/Webkit */
  }
`

const classNameCol = () => fucss({
  'flxb:24pc m-rl:8px ta:c dp:flx ai,jc:c': true
})

const classNameColLast = () => fucss({
  'flxb:28pc mnw:300px dp:flx fd:row ai:c jc:fs p-tb:12px m-rl:8px': true
}) 

const Item = ({ active, tag, disabled, type = 'info', icon, onPress, children }) => (
  <span onClick={() => !disabled && onPress ? onPress() : null} className={checkboxClass(active, type, disabled, !children, tag)}>
    {!!icon ? <Icon icon={icon} /> : children}
  </span>
)

const Dropdown = (item, validation, handleChange) => {
  const options = [...new Map(item.options.map(item => [(item['value'] || item['symbol'] || item), item])).values()];

  const handleClick = option => {
    const selected = option?.symbol || option?.value || option?.name || option?.text || option
    handleChange('accepted', { ...validation, value: selected })
  }

  return <div className="w:60pc">
    <Select
      green
      showSearch
      reverse={item.reverse}
      placeholder={item.placeholder}
      options={options}
      value={validation.value || ''}
      disabled={item.disabled}
      onClick={handleClick}
      onChange={handleClick}
    />
  </div>
}

const classNameSpan = (active, empty) => fucss({
  'br:5px fs:90pc p:12px ts:all mnw:120px mxw:160px ta:c c:black of:auto': true,
  'bg:EDF8ED c:4CBF4C p-l:12px': active,
  'bg:prima05': !active,
  'crs:pnt': !empty,
  'c:blacka5 fs:80pc p-t:12px': empty
})

const StatsRow = ({ item, index, validations, onPress }) => {
  const validation = validations.find(validation => validation.field === item.field)

  return <div className={`dp:ib mnw:100pc ${!!index &&'bd-t:1px-sd-blacka12'}`}>
    <div className={`ta:l dp:flx ai:c mnh:80px fw:600 ${item.disabled && 'c:blacka5'}`}>
      <div className="flxb:40pc mnw:160px m-r:16px">{item.label}</div>
      <div onClick={() => item.link ? window.open(item.link, '_blank') : null} className='flxb:24pc mnw:120px ta:c m-r:16px'>
        {item.value}
        {!!item.tags && item.tags.map(tag => <Item type={tag} tag active>{tag}</Item>)}
      </div>
      <div className="flxb:40pc dp:flx fd:row ai:c jc:fe mnw:200px">
        {(!item.disabled && validation) && <Fragment>
          <Item
            onPress={() => onPress('accepted', validation)}
            active={validation.status === 'accepted'}
            type={validation.risk}
            disabled={validation.disabled || item.disallow && item.disallow.includes('accepted')}
            icon="check" />
          <Item
            onPress={() => onPress('requested', validation)}
            active={validation.status === 'requested'}
            type="info"
            disabled={item.disallow && item.disallow.includes('requested')}
            icon="concierge-bell" />
          <Item
            onPress={() => onPress('escalated', validation)}
            active={validation.status === 'escalated'}
            type="danger"
            disabled={item.disallow && item.disallow.includes('escalated')}
            icon="arrow-up" />
        </Fragment>}
      </div>
    </div>
  </div>
}

const checkboxClass = (active, type, disabled, empty, tag) => fucss({
  'crs:pnt br:5px m-l:24px dp:flx ai:c jc:c': true,
  'w:40px h:40px': empty,
  'm-r:3px m-t:3px br:3px m-l:0 dp:ib p-rl:6px': tag,
  'c:4CBF4C bg:EDF8ED': ['success'].includes(type) && active,
  'c:4CBF4C bd:1px-sd-4CBF4C hv-bg:EDF8ED': type === 'success' && !active,
  'c:7FB8ED bg:F1F7FD': ['info', 'adverse'].includes(type) && active,
  'c:7FB8ED bd:1px-sd-7FB8ED hv-bg:F1F7FD': type === 'info' && !active,
  'c:FFBF00 bg:FFF2CC': ['warning', 'pep'].includes(type) && active,
  'c:FFBF00 bd:1px-sd-FFBF00 hv-bg:FFF2CC': type === 'warning' && !active,
  'c:E57373 bg:FCF1F1': ['danger', 'sanction'].includes(type) && active,
  'c:E57373 bd:1px-sd-E57373 hv-bg:FCF1F1': type === 'danger' && !active,
  'op:0.5 gs:0.3': disabled
})
