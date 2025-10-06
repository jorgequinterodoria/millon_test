import useSWR from 'swr';
import { useMemo } from 'react';
import { Property, PropertyApiFilters } from '@/types/property';
import { PropertyService } from '@/services/propertyService';

const fetcher = async (): Promise<Property[]> => {
  try {
    const isConnected = await PropertyService.testConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to server. Please check if the backend is running on http://localhost:5033');
    }
    
    const response = await PropertyService.getProperties({ pageSize: 1000 });
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

interface UsePropertiesOptions {
  filters?: PropertyApiFilters;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | '';
  pageNumber?: number;
  pageSize?: number;
}

export const useProperties = (options: UsePropertiesOptions = {}) => {
  const {
    filters = {},
    sortBy = '',
    pageNumber = 1,
    pageSize = 10
  } = options;

  const {
    data: allProperties = [],
    error,
    isLoading,
    mutate
  } = useSWR<Property[]>('properties', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
    errorRetryCount: 3,
    errorRetryInterval: 5000
  });

  const filterProperties = (properties: Property[], filters: PropertyApiFilters): Property[] => {
    return properties.filter(property => {
      if (filters.name && filters.name.trim()) {
        const nameMatch = property.name.toLowerCase().includes(filters.name.toLowerCase());
        if (!nameMatch) return false;
      }

      if (filters.address && filters.address.trim()) {
        const addressMatch = property.address.toLowerCase().includes(filters.address.toLowerCase());
        if (!addressMatch) return false;
      }

      if (filters.minPrice !== undefined && filters.minPrice > 0) {
        if (property.price < filters.minPrice) return false;
      }

      if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
        if (property.price > filters.maxPrice) return false;
      }

      return true;
    });
  };

  const sortProperties = (properties: Property[], sortBy: string): Property[] => {
    if (!sortBy) return properties;

    return [...properties].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  };

  const paginateProperties = (properties: Property[], pageNumber: number, pageSize: number) => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return properties.slice(startIndex, endIndex);
  };

  const processedData = useMemo(() => {
    if (!allProperties.length) {
      return {
        properties: [],
        totalCount: 0,
        totalPages: 0
      };
    }

    const filtered = filterProperties(allProperties, filters);
    const sorted = sortProperties(filtered, sortBy); 
    const totalCount = sorted.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const paginated = paginateProperties(sorted, pageNumber, pageSize);

    return {
      properties: paginated,
      totalCount,
      totalPages
    };
  }, [allProperties, filters, sortBy, pageNumber, pageSize]);

  const resetConnection = () => {
    mutate();
  };

  const refetch = () => {
    mutate();
  };

  return {
    properties: processedData.properties,
    allProperties,
    loading: isLoading,
    error: error?.message || null,
    totalCount: processedData.totalCount,
    totalPages: processedData.totalPages,
    refetch,
    resetConnection
  };
};