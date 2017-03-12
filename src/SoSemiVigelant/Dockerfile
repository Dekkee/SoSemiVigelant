FROM microsoft/aspnetcore:1.1

ARG source=./bin/Debug/netcoreapp1.6/publish
WORKDIR /app
EXPOSE 80
COPY $source .
ENTRYPOINT ["dotnet", "SoSemiVigelant.dll"]