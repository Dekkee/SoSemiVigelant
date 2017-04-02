FROM docker pull microsoft/aspnetcore:1.1

RUN dotnet restore ./src/SoSemiVigelant
RUN dotnet build ./src/SoSemiVigelant
RUN dotnet publish ./src/SoSemiVigelant

ARG source=./bin/Debug/netcoreapp1.1/publish
WORKDIR /app
EXPOSE 80
COPY $source .
ENTRYPOINT ["dotnet", "SoSemiVigelant.dll"]