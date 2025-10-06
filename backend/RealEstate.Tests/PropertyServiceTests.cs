using Moq;
using NUnit.Framework;
using RealEstate.Application.Services;
using RealEstate.Core.DTOs;
using RealEstate.Core.Entities;
using RealEstate.Core.Interfaces;

namespace RealEstate.Tests
{
    [TestFixture]
    public class PropertyServiceTests
    {
        private Mock<IPropertyRepository> _repositoryMock;
        private PropertyService _service;

        [SetUp]
        public void Setup()
        {
            _repositoryMock = new Mock<IPropertyRepository>();
            _service = new PropertyService(_repositoryMock.Object);
        }

        [Test]
        public async Task GetPropertiesAsync_ShouldReturnPropertiesAndCount()
        {
            // Arrange
            var filter = new PropertyFilterDto { PageNumber = 1, PageSize = 10 };
            var properties = new List<Property>
            {
                new Property
                {
                    Id = "1",
                    IdOwner = "OW001",
                    Name = "Test Property",
                    Address = "123 Test St",
                    Price = 100000,
                    ImageUrl = "test.jpg"
                }
            };

            _repositoryMock.Setup(r => r.GetAllAsync(It.IsAny<PropertyFilterDto>()))
                .ReturnsAsync(properties);
            _repositoryMock.Setup(r => r.GetCountAsync(It.IsAny<PropertyFilterDto>()))
                .ReturnsAsync(1);

            // Act
            var (result, count) = await _service.GetPropertiesAsync(filter);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(count, Is.EqualTo(1));
            Assert.That(result.Count(), Is.EqualTo(1));
            _repositoryMock.Verify(r => r.GetAllAsync(It.IsAny<PropertyFilterDto>()), Times.Once);
            _repositoryMock.Verify(r => r.GetCountAsync(It.IsAny<PropertyFilterDto>()), Times.Once);
        }

        [Test]
        public async Task GetPropertyByIdAsync_WhenExists_ShouldReturnProperty()
        {
            // Arrange
            var propertyId = "1";
            var property = new Property
            {
                Id = propertyId,
                IdOwner = "OW001",
                Name = "Test Property",
                Address = "123 Test St",
                Price = 100000,
                ImageUrl = "test.jpg",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(propertyId))
                .ReturnsAsync(property);

            // Act
            var result = await _service.GetPropertyByIdAsync(propertyId);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(propertyId));
            Assert.That(result.Name, Is.EqualTo("Test Property"));
            _repositoryMock.Verify(r => r.GetByIdAsync(propertyId), Times.Once);
        }

        [Test]
        public async Task GetPropertyByIdAsync_WhenNotExists_ShouldReturnNull()
        {
            // Arrange
            var propertyId = "999";
            _repositoryMock.Setup(r => r.GetByIdAsync(propertyId))
                .ReturnsAsync((Property?)null);

            // Act
            var result = await _service.GetPropertyByIdAsync(propertyId);

            // Assert
            Assert.That(result, Is.Null);
            _repositoryMock.Verify(r => r.GetByIdAsync(propertyId), Times.Once);
        }

        [Test]
        public async Task CreatePropertyAsync_ShouldCreateAndReturnProperty()
        {
            // Arrange
            var propertyDto = new PropertyDto
            {
                IdOwner = "OW001",
                Name = "New Property",
                Address = "456 New St",
                Price = 200000,
                ImageUrl = "new.jpg"
            };

            var createdProperty = new Property
            {
                Id = "123",
                IdOwner = propertyDto.IdOwner,
                Name = propertyDto.Name,
                Address = propertyDto.Address,
                Price = propertyDto.Price,
                ImageUrl = propertyDto.ImageUrl
            };

            _repositoryMock.Setup(r => r.CreateAsync(It.IsAny<Property>()))
                .ReturnsAsync(createdProperty);

            // Act
            var result = await _service.CreatePropertyAsync(propertyDto);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo("123"));
            Assert.That(result.Name, Is.EqualTo(propertyDto.Name));
            _repositoryMock.Verify(r => r.CreateAsync(It.IsAny<Property>()), Times.Once);
        }

        [Test]
        public async Task UpdatePropertyAsync_WhenExists_ShouldReturnTrue()
        {
            // Arrange
            var propertyId = "1";
            var existingProperty = new Property
            {
                Id = propertyId,
                IdOwner = "OW001",
                Name = "Old Name",
                Address = "Old Address",
                Price = 100000,
                ImageUrl = "old.jpg"
            };

            var updatedDto = new PropertyDto
            {
                IdOwner = "OW001",
                Name = "Updated Name",
                Address = "Updated Address",
                Price = 150000,
                ImageUrl = "updated.jpg"
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(propertyId))
                .ReturnsAsync(existingProperty);
            _repositoryMock.Setup(r => r.UpdateAsync(propertyId, It.IsAny<Property>()))
                .ReturnsAsync(true);

            // Act
            var result = await _service.UpdatePropertyAsync(propertyId, updatedDto);

            // Assert
            Assert.That(result, Is.True);
            _repositoryMock.Verify(r => r.GetByIdAsync(propertyId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(propertyId, It.IsAny<Property>()), Times.Once);
        }

        [Test]
        public async Task UpdatePropertyAsync_WhenNotExists_ShouldReturnFalse()
        {
            // Arrange
            var propertyId = "999";
            var updatedDto = new PropertyDto
            {
                IdOwner = "OW001",
                Name = "Updated Name",
                Address = "Updated Address",
                Price = 150000,
                ImageUrl = "updated.jpg"
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(propertyId))
                .ReturnsAsync((Property?)null);

            // Act
            var result = await _service.UpdatePropertyAsync(propertyId, updatedDto);

            // Assert
            Assert.That(result, Is.False);
            _repositoryMock.Verify(r => r.GetByIdAsync(propertyId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<string>(), It.IsAny<Property>()), Times.Never);
        }

        [Test]
        public async Task DeletePropertyAsync_ShouldCallRepository()
        {
            // Arrange
            var propertyId = "1";
            _repositoryMock.Setup(r => r.DeleteAsync(propertyId))
                .ReturnsAsync(true);

            // Act
            var result = await _service.DeletePropertyAsync(propertyId);

            // Assert
            Assert.That(result, Is.True);
            _repositoryMock.Verify(r => r.DeleteAsync(propertyId), Times.Once);
        }

        [Test]
        public async Task GetPropertiesAsync_WithFilters_ShouldApplyFilters()
        {
            // Arrange
            var filter = new PropertyFilterDto
            {
                Name = "Luxury",
                Address = "Beach",
                MinPrice = 100000,
                MaxPrice = 500000,
                PageNumber = 1,
                PageSize = 5
            };

            var properties = new List<Property>
            {
                new Property
                {
                    Id = "1",
                    IdOwner = "OW001",
                    Name = "Luxury Villa",
                    Address = "Beach Road",
                    Price = 300000,
                    ImageUrl = "villa.jpg"
                }
            };

            _repositoryMock.Setup(r => r.GetAllAsync(filter))
                .ReturnsAsync(properties);
            _repositoryMock.Setup(r => r.GetCountAsync(filter))
                .ReturnsAsync(1);

            // Act
            var (result, count) = await _service.GetPropertiesAsync(filter);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(count, Is.EqualTo(1));
            Assert.That(result.First().Name, Does.Contain("Luxury"));
            _repositoryMock.Verify(r => r.GetAllAsync(filter), Times.Once);
        }
    }
}