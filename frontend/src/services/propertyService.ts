import { Property, PropertyApiFilters, ApiResponse } from "@/types/property";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://millon-test.onrender.com/api";

export class PropertyService {
  static async getProperties(filters: PropertyApiFilters = {}): Promise<ApiResponse<Property>> {
    const queryParams = new URLSearchParams();
    
    if (filters.name && filters.name.trim()) queryParams.append('name', filters.name.trim());
    if (filters.address && filters.address.trim()) queryParams.append('address', filters.address.trim());
    if (filters.minPrice !== undefined && filters.minPrice > 0) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters.pageNumber !== undefined && filters.pageNumber > 0) queryParams.append('pageNumber', filters.pageNumber.toString());
    if (filters.pageSize !== undefined && filters.pageSize > 0) queryParams.append('pageSize', filters.pageSize.toString());

    const url = `${API_BASE_URL}/Properties${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorText = await response.text();
          console.error('Error response body:', errorText);
          errorMessage += ` - ${errorText}`;
        } catch (e) {
          console.error('Could not read error response body');
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        return {
          data: data,
          totalCount: data.length,
          pageNumber: filters.pageNumber || 1,
          pageSize: filters.pageSize || data.length,
          totalPages: 1
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      console.error('URL that failed:', url);
      console.error('Filters used:', filters);
      throw error;
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/Properties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}