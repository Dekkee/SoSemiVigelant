FROM microsoft/aspnetcore-build:1.1.1

ARG source=./bin/Debug/netcoreapp1.1/publish
WORKDIR /app
EXPOSE 80

COPY . .

RUN dotnet restore ./src/SoSemiVigelant
RUN dotnet build ./src/SoSemiVigelant
RUN dotnet publish ./src/SoSemiVigelant

#COPY $source .

ENTRYPOINT ["dotnet", "SoSemiVigelant.dll"]