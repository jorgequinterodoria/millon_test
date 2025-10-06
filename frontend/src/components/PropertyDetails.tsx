import { Property } from "@/types/property";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PropertyDetailsProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PropertyDetails = ({ property, open, onOpenChange }: PropertyDetailsProps) => {
  if (!property) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{property.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img 
              src={property.imageUrl} 
              alt={property.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-accent">
                {formatPrice(property.price)}
              </div>
              <Badge variant="secondary" className="text-sm">
                ID: {property.id}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <div className="font-semibold text-sm text-muted-foreground mb-1">Address</div>
                  <div className="text-foreground">{property.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <User className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <div className="font-semibold text-sm text-muted-foreground mb-1">Owner ID</div>
                  <div className="text-foreground">{property.idOwner}</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-primary rounded-lg text-primary-foreground">
              <h3 className="text-lg font-semibold mb-2">Property Details</h3>
              <p className="text-primary-foreground/90">
                This beautiful {property.name.toLowerCase()} offers exceptional value in a prime location. 
                Perfect for families or individuals looking for quality real estate.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
