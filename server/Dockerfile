# =====================================================
# Gaming Portal - Backend (.NET)
# =====================================================

# 🔥 Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies (кэширование слоев)
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# 🔥 Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Install PostgreSQL dependencies (для Npgsql)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libgdiplus \
    && rm -rf /var/lib/apt/lists/*

# Copy published files from build stage
COPY --from=build /app/publish .

# Create directory for static files (картинки игр)
RUN mkdir -p /app/wwwroot/images/games

# 🔥 Environment variables
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# 🔥 Expose port
EXPOSE 5000

# 🔥 Entry point
ENTRYPOINT ["dotnet", "server.dll"]