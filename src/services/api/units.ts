import ProductiveUnit from '@/types/productive-unit'
import { apiInstance } from '@/services/axios/instances'

function getProductiveUnits(): ProductiveUnit[] { // TODO: fix this
    const units: ProductiveUnit[] = [
        {
            id: "6cdd7960-a83d-11ef-b6dc-a9fefe276cc8",
        },
        {
            id: "6bd2b1e0-cb4b-11ee-b827-474e1902aece",
        },
        {
            id: "5d90cae0-cb4b-11ee-b827-474e1902aece",
        },
        {
            id: "53175d90-cb4b-11ee-b585-21e4bffd617b",
        },
        {
            id: "262fd730-1c22-11ef-a03d-1735cad43e87",
        }
    ]
    return units
}

async function fetchProductiveUnits(token: string): Promise<ProductiveUnit[]> {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const unitDetailsPromises = getProductiveUnits().map(async (unit, index) => {
        await delay(index * 500);
        return apiInstance.get('/reports/get_uni_prod_details', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                unit_id: unit.id
            }
        }).then(
            response => response.data
        ).catch(error => {
                console.error(`Error fetching details for unit ${unit.id}:`, error)
                return null
        });
    });
    const responses = await Promise.all(unitDetailsPromises);
    return responses.filter(response => response !== null);
}

export { getProductiveUnits, fetchProductiveUnits }
