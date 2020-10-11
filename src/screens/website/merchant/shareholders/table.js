import CustomIcon from 'clik/elems/icons/customIcon'
import Table from 'clik/elems/table'
import { actions } from './hooks'
import useActStore from 'actstore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({shareholders, onClickPreview, onClickUpload}) => {
  const { act, store, action, handle } = useActStore(actions)
  const pagination = {
    current: 1,
    last: 1,
    limit: 15,
    offset: 0,
    overall: shareholders?.length || 0
  }

  const tableData = shareholders.map(shareholder => {
    const { id, merchantId, type, merchantData, consumerData, shareholderConsumerId, shareholderMerchantId, shareholderConsumer, shareholderMerchant} = shareholder
    const isCompany = type === 'company'
    const name = isCompany ? `${merchantData?.companyName || ''}` : `${consumerData?.lastName || ''} ${consumerData?.firstName || ''}`
    const subValue = consumerData?.phoneNumber || merchantData?.registrationNumber || 'N/A'

    const avatarUrl = shareholderConsumer?.amazonS3FaceImage || shareholderMerchant?.logoUrl
    const avatar = () => avatarUrl &&
      <img className="w,h,br:50px bg:none" src={avatarUrl} /> ||
      <FontAwesomeIcon icon="user-circle" size="3x" />

    const icon = {
      onClick: () => onClickUpload(id),
      changeIcon: "upload",
      defaultIcon: `${(merchantData?.uri || consumerData?.uri) ? "check-circle" : "exclamation-circle" }`,
      color: `${(merchantData?.uri || consumerData?.uri) ? "#1fb5a7" : "#f57167" }`,
    }

    const scanIcon = () => <CustomIcon {...icon} />
    const addressIcon = () => <CustomIcon onClick={() => {}} />
    const typeIcon = () => <CustomIcon size="lg" color='#134168' defaultIcon={`${isCompany ? "store" : "user"}`} noHover />
    const previewIcon = () => (merchantData?.uri || consumerData?.uri) &&
      <CustomIcon size="lg" color='#134168' onClick={() => onClickPreview(`${merchantData?.uri || consumerData?.uri}`)} defaultIcon="file" noHover />
      || null

    const _href =
      shareholderMerchantId ? { pathname: '/merchants', query: { id: shareholderMerchantId } } :
      shareholderConsumerId ? { pathname: '/consumers', query: { id: shareholderConsumerId } } : { pathname: '/merchants', scroll: false, query: { id: merchantId, step: 'shareholders', open: id } }

    return {
      avatar: { component: avatar, center: true },
      name: { title: name || 'N/A', subValue, bold: true, full: true },
      type: { component: typeIcon, type: 'label', mobile: false, center: true },
      file: { component: previewIcon, type: 'label', mobile: false, center: true },
      'scan id': { component: scanIcon, type: 'label', mobile: false, center: true },
      address: { component: addressIcon, type: 'label', mobile: false, center: true },
      id,
      _href
    }
  })

  const tableActions = [
    { name: 'Remove', color: 'error', action: selected => handle.confirm(() => act('DELETE_SHAREHOLDER', selected) ) }
  ]

  return <Table
    light
    pagination={pagination}
    noTableHead
    noTableFoot
    allowSelect
    actions={tableActions}
    fields={['avatar', 'name', 'type', 'file', 'scan id', 'address']}
    data={tableData}
  />
}