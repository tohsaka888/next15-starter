import React, { use } from 'react'
import { getPromiseResult } from '../api'

function DynamicComponent() {
  const data = use(getPromiseResult())
  return (
    <div>DynamicComponent</div>
  )
}

export default DynamicComponent