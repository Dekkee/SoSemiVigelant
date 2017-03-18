FROM microsoft/dotnet:nanoserver

ARG source=./bin/Debug/netcoreapp1.6/publish
RUN ["dir"]
WORKDIR /app
EXPOSE 80
COPY $source .
ENTRYPOINT ["dotnet", "SoSemiVigelant.dll"]