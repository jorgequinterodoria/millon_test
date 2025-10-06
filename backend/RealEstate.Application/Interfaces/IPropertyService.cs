using RealEstate.Core.DTOs;

namespace RealEstate.Application.Interfaces
{
    public interface IPropertyService
    {
        Task<(IEnumerable<PropertyDto> Properties, long TotalCount)> GetPropertiesAsync(PropertyFilterDto filter);
        Task<PropertyDetailDto?> GetPropertyByIdAsync(string id);
        Task<PropertyDto> CreatePropertyAsync(PropertyDto propertyDto);
        Task<bool> UpdatePropertyAsync(string id, PropertyDto propertyDto);
        Task<bool> DeletePropertyAsync(string id);
    }
}