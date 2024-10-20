import React, { useEffect } from "react"

export default function useDebounce<T>(value: T, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)
  const [isLoading, setLoading] = React.useState(false)

  useEffect(() => {
    setLoading(true)

    const timer = setTimeout(() => {
      setLoading(false)
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [value, delay])

  return { debouncedValue, isLoading }
}
