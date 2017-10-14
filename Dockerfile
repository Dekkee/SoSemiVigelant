# Sample contents of Dockerfile
# Stage 1
FROM microsoft/aspnetcore-build AS builder
WORKDIR /source

# caches restore result by copying sln file separately
COPY . .
RUN dotnet restore

# copies the rest of your code
RUN dotnet publish --output /app/ --configuration Release

# Stage 2
FROM microsoft/aspnetcore
WORKDIR /app
COPY --from=builder /app .
ENTRYPOINT ["dotnet", "SoSemiVigelant.dll"]