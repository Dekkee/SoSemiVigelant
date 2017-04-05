SoSemiVigelant
===============

Аукционная приложуха для топдека в доккер контейнере

* Бэк на **ASP.NET Core**
* Фронт на **React/Redux**
* Данные в **PostgreSQL**

Статус сборки
-------------

| Ветка     | Статус                                                                                                             |
|-----------|--------------------------------------------------------------------------------------------------------------------|
| `dev`     | ![dev](https://teamcity.dekkee.com/app/rest/builds/buildType%3A%28id%3ASosemivigelant_Build%29/statusIcon)         |

Как запустить
-------------

```bash
git clone https://bitbucket.org/Dekkee/sosemivigelant.git sosemivigelant
cd sosemivigelant

# Создаем volume чтобы персистентное хранилище в докере под виндой работало
docker volume create --name sql.data -d local

docker-compose up -d

```