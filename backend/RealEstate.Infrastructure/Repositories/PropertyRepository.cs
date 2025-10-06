using MongoDB.Driver;
using RealEstate.Core.DTOs;
using RealEstate.Core.Entities;
using RealEstate.Core.Interfaces;
using RealEstate.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace RealEstate.Infrastructure.Repositories
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly IMongoCollection<Property> _properties;

        public PropertyRepository(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _properties = database.GetCollection<Property>(settings.Value.PropertiesCollectionName);
            
            // Crear índices para mejorar el rendimiento de búsquedas
            CreateIndexes();
        }

        private void CreateIndexes()
        {
            var indexKeysDefinition = Builders<Property>.IndexKeys
                .Ascending(p => p.Name)
                .Ascending(p => p.Address)
                .Ascending(p => p.Price);
            
            var indexModel = new CreateIndexModel<Property>(indexKeysDefinition);
            _properties.Indexes.CreateOneAsync(indexModel);
        }

        public async Task<IEnumerable<Property>> GetAllAsync(PropertyFilterDto filter)
        {
            var filterBuilder = Builders<Property>.Filter;
            var filters = new List<FilterDefinition<Property>>();

            // Filtro por nombre (búsqueda parcial, insensible a mayúsculas)
            if (!string.IsNullOrWhiteSpace(filter.Name))
            {
                filters.Add(filterBuilder.Regex(p => p.Name, 
                    new MongoDB.Bson.BsonRegularExpression(filter.Name, "i")));
            }

            // Filtro por dirección (búsqueda parcial, insensible a mayúsculas)
            if (!string.IsNullOrWhiteSpace(filter.Address))
            {
                filters.Add(filterBuilder.Regex(p => p.Address, 
                    new MongoDB.Bson.BsonRegularExpression(filter.Address, "i")));
            }

            // Filtro por rango de precio
            if (filter.MinPrice.HasValue)
            {
                filters.Add(filterBuilder.Gte(p => p.Price, filter.MinPrice.Value));
            }

            if (filter.MaxPrice.HasValue)
            {
                filters.Add(filterBuilder.Lte(p => p.Price, filter.MaxPrice.Value));
            }

            // Combinar todos los filtros
            var combinedFilter = filters.Count > 0 
                ? filterBuilder.And(filters) 
                : filterBuilder.Empty;

            // Aplicar paginación
            var skip = (filter.PageNumber - 1) * filter.PageSize;

            return await _properties.Find(combinedFilter)
                .Skip(skip)
                .Limit(filter.PageSize)
                .SortBy(p => p.Name)
                .ToListAsync();
        }

        public async Task<Property?> GetByIdAsync(string id)
        {
            return await _properties.Find(p => p.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Property> CreateAsync(Property property)
        {
            await _properties.InsertOneAsync(property);
            return property;
        }

        public async Task<bool> UpdateAsync(string id, Property property)
        {
            property.UpdatedAt = DateTime.UtcNow;
            var result = await _properties.ReplaceOneAsync(p => p.Id == id, property);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _properties.DeleteOneAsync(p => p.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<long> GetCountAsync(PropertyFilterDto filter)
        {
            var filterBuilder = Builders<Property>.Filter;
            var filters = new List<FilterDefinition<Property>>();

            if (!string.IsNullOrWhiteSpace(filter.Name))
            {
                filters.Add(filterBuilder.Regex(p => p.Name, 
                    new MongoDB.Bson.BsonRegularExpression(filter.Name, "i")));
            }

            if (!string.IsNullOrWhiteSpace(filter.Address))
            {
                filters.Add(filterBuilder.Regex(p => p.Address, 
                    new MongoDB.Bson.BsonRegularExpression(filter.Address, "i")));
            }

            if (filter.MinPrice.HasValue)
            {
                filters.Add(filterBuilder.Gte(p => p.Price, filter.MinPrice.Value));
            }

            if (filter.MaxPrice.HasValue)
            {
                filters.Add(filterBuilder.Lte(p => p.Price, filter.MaxPrice.Value));
            }

            var combinedFilter = filters.Count > 0 
                ? filterBuilder.And(filters) 
                : filterBuilder.Empty;

            return await _properties.CountDocumentsAsync(combinedFilter);
        }
    }
}