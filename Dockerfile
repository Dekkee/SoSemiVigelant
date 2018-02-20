# Sample contents of Dockerfile
# Stage 1
FROM microsoft/aspnetcore-build AS builder
WORKDIR /source

# caches restore result by copying sln and csproj file separately
COPY *.sln .
COPY src/SoSemiVigelant/*.csproj src/SoSemiVigelant/
COPY src/SoSemiVigelant.Data/*.csproj src/SoSemiVigelant.Data/
COPY src/SoSemiVigelant.Core/*.csproj src/SoSemiVigelant.Core/
COPY src/SoSemiVigelant.Provider/*.csproj src/SoSemiVigelant.Provider/
RUN dotnet restore

# copies the rest of your code
COPY . .
RUN dotnet publish --output /app/ --configuration Release

# Stage 2
FROM microsoft/aspnetcore
WORKDIR /app
COPY --from=builder /app .

ENTRYPOINT ["dotnet", "SoSemiVigelant.dll"]