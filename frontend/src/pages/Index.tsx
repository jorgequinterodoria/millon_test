import { useState } from "react";
import { Property, PropertyFilters as Filters } from "@/types/property";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyFilters } from "@/components/PropertyFilters";
import { PropertyDetails } from "@/components/PropertyDetails";
import { Pagination } from "@/components/Pagination";
import { useProperties } from "@/hooks/useProperties";
import { Building2, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [filters, setFilters] = useState<Filters>({
    name: "",
    address: "",
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: "",
    pageNumber: 1,
    pageSize: 10
  });
  
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  // Usar el nuevo hook con useSWR
  const { 
    properties, 
    loading, 
    error, 
    totalCount, 
    totalPages, 
    refetch, 
    resetConnection 
  } = useProperties({
    filters: {
      name: filters.name,
      address: filters.address,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice
    },
    sortBy: filters.sortBy,
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize
  });

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setDetailsOpen(true);
  };

  const handleApplyFilters = () => {
    // Con useSWR, solo necesitamos actualizar el estado de filtros
    // El hook se encargará automáticamente del filtrado
    setFilters(prev => ({ ...prev, pageNumber: 1 }));
  };

  const handleRetry = () => {
    resetConnection();
    refetch();
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, pageNumber: page }));
  };



  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Error loading properties</h2>
          <p className="text-muted-foreground mb-4 text-sm">{error}</p>
          <div className="space-y-2">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <p className="text-xs text-muted-foreground">
              Ensure the backend is running at http://localhost:5033
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Property Finder</h1>
              <p className="text-sm text-muted-foreground">Discover your dream property</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <PropertyFilters 
          filters={filters} 
          onFiltersChange={setFilters}
          onApplyFilters={handleApplyFilters}
          loading={loading}
        />

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Available Properties
            {!loading && (
              <span className="ml-3 text-lg font-normal text-muted-foreground">
                ({totalCount} {totalCount === 1 ? 'property' : 'properties'})
              </span>
            )}
          </h2>
          {!loading && totalPages > 1 && (
            <div className="text-sm text-muted-foreground">
              Page {filters.pageNumber || 1} of {totalPages}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No se encontraron propiedades</h3>
            <p className="text-muted-foreground">Intenta ajustar tus filtros para ver más resultados</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => handlePropertyClick(property)}
                />
              ))}
            </div>
            
            <Pagination
              currentPage={filters.pageNumber || 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </>
        )}
      </main>

      <PropertyDetails
        property={selectedProperty}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
};

export default Index;
