FROM microsoft/dotnet:nanoserver

ARG source=./bin/Debug/netcoreapp1.1/publish
WORKDIR /app
EXPOSE 80
COPY $source .
ENTRYPOINT ["dotnet", "SoSemiVigelant.dll"]