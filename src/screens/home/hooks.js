export const actions = ({ act, store }) => ({
  STATS_FETCH: () =>
    act('GQL', {
      query: `
      query fetchStatistic {
        consumersOverall: Consumer_aggregate{ aggregate{ count } }
        comsumersPending: Consumer_aggregate(where: { status: { _eq: 2}}){ aggregate{ count } }
        comsumersActive: Consumer_aggregate(where: { status: { _eq: 1}}){ aggregate{ count } }
        comsumersDeclined: Consumer_aggregate(where: { status: { _eq: 8}}){ aggregate{ count } }
        
        merchantsOverall: Merchant_aggregate{ aggregate{ count } }
        merchantsPending: Merchant_aggregate(where: { status: { _eq: "2"}}){ aggregate{ count } }
        merchantsActive: Merchant_aggregate(where: { status: { _eq: "1"}}){ aggregate{ count } }
        merchantsDeclined: Merchant_aggregate(where: { status: { _eq: "8"}}){ aggregate{ count } }
      }
    `
    })
      .then(stats => {
        const data = Object.keys(stats).reduce((obj, key) => ({ ...obj, [key]: stats[key].aggregate.count }), {})

        return [
          {
            label: 'consumers',
            total: data.consumersOverall,
            pendingNumber: data.comsumersPending,
            activatedNumber: data.comsumersActive,
            declinedNumber: data.comsumersDeclined,
          },
          {
            label: 'merchants',
            total: data.merchantsOverall,
            pendingNumber: data.merchantsPending,
            activatedNumber: data.merchantsActive,
            declinedNumber: data.merchantsDeclined
          }
        ]
      })
      .then(stats => store.set({ stats }))
})
