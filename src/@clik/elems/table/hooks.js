import { useState, useEffect } from 'react'

export function useFields(props) {
  const fields = props.fields || (props.data[0] && Object.keys(props.data[0]).filter(key => key.indexOf('_') !== 0)) || []
  return { fields }
}

export function useFilters(props) {
  const [filters, setFilters] = useState(getFilters(props.filters))
  const [filtersQuery, setQuery] = useState()
  const [sort, setSort] = useState((filters && filters.sort) || props.sort)

  return { action, filters, filtersQuery, sort }

  // Methods

  function action(value, data) {
    const { name } = data || {}

    if (!name) {
      setQuery()
      setFilters()
      setSort(props.sort)
      props.handleFilter && props.handleFilter()
    }

    if (name === 'sort') setSort(value)

    const newFilters = { ...filters }

    const add = (typeof value === 'string' && value.length) || (value && typeof value === 'object' && Object.keys(value).length)

    add ? (newFilters[name] = name === 'users' ? [value] : value) : delete newFilters[name]

    const base64 = window.btoa(JSON.stringify(newFilters))

    if (base64 === filtersQuery) return

    setQuery(base64)
    setFilters(newFilters)
    props.handleFilter && props.handleFilter(newFilters, Object.keys(newFilters).length && base64)
  }

  function getFilters(filters) {
    const object = typeof filters === 'string' && filters.length ? JSON.parse(window.atob(filters)) : filters || undefined
    return object
  }
}

export function useSelect(props, data, pagination = {}) {

  const { selectAll } = props;
  const [ selected, setSelected ] = useState(selectAll && data.map( item => item.id ) || []);

  useEffect(() => { selected.length && onSelect() }, [pagination.overall, pagination.current]);
  useEffect(() => { selectAll && setSelected(data.map( item => item.id ) || []) }, []);

  let first = (pagination.offset + pagination.limit) > pagination.overall ? pagination.overall : pagination.offset + pagination.limit;
  first = first !== 0  && [pagination.offset + 1, first].join(' - ');

  const isSelected = selected && selected.length && props.actions;
  const results = (selected && selected.length
    || first
    // || pagination.overall
    || '0') + ' / ';

  return { onSelect, selected, isSelected, results };


  // methods
  function onSelect(id, isChecked) {
    if (!id) return setSelected([])

    const ids = (Array.isArray(id) && id) || [id]
    const newSelected = !isChecked ? [...new Set([].concat(selected, ids))] : [...new Set([].concat(selected.filter(i => !ids.includes(i))))]

    setSelected(newSelected)
  }
}

export function usePagination(props) {
  const [pagination, setPagination] = useState(getPagesData(props.pagination || {}) || props.pagination)

  useEffect(() => {
    setPagination(getPagesData(props.pagination || {}) || props.pagination)
  }, [props.pagination])

  const from = pagination ? (props.data.length <= pagination?.limit ? 0 : pagination?.offset) : 0
  const data = props.data && props.data.slice(from, from + (pagination?.limit || 0))

  return { pagination, data, handlePagination }

  // methods
  function getPagesData({ offset = 0, limit, overall }) {
    if (!overall || !limit) return
    const pages = Math.ceil(overall / limit)
    const pagination = {
      pages: [...new Array(pages)].map((n, i) => i + 1),
      current: offset < limit ? 1 : Math.round(offset / limit) + 1,
      last: pages,
      offset,
      limit,
      overall
    }

    return pagination
  }

  function handlePagination(page) {
    if (props.handlePagination) return props.handlePagination(page)

    setPagination(
      getPagesData({
        ...pagination,
        offset: (page - 1) * pagination.limit
      })
    )
  }
}
