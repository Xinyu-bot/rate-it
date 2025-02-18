# -------------------- STAGE 1: BUILD --------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY backend.csproj ./
RUN dotnet restore

# Copy the rest of the source code and publish the app in Release mode
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# -------------------- STAGE 2: RUNTIME --------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/publish .

# Expose the port Render will use
EXPOSE 8080

# Instruct ASP.NET Core to listen on port 8080
ENV ASPNETCORE_URLS=http://+:8080

# Use the published DLL as the entry point
ENTRYPOINT ["dotnet", "backend.dll"]
