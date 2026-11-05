import React from 'react'
import ProviderDashboard from './providerClient'
import { getCategories } from '@/services/provider.service'

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date
}

const ProviderAsyncPage = async () => {
  const categories: Category[] = await getCategories();
  return (
    <div>
      <ProviderDashboard categories={categories}></ProviderDashboard>
    </div>
  )
}

export default ProviderAsyncPage