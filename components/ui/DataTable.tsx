'use client'

import { useState, useMemo } from 'react'
import { Table, Pagination } from 'flowbite-react'
import { HiSearch, HiSortAscending, HiSortDescending } from 'react-icons/hi'
import type { TableColumn, FilterOption } from '@/types'

interface DataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  filters?: {
    key: keyof T
    label: string
    options: FilterOption[]
  }[]
  pageSize?: number
  className?: string
  emptyMessage?: string
}

export function DataTable<T>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  filters = [],
  pageSize = 10,
  className = '',
  emptyMessage = 'No hay datos disponibles'
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string
    direction: 'asc' | 'desc'
  } | null>(null)
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)

  const filteredAndSortedData = useMemo(() => {
    let result = [...data]

    // Aplicar búsqueda
    if (searchTerm) {
      result = result.filter(item =>
        Object.values(item as Record<string, unknown>).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Aplicar filtros
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => String((item as Record<string, unknown>)[key]) === value)
      }
    })

    // Aplicar ordenamiento
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[sortConfig.key as string]
        const bValue = (b as Record<string, unknown>)[sortConfig.key as string]
        
        if (String(aValue) < String(bValue)) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (String(aValue) > String(bValue)) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [data, searchTerm, filterValues, sortConfig])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize)
  }, [filteredAndSortedData, currentPage, pageSize])

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize)

  const handleSort = (key: keyof T | string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        }
      }
      return { key, direction: 'asc' }
    })
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  return (
    <div className={className}>
      {/* Controles */}
      <div className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg shadow-lg border border-amber-200 dark:border-amber-700 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            {searchable && (
              <div className="relative flex-1 max-w-md">
                <HiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-600 dark:text-amber-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 jaguar-search-input rounded-lg border focus:ring-2 focus:outline-none"
                />
              </div>
            )}
            
            {filters.map(filter => (
              <select
                key={String(filter.key)}
                value={filterValues[String(filter.key)] || ''}
                onChange={(e) => handleFilterChange(String(filter.key), e.target.value)}
                className="jaguar-select rounded-lg border focus:ring-2 focus:outline-none px-3 py-2"
              >
                <option value="">{filter.label}</option>
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white dark:bg-amber-900/10 rounded-lg shadow-lg border border-amber-200 dark:border-amber-700">
        <Table hoverable>
          <Table.Head className="jaguar-table-header">
            {columns.map(column => (
              <Table.HeadCell
                key={String(column.key)}
                className={`${column.sortable ? 'cursor-pointer select-none hover:bg-amber-200 dark:hover:bg-amber-800/30' : ''} jaguar-table-header`}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && sortConfig?.key === column.key && (
                    sortConfig.direction === 'asc' ? 
                      <HiSortAscending className="h-4 w-4 text-amber-600 dark:text-amber-400" /> : 
                      <HiSortDescending className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
              </Table.HeadCell>
            ))}
          </Table.Head>
          <Table.Body className="divide-y divide-amber-100 dark:divide-amber-800/30">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <Table.Row 
                  key={index} 
                  className={`jaguar-table-row ${
                    index % 2 === 0 ? 'bg-white dark:bg-amber-900/5' : 'bg-amber-50 dark:bg-amber-900/10'
                  }`}
                >
                  {columns.map(column => (
                    <Table.Cell key={String(column.key)} className="jaguar-table-cell">
                      {column.render ? 
                        column.render(item) : 
                        String((item as Record<string, unknown>)[column.key as string] || '')
                      }
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={columns.length} className="text-center py-12">
                  <div className="text-amber-600 dark:text-amber-400">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-lg font-medium">{emptyMessage}</p>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showIcons
          />
        </div>
      )}
    </div>
  )
}