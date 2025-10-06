import { PropertyFilters as Filters } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, DollarSign, MapPin, ArrowUpDown, X, Grid3X3, Filter, ChevronDown } from "lucide-react";
import { useState, useCallback, useMemo } from "react";

interface PropertyFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onApplyFilters: () => void;
  loading?: boolean;
}

export const PropertyFilters = ({ 
  filters, 
  onFiltersChange, 
  onApplyFilters, 
  loading = false 
}: PropertyFiltersProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  const [localMinPrice, setLocalMinPrice] = useState<string>("");
  const [localMaxPrice, setLocalMaxPrice] = useState<string>("");

  const handleNameChange = useCallback((value: string) => {
    onFiltersChange({ ...filters, name: value });
  }, [filters, onFiltersChange]);

  const handleAddressChange = useCallback((value: string) => {
    onFiltersChange({ ...filters, address: value });
  }, [filters, onFiltersChange]);

  const handleSortChange = useCallback((value: string) => {
    const sortValue = value === "none" ? "" : value;
    onFiltersChange({ ...filters, sortBy: sortValue as Filters['sortBy'] });
  }, [filters, onFiltersChange]);

  const handlePageSizeChange = useCallback((value: string) => {
    const pageSize = parseInt(value);
    onFiltersChange({ ...filters, pageSize, pageNumber: 1 });
  }, [filters, onFiltersChange]);

  const handleClearFilters = useCallback(() => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    onFiltersChange({
      name: "",
      address: "",
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: "",
      pageNumber: 1,
      pageSize: 10
    });
  }, [onFiltersChange]);

  const handleApplyFiltersWithPrices = useCallback(() => {
    const minPrice = localMinPrice === "" ? undefined : parseFloat(localMinPrice);
    const maxPrice = localMaxPrice === "" ? undefined : parseFloat(localMaxPrice);
    
    onFiltersChange({ 
      ...filters, 
      minPrice: isNaN(minPrice!) ? undefined : minPrice,
      maxPrice: isNaN(maxPrice!) ? undefined : maxPrice
    });
    
    onApplyFilters();
  }, [filters, localMinPrice, localMaxPrice, onFiltersChange, onApplyFilters]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyFiltersWithPrices();
    }
  }, [handleApplyFiltersWithPrices]);
  
  const getActiveFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.name) count++;
    if (filters.address) count++;
    if (filters.minPrice !== undefined || localMinPrice !== "") count++;
    if (filters.maxPrice !== undefined || localMaxPrice !== "") count++;
    if (filters.sortBy) count++;
    return count;
  }, [filters, localMinPrice, localMaxPrice]);

  const filtersContent = useMemo(() => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search by name */}
        <div className="space-y-2">
          <Label htmlFor="name-search" className="text-sm font-medium text-foreground">
            Search by name
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="name-search"
              type="text"
              placeholder="Property name..."
              value={filters.name || ""}
              onChange={(e) => handleNameChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
        </div>

        {/* Search by address */}
        <div className="space-y-2">
          <Label htmlFor="address-search" className="text-sm font-medium text-foreground">
            Search by address
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="address-search"
              type="text"
              placeholder="Property address..."
              value={filters.address || ""}
              onChange={(e) => handleAddressChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
        </div>

        {/* Minimum price */}
        <div className="space-y-2">
          <Label htmlFor="min-price" className="text-sm font-medium text-foreground">
            Minimum price
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="min-price"
              type="number"
              placeholder="0"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
        </div>

        {/* Maximum price */}
        <div className="space-y-2">
          <Label htmlFor="max-price" className="text-sm font-medium text-foreground">
            Maximum price
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="max-price"
              type="number"
              placeholder="No limit"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        {/* Sort by */}
        <div className="space-y-2 flex-1">
          <Label htmlFor="sort-by" className="text-sm font-medium text-foreground">
            Sort by
          </Label>
          <Select value={filters.sortBy || "none"} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Select sort order" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No sort</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Elements per page */}
        <div className="space-y-2">
          <Label htmlFor="page-size" className="text-sm font-medium text-foreground">
            Elements per page
          </Label>
          <Select value={filters.pageSize?.toString() || "10"} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-32">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-muted-foreground" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleApplyFiltersWithPrices} 
            disabled={loading}
            className="bg-gradient-primary hover:bg-gradient-primary/90"
          >
            {loading ? "Searching..." : "Search"}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Clear filters
          </Button>
        </div>
      </div>
    </>
  ), [
    filters,
    localMinPrice,
    localMaxPrice,
    loading,
    handleNameChange,
    handleAddressChange,
    handleKeyPress,
    handleSortChange,
    handlePageSizeChange,
    handleApplyFiltersWithPrices,
    handleClearFilters
  ]);

  if (isMobile) {
    return (
      <div className="bg-card rounded-lg border border-border mb-8 shadow-soft">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-6 h-auto text-left"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <span className="font-medium">
                  Filters
                  {getActiveFiltersCount > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {getActiveFiltersCount}
                    </span>
                  )}
                </span>
              </div>
              <ChevronDown 
                className={`w-5 h-5 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180' : ''
                }`} 
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-6 pb-6">
            {filtersContent}
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-8 shadow-soft">
      {filtersContent}
    </div>
  );
};