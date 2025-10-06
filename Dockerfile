FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar archivos de proyecto
COPY backend/RealEstate.API/RealEstate.API.csproj backend/RealEstate.API/
COPY backend/RealEstate.Application/RealEstate.Application.csproj backend/RealEstate.Application/
COPY backend/RealEstate.Core/RealEstate.Core.csproj backend/RealEstate.Core/
COPY backend/RealEstate.Infrastructure/RealEstate.Infrastructure.csproj backend/RealEstate.Infrastructure/

# Restaurar dependencias
RUN dotnet restore backend/RealEstate.API/RealEstate.API.csproj

# Copiar todo el código
COPY backend/ backend/

# Compilar
WORKDIR /src/backend/RealEstate.API
RUN dotnet build RealEstate.API.csproj -c Release -o /app/build

FROM build AS publish
RUN dotnet publish RealEstate.API.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RealEstate.API.dll"]