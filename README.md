SoSemiVigelant
===============

Аукционная приложуха для топдека в доккер контейнере

* Бэк на **ASP.NET Core**
* Фронт на **React/Redux**
* Данные в **PostgreSQL**

Как запустить
-------------

```bash
git clone https://bitbucket.org/Dekkee/sosemivigelant.git sosemivigelant
cd sosemivigelant

# Создаем volume чтобы персистентное хранилище в докере под виндой работало
docker volume create --name sql.data -d local

docker-compose up -d

```