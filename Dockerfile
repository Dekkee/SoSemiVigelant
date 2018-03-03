# Sample contents of Dockerfile
# Stage 1
FROM microsoft/aspnetcore-build AS builder
WORKDIR /source

# caches restore result by copying sln and csproj file separately
COPY *.sln .
COPY SoSemiVigelant/*.csproj SoSemiVigelant/
COPY SoSemiVigelant.Data/*.csproj SoSemiVigelant.Data/
COPY SoSemiVigelant.Core/*.csproj SoSemiVigelant.Core/
COPY SoSemiVigelant.Provider/*.csproj SoSemiVigelant.Provider/
RUN dotnet restore

# copies the rest of your code
COPY . .
RUN dotnet publish --output /app/ --configuration Release

# Stage 2
FROM microsoft/aspnetcore
WORKDIR /app
COPY --from=builder /app .

ENV NODE_VERSION 8.7.0
ENV NPM_VERSION 5.5.1
RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
  # && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  # && gpg --verify SHASUMS256.txt.asc \
  # && grep " node-v$NODE_VERSION-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \
  && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  # && rm "node-v$NODE_VERSION-linux-x64.tar.gz" SHASUMS256.txt.asc \
  && npm install -g "npm@$NPM_VERSION" 
  # && npm cache clear

ENTRYPOINT ["dotnet", "SoSemiVigelant.dll"]