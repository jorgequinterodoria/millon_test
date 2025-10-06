using RealEstate.Core.DTOs;
using RealEstate.Core.Entities;

namespace RealEstate.Core.Interfaces
{
    public interface IPropertyRepository
    {
        Task<IEnumerable<Property>> GetAllAsync(PropertyFilterDto filter);
        Task<Property?> GetByIdAsync(string id);
        Task<Property> CreateAsync(Property property);
        Task<bool> UpdateAsync(string id, Property property);
        Task<bool> DeleteAsync(string id);
        Task<long> GetCountAsync(PropertyFilterDto filter);
    }
}