using RealEstate.Application.Interfaces;
using RealEstate.Core.DTOs;
using RealEstate.Core.Entities;
using RealEstate.Core.Interfaces;

namespace RealEstate.Application.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _repository;

        public PropertyService(IPropertyRepository repository)
        {
            _repository = repository;
        }

        public async Task<(IEnumerable<PropertyDto> Properties, long TotalCount)> GetPropertiesAsync(PropertyFilterDto filter)
        {
            var properties = await _repository.GetAllAsync(filter);
            var totalCount = await _repository.GetCountAsync(filter);

            var propertyDtos = properties.Select(p => new PropertyDto
            {
                Id = p.Id,
                IdOwner = p.IdOwner,
                Name = p.Name,
                Address = p.Address,
                Price = p.Price,
                ImageUrl = p.ImageUrl
            });

            return (propertyDtos, totalCount);
        }

        public async Task<PropertyDetailDto?> GetPropertyByIdAsync(string id)
        {
            var property = await _repository.GetByIdAsync(id);
            
            if (property == null)
                return null;

            return new PropertyDetailDto
            {
                Id = property.Id,
                IdOwner = property.IdOwner,
                Name = property.Name,
                Address = property.Address,
                Price = property.Price,
                ImageUrl = property.ImageUrl,
                CreatedAt = property.CreatedAt,
                UpdatedAt = property.UpdatedAt
            };
        }

        public async Task<PropertyDto> CreatePropertyAsync(PropertyDto propertyDto)
        {
            var property = new Property
            {
                IdOwner = propertyDto.IdOwner,
                Name = propertyDto.Name,
                Address = propertyDto.Address,
                Price = propertyDto.Price,
                ImageUrl = propertyDto.ImageUrl,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var created = await _repository.CreateAsync(property);

            return new PropertyDto
            {
                Id = created.Id,
                IdOwner = created.IdOwner,
                Name = created.Name,
                Address = created.Address,
                Price = created.Price,
                ImageUrl = created.ImageUrl
            };
        }

        public async Task<bool> UpdatePropertyAsync(string id, PropertyDto propertyDto)
        {
            var existingProperty = await _repository.GetByIdAsync(id);
            
            if (existingProperty == null)
                return false;

            existingProperty.IdOwner = propertyDto.IdOwner;
            existingProperty.Name = propertyDto.Name;
            existingProperty.Address = propertyDto.Address;
            existingProperty.Price = propertyDto.Price;
            existingProperty.ImageUrl = propertyDto.ImageUrl;
            existingProperty.UpdatedAt = DateTime.UtcNow;

            return await _repository.UpdateAsync(id, existingProperty);
        }

        public async Task<bool> DeletePropertyAsync(string id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}