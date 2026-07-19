import React from 'react'

type Props = {
    rules?: string
}

const SettlementRule = ({rules}: Props) => {
  return (
    <div>
        {
            rules && (
              <div>
                <p className="text-gray-900 font-medium mb-1">
                  聚落规则
                </p>

                <p className="bg-gray-50 rounded-xl p-3 text-sm">
                  {rules}
                </p>
              </div>
            )
          }
    </div>
  )
}

export default SettlementRule