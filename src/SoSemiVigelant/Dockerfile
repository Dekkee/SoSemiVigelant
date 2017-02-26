FROM microsoft/dotnet:1.0.0-core

# Copy the app
COPY . /app

# Set the Working Directory
WORKDIR /app

RUN ["dotnet", "restore"]
RUN ["dotnet", "build"]

# Configure the listening port to 5000
ENV ASPNETCORE_URLS http://*:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "run"]