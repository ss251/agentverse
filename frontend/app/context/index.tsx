'use client'

import React, {ReactNode} from 'react'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

import {State} from 'wagmi'

// Setup queryClient
const queryClient = new QueryClient()

export function ContextProvider(
  {
    children,
    initialState
  }: {
    children: ReactNode
    initialState?: State
  }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}