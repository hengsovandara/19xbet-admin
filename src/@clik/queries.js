export default {
  user: token => `
    query { Users(where: { credential: { sessions: {token: {_eq: "${token}"}} }}) { id role name photo } }
  `,

  fetchStatistics: `
    query fetchStatistic{
      consumers_overall: Consumer_aggregate{ aggregate{ count } }
      comsumers_pending: Consumer_aggregate(where: { Status: { _eq: 0}}){ aggregate{ count } }
      comsumers_active: Consumer_aggregate(where: { Status: { _eq: 1}}){ aggregate{ count } }
      comsumers_declined: Consumer_aggregate(where: { Status: { _eq: 8}}){ aggregate{ count } }
      merchants_overall: Merchant_aggregate{ aggregate{ count } }
      merchants_pending: Merchant_aggregate(where: { status: { _eq: "0"}}){ aggregate{ count } }
      merchants_active: Merchant_aggregate(where: { status: { _eq: "1"}}){ aggregate{ count } }
      merchants_declined: Merchant_aggregate(where: { status: { _eq: "8"}}){ aggregate{ count } }
    }
  `,
  //Updates multiple values for specific id
  update: table => `
    mutation($values: ${table}_set_input, $id: uuid) {
      update_${table}( _set: $values, where: { id: { _eq: $id } } ){
        returning { id }
      }
    }
  `,

  updateAddress: table => `
    mutation($values: ${table}_set_input, $id: uuid) {
      update_${table}( _set: $values, where: { id: { _eq: $id } } ){
        returning { id city khan sangkat }
      }
    }
  `,

  //${JSON.stringify(values).replace(/\"([^(\")"]+)\":/g,"$1:")}

  create: table => `
    mutation($values: ${table}_insert_input!) {
      insert_${table}(objects: [$values]){
        returning{ id }
      }
    }
  `,

  createMultiple: table => `
    mutation($values: [${table}_insert_input!]!) {
      insert_${table}(objects: $values){
        returning{ id }
      }
    }
  `,

  delete: table => `
    mutation($id: uuid) {
      delete_${table}(where: { id: { _eq: $id } }){
        returning{ id }
      }
    }
  `,

  deleteMultiple: table => `
    mutation( $ids: [uuid] ) {
    	delete_${table}(where: { id: { _in: $ids} }){
      	affected_rows
      }
    }
  `,

  allEnums: `
    query {
      Enum(order_by: {name: asc}) { name type }
    }
  `,

  addKey: table => `
    mutation($values: ${table}_append_input, $id: uuid){
      update_${table}(_append: $values, where: { id: { _eq: "476dea77-8c7c-42a0-a0fb-5660fa011287"}}){
        affected_rows
      }
    }
  `,

  deleteKey: table => `
    mutation($values: ${table}_delete_key_input, $id: uuid){
      update_${table}(_delete_key: $values, where: { id: { _eq: $id } }){
        affected_rows
      }
    }
  `,

  deleteAll: table => `
    mutation {
      delete_${table}(where: { id: { _is_null: false } }){
        affected_rows
      }
    }
  `
}
