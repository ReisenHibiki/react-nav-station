import React from 'react'

type Props = {}

const loading = (props: Props) => {
  return (
<main className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="w-full m-3 max-w-xl rounded-2xl bg-white p-8 shadow-xl">

        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-8"/>

        <div className="space-y-5">

          <div className="h-12 bg-gray-200 rounded animate-pulse"/>
          <div className="h-12 bg-gray-200 rounded animate-pulse"/>
          <div className="h-12 bg-gray-200 rounded animate-pulse"/>
          <div className="h-12 bg-gray-200 rounded animate-pulse"/>

        </div>

      </div>
    </main>
  )
}

export default loading