import Table from './table'
import { usePagination, useSelect, useFields, useFilters } from './hooks'
import Head from './head'
import Foot from './foot'

export default props => {
  const { pagination, data, handlePagination } = usePagination(props)
  const { selected, onSelect, isSelected, results } = useSelect(props, data, pagination)
  const { filters, filtersQuery, action, sort } = useFilters(props)

  return (
    <div className={props.className}>
      { !props.noHead && <Head {...props} action={action} onSelect={onSelect} results={results} isSelected={isSelected} selected={selected} pagination={pagination} filtersQuery={filtersQuery} filters={filters} /> }
      <Table {...props} {...useFields(props)} onSelect={onSelect} selected={selected} action={action} sort={sort} data={data} />
      <Foot {...props} pagination={pagination} handlePagination={handlePagination} filtersQuery={filtersQuery} />
    </div>
  )
}
