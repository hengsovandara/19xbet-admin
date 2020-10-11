import CustomIcon from 'clik/elems/icons/customIcon'
import Table from 'clik/elems/table'
import { actions } from './hooks'
import useActStore from 'actstore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({ directors, onClickUpload, onClickPreview }) => {
  const { act, store, action, handle } = useActStore(actions)
  const pagination = {
    current: 1,
    last: 1,
    limit: 15,
    offset: 0,
    overall: directors?.length || 0
  }

  const tableData = directors.map(({ id, merchantId, consumerId, data, consumer}) => {
    const name = `${data?.lastName || ''} ${data?.firstName || ''}`
    const phoneNumber = data?.phoneNumber || 'N/A'
    const role = data?.role

    const icon = {
      onClick: () => onClickUpload(id),
      changeIcon: "upload",
      defaultIcon: `${data?.uri? "check-circle" : "exclamation-circle" }`,
      color: `${data?.uri ? "#1fb5a7" : "#f57167" }`,
    }

    const avatarUrl = consumer?.amazonS3FaceImage
    const avatar = () => avatarUrl &&
      <img className="w,h,br:50px bg:none" src={avatarUrl} /> ||
      <FontAwesomeIcon icon="user-circle" size="3x" />

    const scanIcon = () => <CustomIcon {...icon} />
    const addressIcon = () => <CustomIcon onClick={() => {}} />
    const previewIcon = () => data?.uri &&
      <CustomIcon size="lg" color='#134168' onClick={() => onClickPreview(data)} defaultIcon="file" noHover />
      || null

    const _href = consumerId ?
      { pathname: '/consumers', query: { id: consumerId } } :
      { pathname: '/merchants', scroll: false, query: { id: merchantId, step: 'directors', open: id } }

    return {
      avatar: { component: avatar, type: 'label', center: true },
      name: { title: name || 'N/A', subValue: phoneNumber, bold: true },
      role: { subValue: role, center: true },
      file: { component: previewIcon, type: 'label', mobile: false, center: true },
      'scan id': { component: scanIcon, type: 'label', mobile: false, center: true },
      address: { component: addressIcon, type: 'label', mobile: false, center: true },
      id,
      _href
    }
  })

  const tableActions = [
    { name: 'Remove', color: 'error', action: selected => handle.confirm(() => act('DELETE_DIRECTOR', selected) ) }
  ]

  return <Table
    light
    pagination={pagination}
    noTableHead
    noTableFoot
    allowSelect
    actions={tableActions}
    fields={['avatar', 'name', 'role', 'file', 'scan id', 'address']}
    data={tableData}
  />
}