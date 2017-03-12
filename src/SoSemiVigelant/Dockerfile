FROM microsoft/aspnetcore:1.1

#COPY . /app
#WORKDIR /app

#RUN ["dotnet", "restore"]
#RUN ["dotnet", "build"]

# Configure the listening port to 5000
#ENV ASPNETCORE_URLS http://*:5000
#EXPOSE 5000

#COPY ${source:-obj/Docker/publish} .
ENTRYPOINT ["dotnet", "SoSemiVigelant.dll"]

ARG source=.
WORKDIR /app
ENV ASPNETCORE_URLS http://+:5000
EXPOSE 5000
COPY $source .