export const STATUS = [
  { id: undefined, value: 'All' },
  { id: 0, value: 'Created' },
  { id: 1, value: 'Active' },
  { id: 2, value: 'Pending' },
  { id: 3, value: 'Updating' },
  { id: 4, value: 'Verified' },
  { id: 8, value: 'Declined' },
]

export const LOCK_ACCOUNT = [
  { value: 'invalidDocuments', text: 'Invalid Documents' },
  { value: 'faceNotMatch', text: 'Face Not Match' },
  { value: 'liveness', text: 'Liveness' },
  { value: 'tamperingPhysical', text: 'Tampering - Physical' },
  { value: 'tamperingDigital', text: 'Tampering - Digital' }
]

export const UPDATE_ACCOUNT = [
  { value: 'reuploadDocument', text: 'Reupload Document' },
  { value: 'reuploadLiveness', text: 'Reupload Liveness' },
  { value: 'changeAddress', text: 'Change Address' },
  { value: 'changePersonalInfo', text: 'Change Personal Infomation' },
  { value: 'redoProcess', text: 'Redo Process' }
]

export const FLAGS = [
  "ClikEkycDocument",
  "ClikEkycFace",
  "ClikEkycDetails",
  "ClikEkycProfile",
  "ClikEkycAddress"
]
