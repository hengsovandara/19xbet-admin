const merchantFields = `
  id status name referenceId description createdAt
  coverUrl logoUrl
  openingHours
  facebookUrl websiteUrl flag
  addressName latitude longtitude hideAddress
  documents(order_by: { createdAt: asc }) { id name isChecked isValid url createdAt }
  activities(order_by: {createdAt: desc}){
    id note createdAt data owner { name id }
  }
  activitiesCount: activities_aggregate{
    aggregate{
      count
    }
  }
`

const merchantListFields = `
  id status name referenceId description createdAt
  coverUrl logoUrl
  openingHours
  facebookUrl websiteUrl flag
  addressName latitude longtitude hideAddress
  documents(order_by: { createdAt: asc }) { id name isChecked isValid url createdAt }
`

const fields = {
  Documents: `
    id name isChecked isValid url
  `,
  Activity: `
    id note date type createdAt time data ownerId notify merchantId consumerId
  `
}

module.exports = {
  subscribeMerchants: ({ filters, limit = 15, offset = 0 }) => `subscription {
    Merchants(limit: ${limit}, offset: ${offset}, ${filterFields(filters)}){ ${merchantListFields} }
  }`,

  subscribeMerchantsCount: filters => `subscription {
    count: Merchants_aggregate(${filterFields(filters)}) { aggregate { count } }
  }`,

  subscribeMerchant: id => `subscription {
    Merchants(where: {id: { _eq: "${id}"}}) { ${merchantFields} }
  }`,

  upsert: (table, columns, id = '') => `
    mutation($values: [${table}_insert_input!]!){
      insert_${table}(
        objects: $values,
        on_conflict: {
          constraint: ${table}_pkey,
          update_columns: [${columns}]
        }) {
        returning{
          ${fields[table]}
        }
      }
    }
  `
}

const filterFields = (filters = {}) => {
  const orderStr = [(!filters.sort || filters.sort === 'createdAt') && `createdAt: desc`, filters.sort === 'name' && `name: asc`, filters.sort === 'size' && `size: asc`, filters.sort === 'score' && `score: { all: desc }`, filters.sort === 'status' && `status: asc`, filters.sort === 'users' && `owner: { name: asc } `].filter(filter => filter).join(', ')

  const filterStr = [filters.keywords && `name: { _ilike: "%${filters.keywords}%" }`, filters.sector && `sector: { _eq: "${filters.sector}" }`, filters.score && `score: { all: { _gte: ${parseInt(filters.score.min)}, _lte: ${parseInt(filters.score.max)} } }`, filters.status && `status: {_eq: "${filters.status}"}`, filters.size && `size: { _eq: "${filters.size}"}`, filters.users && `owner: { id: { _in: [${((Array.isArray(filters.users) && filters.users) || [filters.users]).map(user => `"${user}",`)}] } }`].filter(filter => filter).join(', ')

  const query = `order_by: { ${orderStr} }, where: { ${filterStr} }`

  return query
}
