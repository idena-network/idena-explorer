import {useEffect, useState} from 'react'

export function useHashChange(onHashChange) {
  useEffect(() => {
    const change = () => onHashChange(window.location.hash)

    window.addEventListener('hashchange', change)

    return () => window.removeEventListener('hashchange', change)
  }, [])
}

export function useHash() {
  const [hash, setHash] = useState()

  useEffect(() => {
    setHash(window.location.hash)
  }, [])

  return {hash, hashReady: hash !== undefined, setHash}
}
