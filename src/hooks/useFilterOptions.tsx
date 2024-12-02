import { useState, useEffect } from 'react'
import { Option } from '@/types'

// Define interface for options

// Define interface for filter state
export interface FilterState {
  sources: string[]
  levels: string[]
  themes: string[]
}

// Custom hook for fetching filter options
export function useFilterOptions() {
  // State for available options
  const [sources, setSources] = useState<Option[]>([])
  const [levels, setLevels] = useState<Option[]>([])
  const [themes, setThemes] = useState<Option[]>([])

  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    sources: [],
    levels: [],
    themes: []
  })

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState({
    sources: false,
    levels: false,
    themes: false
  })
  const [errors, setErrors] = useState({
    sources: null as string | null,
    levels: null as string | null,
    themes: null as string | null
  })

  // Fetch sources
  const fetchSources = async () => {
    setIsLoading(prev => ({ ...prev, sources: true }))
    setErrors(prev => ({ ...prev, sources: null }))

    try {
      const response = await fetch('/api/words/sources')

      if (!response.ok) {
        throw new Error('Failed to fetch sources')
      }

      const data = await response.json()
      setSources(data.sources)
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        sources: error instanceof Error ? error.message : 'An unknown error occurred'
      }))
      setSources([])
    } finally {
      setIsLoading(prev => ({ ...prev, sources: false }))
    }
  }

  // Fetch levels based on selected sources
  const fetchLevels = async () => {
    // Skip if no sources selected
    if (selectedFilters.sources.length === 0) {
      setLevels([])
      return
    }

    setIsLoading(prev => ({ ...prev, levels: true }))
    setErrors(prev => ({ ...prev, levels: null }))

    try {
      // Construct URL with source query parameters
      const url = new URL('/api/words/levels', window.location.origin)
      selectedFilters.sources.forEach(source =>
        url.searchParams.append('source', source)
      )

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error('Failed to fetch levels')
      }

      const data = await response.json()
      setLevels(data.levels)
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        levels: error instanceof Error ? error.message : 'An unknown error occurred'
      }))
      setLevels([])
    } finally {
      setIsLoading(prev => ({ ...prev, levels: false }))
    }
  }

  // Fetch themes based on selected sources and levels
  const fetchThemes = async () => {
    // Skip if no sources or levels selected
    if (selectedFilters.sources.length === 0 || selectedFilters.levels.length === 0) {
      setThemes([])
      return
    }

    setIsLoading(prev => ({ ...prev, themes: true }))
    setErrors(prev => ({ ...prev, themes: null }))

    try {
      // Construct URL with source and level query parameters
      const url = new URL('/api/words/themes', window.location.origin)
      selectedFilters.sources.forEach(source =>
        url.searchParams.append('source', source)
      )
      selectedFilters.levels.forEach(level =>
        url.searchParams.append('level', level)
      )

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error('Failed to fetch themes')
      }

      const data = await response.json()
      setThemes(data.themes)
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        themes: error instanceof Error ? error.message : 'An unknown error occurred'
      }))
      setThemes([])
    } finally {
      setIsLoading(prev => ({ ...prev, themes: false }))
    }
  }

  // Update selected filters
  const updateSelectedFilters = (
    filterType: keyof FilterState,
    values: string[]
  ) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: values
    }))
  }

  // Fetch sources on initial load
  useEffect(() => {
    fetchSources()
  }, [])

  // Fetch levels when sources change
  useEffect(() => {
    fetchLevels()
  }, [selectedFilters.sources])

  // Fetch themes when sources or levels change
  useEffect(() => {
    fetchThemes()
  }, [selectedFilters.sources, selectedFilters.levels])

  // Return everything needed for the component
  return {
    // Available options
    sources,
    levels,
    themes,

    // Selected filters
    selectedFilters,
    updateSelectedFilters,

    // Loading states
    isLoading,

    // Error states
    errors,

    // Manual refetch methods
    refetchSources: fetchSources,
    refetchLevels: fetchLevels,
    refetchThemes: fetchThemes
  }
}