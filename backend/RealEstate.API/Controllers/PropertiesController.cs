using Microsoft.AspNetCore.Mvc;
using RealEstate.Application.Interfaces;
using RealEstate.Core.DTOs;

namespace RealEstate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        private readonly ILogger<PropertiesController> _logger;

        public PropertiesController(
            IPropertyService propertyService, 
            ILogger<PropertiesController> logger)
        {
            _propertyService = propertyService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene una lista de propiedades con filtros opcionales
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<object>> GetProperties(
            [FromQuery] string? name,
            [FromQuery] string? address,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var filter = new PropertyFilterDto
                {
                    Name = name,
                    Address = address,
                    MinPrice = minPrice,
                    MaxPrice = maxPrice,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };

                var (properties, totalCount) = await _propertyService.GetPropertiesAsync(filter);

                var response = new
                {
                    data = properties,
                    totalCount,
                    pageNumber,
                    pageSize,
                    totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener propiedades");
                return StatusCode(500, new { message = "Error al obtener propiedades", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene una propiedad por su ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PropertyDetailDto>> GetPropertyById(string id)
        {
            try
            {
                var property = await _propertyService.GetPropertyByIdAsync(id);

                if (property == null)
                {
                    return NotFound(new { message = $"Propiedad con ID {id} no encontrada" });
                }

                return Ok(property);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener propiedad con ID: {Id}", id);
                return StatusCode(500, new { message = "Error al obtener la propiedad", error = ex.Message });
            }
        }

        /// <summary>
        /// Crea una nueva propiedad
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PropertyDto>> CreateProperty([FromBody] PropertyDto propertyDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdProperty = await _propertyService.CreatePropertyAsync(propertyDto);
                
                return CreatedAtAction(
                    nameof(GetPropertyById), 
                    new { id = createdProperty.Id }, 
                    createdProperty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear propiedad");
                return StatusCode(500, new { message = "Error al crear la propiedad", error = ex.Message });
            }
        }

        /// <summary>
        /// Actualiza una propiedad existente
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateProperty(string id, [FromBody] PropertyDto propertyDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updated = await _propertyService.UpdatePropertyAsync(id, propertyDto);

                if (!updated)
                {
                    return NotFound(new { message = $"Propiedad con ID {id} no encontrada" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar propiedad con ID: {Id}", id);
                return StatusCode(500, new { message = "Error al actualizar la propiedad", error = ex.Message });
            }
        }

        /// <summary>
        /// Elimina una propiedad
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteProperty(string id)
        {
            try
            {
                var deleted = await _propertyService.DeletePropertyAsync(id);

                if (!deleted)
                {
                    return NotFound(new { message = $"Propiedad con ID {id} no encontrada" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar propiedad con ID: {Id}", id);
                return StatusCode(500, new { message = "Error al eliminar la propiedad", error = ex.Message });
            }
        }
    }
}