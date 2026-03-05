FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["SyncRoom.Api/SyncRoom.Api.csproj", "SyncRoom.Api/"]

RUN dotnet restore "SyncRoom.Api/SyncRoom.Api.csproj"

COPY . .


RUN dotnet publish "SyncRoom.Api/SyncRoom.Api.csproj" -c Release -o /app/out

FROM base AS final
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "SyncRoom.Api.dll"]