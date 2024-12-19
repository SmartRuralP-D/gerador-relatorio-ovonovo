import ProductiveUnit from '@/types/productive-unit'
import { apiInstance } from '../axios/instances'

async function getProductiveUnits(): Promise<ProductiveUnit[]> { // TODO: fix this
    try {
        const response = await apiInstance.get('/productive-units')
        return response.data
    } catch (error) {
        console.error(error)
        return []
    }
}

export { getProductiveUnits }