import { Stats } from './elems'

const ConsumerAutomation = ({ consumer, validations, onPress, user }) => {

  const matches = Number(consumer?.screening?.matches)

  console.log(consumer.contacts)

  return <Stats items={getItems()} validations={validations} onPress={onPress} />

  function getItems(){ return [
    {
      label: 'Phone Number',
      value: [consumer?.contacts[0]?.countryCode, consumer?.contacts[0]?.phoneNumber].join(' '),
      disabled: true,
      // disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
    },
    {
      label: 'Face Match',
      field: 'faceMatchPercentage',
      value: Number(consumer?.face?.faceMatchPercentage) ? `${consumer?.face?.faceMatchPercentage}%` : 'N/A',
      disabled: !consumer.face.faceMatchPercentage,
      disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
    },
    {
      label: 'Liveness',
      field: 'percentage',
      value: Number(consumer?.liveness?.percentage) ? `${consumer?.liveness?.percentage}%` : 'N/A',
      disabled: !consumer?.liveness?.percentage,
      disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
    },
    {
      label: 'No Physical Tampering',
      field: 'tamperingPhysical',
      value: Number(consumer?.ocr?.tamperingPhysical) ? `${Number(consumer?.ocr?.tamperingPhysical)}%` : 'N/A',
      disabled: !consumer?.ocr?.tamperingPhysical,
      disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
    },
    {
      label: 'No Digital Tampering',
      field: 'tamperingDigital',
      value: Number(consumer?.ocr?.tamperingDigital) ? `${Number(consumer?.ocr?.tamperingDigital)}%` : 'N/A',
      disabled: !consumer?.ocr?.tamperingDigital,
      disallow: ['compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : user.role === 'manager' ? ['escalated'] : []
    },
    {
      label: 'Screening',
      field: 'screening',
      // disabled: user.role === 'associate',
      disallow: ['associate', 'compliance'].includes(user.role) ? ['accepted', 'escalated', 'requested'] : [],
      value: Number(consumer?.screening?.matches || 0) + `${(consumer?.screening?.matches || 0) > 1 && ' matches' || ' match' }`,
      tags: consumer?.screening?.types,
      link: !!matches && consumer?.screening?.shareUrl
    }
  ]}
}

export default ConsumerAutomation
