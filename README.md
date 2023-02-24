# API Rick Recipes

API del marketplace de [Rickrecipes](https://rickrecipes.com) hecha con [Nestjs](https://nestjs.com/) donde se pueden publicar recetas, planes alimenticios, combos y más.

## Índice de Contenido

## Instalación
1. Clonar repositorio

```
git clone https://github.com/ICKillerGH/rickrecipes-api.git
```

2. Instalar dependencias

```
npm install
```

3. Copiar el contenido de .env.example en un archivo .env y actulizar los valores

4. Crear una base de datos mysql para el usar en la aplicación

5. Copiar el contenido de ormconfig.ts.example en un archivo ormconfig.ts y actulizar los valores

6. Ejecutar migraciones

```
npm run migration:run
```

7. Ejecutar projecto

```
npm run start:dev
```
El projecto correra en [http://localhost:3000](http:://localhost:3000)

## Estructura de directorios
- **src**

    Contiene todos los modulos del proyecto, es decir, en él se almacena todo el código fuente

- **templates**

    Contiene los templates en de handlebars para envio de correos y otras cosas similares

- **test**

    Contiene los test automatizados del proyecto

- **uploads**

    Contiene los archivos que se suben al sistema

Cada modulo dentro de **src** suele contener las siguientes carpetas y archivos:

- **decorators**

    Contiene los [decorators](https://docs.nestjs.com/custom-decorators) perzonalizados de nest usados en el módulo

- **dto**

    Contiene los Data Transfer Object (DTO) del módulo que sirven para estandarizar la data que se devuelve al usuario y además se usan para validar la data que ingresa en cada endpoint

- **entities**

    Contiene las entidades de [TypeORM](https://typeorm.io/) correspondientes a las tablas en la base de datos

- **errors**

    Contiene las excepciónes que puede llegar a arrojar un módulo

- **pipes**

    Contiene las [pipes](https://docs.nestjs.com/pipes) perzonalizadas de nest usadas en el módulo, generalmente tiene por lo menos un pipe de paginación de resultados

- **nombre-de-modulo.controller.ts**

    Archivo donde se definen las rutas o urls disponibles en la aplicación

- **nombre-de-modulo.service.ts**

    Archivo donde se ejecuta la lógica de negocio correspondiente a cada endpoint, los servicios son ejecutados normalmente por métodos dentro de un controlador

- **nombre-de-modulo.module.ts**

    Archivo donde se registran las dependencias de cada módulo y se inicializan otros módulos externos a él mismo

## Módulos

### ad-positions
Gestiona las ubicaciones de los anuncios en la página.

Los endpoints de este módulo son:

**GET /ad-positions**
    
Devuelve las ubicaciones de anuncios páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:

- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/ad-positions'
```

---

### admins
Gestiona los usuarios de tipo "admin"

Los endpoints de este módulo son:

**GET /admins**

Devuelve los administradores páginados

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de usuario
- **email**: filtra por email de usuario
- **name**: filtra por nombre de usuario
- **userStatusCode**: filtra por estatus de usuario

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/admins'
```

**POST /admins**

Crea usuarios de tipo administrador

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/admins' \
--form 'name="asdf"' \
--form 'email="elemail@admin.com"' \
--form 'password="password"' \
--form 'phoneNumber="+584261249733"' \
--form 'address="Los Guayos II"' \
--form 'image=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/barberia-popular.jpg"'
```

**GET /admins/:id**

Devuelve información sobre un usuario adminstrador

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/admins/7'
```

**PUT /admins/:id**

Actualiza un usuario de tipo administrador

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/admins/7' \
--data-raw '{
    "name": "el nombre",
    "email": "eladmin@gmail.com",
    "password": "password",
    "phoneNumber": "+584261249733",
    "address": "Los Guayos II manzana f5 casa 6",
    "userStatusCode": "usc-002"
}'
```

**PUT /admins/:id/password**

Actualiza la contraseña de un usuario de tipo administrador

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/admins/7/password' \
--data-raw '{
    "password": "password"
}'
```

**DELETE /admins/:id**

Elimina un usuario de tipo administrador

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/admins/7'
```

**DELETE /admins/multiple**

Elimina varios usuario de tipo administrador

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/admins/multiple' \
--data-raw '{
    "ids": [8, 9]
}'
```

---

### ads

Gestiona los anuncios publicitarios que se muestran en la página

Los endpoints de este módulo son:

**GET /ads**

Devuelve los anuncios publicitarios páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de anuncio

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/ads'
```

**POST /ads**

Crea anuncios publicitarios

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/ads' \
--form 'image=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/barberia-popular.jpg"' \
--form 'title="el titulo"' \
--form 'description="la descripción"' \
--form 'url="https://url.com"' \
--form 'priority="1"' \
--form 'from="2022-06-13"' \
--form 'until="2022-06-23"' \
--form 'price="13.50"' \
--form 'sellerId="1"' \
--form 'adPositionId="1"'
```

**GET /ads/:id**

Devuelve información sobre un anuncio publicitario

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/ads/1'
```

**PUT /ads/:id**

Actualiza un anuncios publicitario

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/ads/1' \
--form 'image=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/barberia-popular.jpg"' \
--form 'title="el titulo"' \
--form 'description="la descripción"' \
--form 'url="https://url.com"' \
--form 'priority="1"' \
--form 'from="2022-06-13"' \
--form 'until="2022-06-23"' \
--form 'price="13.50"' \
--form 'sellerId="1"' \
--form 'adPositionId="1"'
```

**DELETE /ads/:id**

Elimina un anuncio publicitario

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/ads/2'
```

**DELETE /ads/multiple**

Elimina varios anuncios publicitarios

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/ads/multiple' \
--data-raw '{
    "ids": [1]
}'
```

---

### auth

Gestiona lo relacionado con autenticación

Los endpoints de este modulo son:

**POST /auth/login**

Usado para iniciar sesión a un cliente, retorna un JWT

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/auth/login' \
--data-raw '{
    "email": "alexisnavarro1994@gmail.com",
    "password": "password"
}'
```

**POST /auth/register**

Registra un nuevo usuario de tipo cliente

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/auth/register' \
--data-raw '{
    "name": "El nombre",
    "email": "nombre@gmail.com",
    "phoneNumber": "+584261249733",
    "password": "password",
    "instagram": "@instagram",
    "paypal": "email@gmail.com"
}'
```

**PUT /auth/password**

Actualiza la contraseña del usuario autenticado

Requiere autenticación: Si

Rol de usuario requerido: Cualquier rol

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/auth/password' \
--data-raw '{
    "password": "password",
    "currentPassword": "passworda"
}'
```

**POST /auth/login-seller**

Usado para iniciar sesión a un vendedor, retorna un JWT

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/auth/login-seller' \
--data-raw '{
    "email": "italianrestaurant@gmail.com",
    "password": "password"
}'
```

**POST /auth/register-store**

Registra un nuevo usuario de tipo vendedor

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/auth/register-store' \
--form 'name="Luisaaa"' \
--form 'email="luiasaito@gmail.coma"' \
--form 'credentialNumber="3254654894"' \
--form 'credential=@"/E:/Ale/Imágenes/Authentic-Spanish-Paella.jpg"' \
--form 'phoneNumber="+584261249733"' \
--form 'whatsapp="+584261249733"' \
--form 'password="password"' \
--form 'paypal="luis@gmail.com"' \
--form 'occupationIds[0]="1"'
```

**POST /auth/login-admin**

Usado para iniciar sesión a un administrador, retorna un JWT

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/auth/login-admin' \
--data-raw '{
    "email": "admin@admin.com",
    "password": "password"
}'
```

**POST /auth/forgot-password**

Envia un correo electronico a la dirección proporcionada para recuperar la contraseña

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/auth/forgot-password' \
--data-raw '{
    "role": "CLIENT",
    "email": "alexthebigboss1@gmail.com"
}'
```

**POST /auth/reset-password**

Resetea la contraseña del usuario después de hacer varias verificaciones

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/auth/reset-password' \
--data-raw '{
    "password": "password",
    "email": "alexthebigboss1@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJhbGV4dGhlYmlnYm9zczFAZ21haWwuY29tIiwiaWF0IjoxNjY1MTUxMjMwLCJleHAiOjE2NjUxNTQ4MzB9.DyZuFSSVFdTWkj92K3g5alKvGiXEkUrWt7jPxsMRzyo"
}'
```

---

### categories

Gestiona las categorías de las recetas

Los endpoints de este modulo son: 

**GET /categories**

Devuelve las categorias páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de categoría
- **name**: filtra por nombre de categoría
- **parentId**: filtra por id de categoría padre
- **onlyParents**: filtra a los que sean categorías padre

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/categories'
```

**POST /categories**

Crea categorias

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/categories' \
--form 'name="el nombre"' \
--form 'banner=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/adidas.jpg"' \
--form 'logo=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/akiabara.jpg"' \
--form 'parentId="1"'
```

**GET /categories/:id**

Devuelve información sobre una categoría

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/categories/1'
```

**PUT /categories/:id**

Actualiza una categoría

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/categories/1' \
--form 'name="el nombre"' \
--form 'banner=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/barberia-popular.jpg"' \
--form 'logo=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/47street.jpg"'
```

**DELETE /categories/:id**

Elimina una categoría

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/categories/1'
```

**DELETE /categories/multiple**

Elimina varias categorias

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/categories/multiple' \
--data-raw '{
    "ids": [1]
}'
```

---

### chats

Gestiona las conversaciones entre clientes y vendedores

Los endpoints de este módulo son:

**/GET /chats**

Devuelve las conversaciones páginadas

Requiere autenticación: Si

Rol de usuario requerido: CLIENT, SELLER

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de chat

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/chats'
```

**/GET /chats/:id**

Devuelve la información sobre un chat

Requiere autenticación: Si

Rol de usuario requerido: CLIENT, SELLER

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/chats/1'
```

**/POST /chats**

Envia un mensaje de un cliente a un vendedor usando el id de vendedor

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/chats' \
--form 'content="first message"' \
--form 'sellerId="1"' \
--form 'attachments=@"/E:/Ale/Documentos/Currículum.pdf"' \
--form 'attachments=@"/E:/Ale/Imágenes/pexels-lisa-fotios-1083822.jpg"'
```

**/POST /chats/:id/messages**

Envia un mensaje a un chat

Requiere autenticación: Si

Rol de usuario requerido: CLIENT, SELLER

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/chats/1/messages' \
--form 'content="the content"' \
--form 'attachments=@"/E:/Ale/Imágenes/pexels-lisa-fotios-1083822.jpg"' \
--form 'attachments=@"/E:/Ale/Imágenes/311643152_10224624009842497_3287567281981413546_n.jpg"'
```

**/GET /chats/:id/messages**

Devuelve los mensajes de un chat

Requiere autenticación: Si

Rol de usuario requerido: CLIENT, SELLER

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/chats/1/messages'
```

---

### clients
Gestiona los usuarios de tipo "cliente"

Los endpoints de este módulo son:

**GET /clients**

Devuelve los clientes páginados

Requiere autenticación: Si

Rol de usuario requerido: ADMIN, SELLER

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de usuario
- **email**: filtra por email de usuario
- **name**: filtra por nombre del cliente
- **phoneNumber**: filtra por telefono del cliente
- **userStatusCode**: filtra por estatus de usuario

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/clients'
```

**POST /clients**

Crea usuarios de tipo cliente

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/clients' \
--form 'email="elcliente@cliente.com"' \
--form 'password="password"' \
--form 'name="el name"' \
--form 'userStatusCode="usc-001"' \
--form 'phoneNumber="+584261249733"' \
--form 'image=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/barberia-popular.jpg"'
```

**GET /clients/:id**

Devuelve información sobre un usuario cliente

Requiere autenticación: Si

Rol de usuario requerido: ADMIN, CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/clients/6'
```

**PUT /clients/:id**

Actualiza un usuario de tipo administrador

Requiere autenticación: Si

Rol de usuario requerido: ADMIN, CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/clients/6' \
--form 'email="elcliente@cliente.com"' \
--form 'password="password"' \
--form 'name="el name"' \
--form 'userStatusCode="usc-002"' \
--form 'phoneNumber="+584261249733"' \
--form 'image=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/bowen.jpg"'
```

**PUT /clients/:id/password**

Actualiza la contraseña de un usuario de tipo cliente

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/clients/6/password' \
--data-raw '{
    "password": "password"
}'
```

**DELETE /clients/:id**

Elimina un usuario de tipo cliente

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/cliente/7'
```

**DELETE /clients/multiple**

Elimina varios usuario de tipo cliente

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/clients/multiple' \
--data-raw '{
    "ids": [8, 9]
}'
```

---

### combo-purposes
Gestiona los propósitos de un combo, por ejemplo si es para bajar de peso, ahorrar tiempo, etc.

Los endpoints de este módulo son:

**GET /combo-purposes**

Devuelve los propósitos de combo páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/combo-purposes'
```

**POST /combo-purposes**

Crea un propósito de combo

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/combo-purposes' \
--data-raw '{
    "name": "El nombre"
}'
```

**GET /combo-purposes/:id**

Devuelve información sobre un propósito de combo

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/combo-purposes/1'
```

**PUT /combo-purposes/:id**

Actualiza propósito de combo

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/combo-purposes/2' \
--data-raw '{
    "name": "updated name"
}'
```

**DELETE /combo-purposes/:id**

Elimina un propósito de combo

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/combo-purposes/2'
```

**DELETE /combo-purposes/multiple**

Elimina varios propósitos de combo

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/categories/multiple' \
--data-raw '{
    "ids": [3]
}'
```

---

### combos

Gestiona los combos de planes y recetas

Los endpoints de este módulo son:

**GET /combos**

Devuelve los combos páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de combo
- **sellerId**: filtra por id de vendedor
- **name**: filtra por nombre del combo
- **hideFavoritedForClientId**: este filtro oculta los combos que el usuario tiene en favoritos
- **rating**: filtra por rating de combo
- **orderByMostPurchased**: este filtro hace que se ordenen del más comprado al menos comprado

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/combos'
```

**POST /combos**

Crea un combo

Requiere autenticación: Si

Rol de usuario requerido: SELLER

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/combos' \
--form 'name="El gran combo"' \
--form 'description="El gran combo de puerto rico"' \
--form 'price="100"' \
--form 'images=@"/E:/Ale/Imágenes/Authentic-Spanish-Paella.jpg"' \
--form 'comboPurposeId="1"' \
--form 'categoryIds[0]="1"' \
--form 'categoryIds[1]="2"' \
--form 'recipeIds[0]="1"' \
--form 'recipeIds[1]="2"' \
--form 'planIds[0]="2"'
```

**GET /combos/:id**

Devuelve información sobre un combo por id de combo

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/combos/1'
```

**GET /combos/:slug**

Devuelve información sobre un combo por slug de combo

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/combos/el-gran-combo-1654267516801'
```

**PUT /combos/:id**

Actualiza un combo

Requiere autenticación: Si

Rol de usuario requerido: SELLER

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/combos/3' \
--data-raw '{
    "name": "update name",
    "description": "updated description",
    "price": 100.50,
    "comboPurposeId": 1,
    "categoryIds": [1, 2],
    "recipeIds": [1],
    "planIds": [2, 3]
}'
```

**DELETE /combos/:id**

Elimina un combo

Requiere autenticación: Si

Rol de usuario requerido: SELLER

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/combos/3'
```

**DELETE /combos/multiple**

Elimina varios combos

Requiere autenticación: Si

Rol de usuario requerido: SELLER

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/combos/multiple' \
--data-raw '{
    "ids": [2]
}'
```

**POST /combos/:id/images**

Agrega una imagen a un combo

Requiere autenticación: Si

Rol de usuario requerido: SELLER, CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/combos/1/images' \
--form 'image=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/bilberry.jpg"'
```

**DELETE /combos/:id/images/:imageId**

Elmina una imagen a un combo

Requiere autenticación: Si

Rol de usuario requerido: SELLER, CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/combos/1/images/1'
```

---

### comments

Gestiona los comentarios de las recetas, planes y combos

Los endpoints de este módulo son:

**GET /comments**

Devuelve los comentarios páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de comentario
- **name**: filtra por nombre de cliente
- **sellerId**: filtra por id de vendedor
- **clientId**: filtra por id de cliente
- **comment**: filtra por contenido del comentario
- **recipeId**: filtra por id de receta
- **planId**: filtra por id de plan
- **comboId**: filtra por id de combo

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/comments'
```

**POST /comments**

Crea un comentario

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/comments' \
--data-raw '{
    "comment": "El comentario",
    "recipeId": 1
}'
```

**POST /comments/:id/answer**

Responde un comentario

Requiere autenticación: Si

Rol de usuario requerido: SELLER

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/comments/30/answer' \
--data-raw '{
    "answer": "the answer"
}'
```

**GET /comments/:id**

Devuelve información sobre un comentario

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/comments/1'
```

---

### database

Inicializa typeorm con la configuración de base de datos proveniente de ormconfig.ts

También contiene la carpeta **migrations** con las migraciones de Typeorm y carpeta **utils** con funciones utilitarias relacionadas con bases de datos

### email-contacts

Gestiona el soporte a través de correo electrónico

Los endpoints de este módulo son:

**POST /email-contacts**

Envia un correo electronico a la dirección de correo electronico configurado

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/email-contacts' \
--data-raw '{
    "email": "pedro@gmail.com",
    "content": "this is the content"
}'
```

---

### events

Gestiona los eventos de calendario (el overview)

Los endpoints de este módulo son:

**GET /events**

Devuelve los eventos del overview páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de combo
- **start**: filtra los eventos cuya fecha de inicio es mayor o igual al "start"
- **end**: filtra los eventos cuya fecha final es menor o igual al "end"
- **clientId**: filtra por id de cliente

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/events'
```

**POST /events**

Crea un evento del overview

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/events' \
--data-raw '{
    "planId": 1,
    "start": "2023-01-22"
}'
```

**GET /events/:id**

Devuelve información sobre un evento del overview

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/events/1'
```

**DELETE /events/:id**

Elimina un evento del overview

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/events/2'
```

**GET /events/recipes**

Devuelve las recetas del overview para un día específico

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/events/recipes?date=2022-08-23'
```

---

### favorites

Gestiona las recetas, planes y combos favoritos.

Los endpoints de este módulo son:

**GET /favorites**

Devuelve los combos páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de combo
- **types**: filtra por tipo de favorito (recipe, plan, combo)
- **reactions**: filtra por tipo de reacción (LIKE, DISLIKE, LOVE_IT)
- **clientId**: filtra por id de cliente

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/favorites'
```

**POST /favorites**

Agrega una receta, plan o combo a favoritos

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/favorites' \
--data-raw '{
    "type": "plan",
    "planId": 1,
    "reaction": "LOVE_IT"
}'
```

**DELETE /favorites**

Elimina una receta, plan o combo de favoritos

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/favorites/3' \
--data-raw '{
    "type": "recipe",
    "recipeId": 2
}'
```

---

### ingredient-types

Gestiona los tipos de ingredientes

Los endpoints de este módulo son:

**GET /ingredient-types**

Devuelve los tipos de ingredientes páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de comentario
- **name**: filtra por nombre de tipo de ingrediente

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/ingredient-types'
```

--- 

### ingredients

Gestiona los ingredientes de recetas

Los endpoints de este módulo son:

**GET /ingredients**

Devuelve los ingredientes páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de combo
- **name**: filtra por nombre del combo
- **ingredientTypeId**: filtra por tipo de ingrediente

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/ingredients'
```

**POST /ingredients**

Crea un ingrediente de receta

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/ingredients' \
--form 'name="Something"' \
--form 'ingredientTypeId="1"' \
--form 'icon=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/ancaco.jpg"'
```

**GET /ingredients/:id**

Devuelve información sobre un ingrediente de receta

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/ingredients/2'
```

**PUT /ingredients/:id**

Actualiza un ingrediente de receta

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/ingredients/11' \
--form 'name="Something"' \
--form 'ingredientTypeId="1"' \
--form 'icon=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/ancaco.jpg"'
```

**DELETE /ingredients/:id**

Elimina un ingrediente de receta

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/ingredients/10'
```

**DELETE /ingredients/multiple**

Elimina varios ingredientes

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/ingredients/multiple' \
--data-raw '{
    "ids": [3, 4]
}'
```

---

### mail

Gestiona el envio de correos

Este módulo no tiene endpoints porque no tiene controlador, pero en el servicio esta la lógica de envío de correos electronicos

---

### meal-periods

Gestiona los periodos para comer, por ejemplo: Desayuno, almuerzo, cena, etc

Los endpoints de este módulo son:

**GET /meal-periods**

Devuelve los periodos para comer páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/meal-periods'
```

---

### measurement-units

Gestiona las unidades de medida

Los endpoints de este módulo son:

**GET /measurement-units**

Devuelve las unidades de medida páginadas

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/measurement-units'
```

---

### notification-types

Gestiona los tipos de notificaciones que recibe el usuario

Los endpoints de este módulo son:

**GET /notification-types**

Devuelve los tipos de notificaciones páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **code**: filtra por código de tipo de notificación
- **name**: filtra por nombre de tipo de notificación
- **role**: filtra los tipos de notificaciones que aplican para un determinado rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/notification-types?role=SELLER'
```

**POST /notification-types/sync**

Guarda los tipos de notificaciones que quiere recibir cada usuario

Requiere autenticación: Si

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/notification-types/configure' \
--data-raw '{
    "notificationTypeCodes": [
        "COMMENT_CREATED",
        "PRODUCT_RATED"
    ]
}'
```

---

### notifications

Gestiona las notificaciones de la app. En este módulo también se inicializa el servidor de websockets y el servicio de notificaciones push de one signal

Los endpoints de este módulo son:

**GET /notifications**

Devuelve las notificaciones páginadas

Requiere autenticación: Si

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de notificación
- **unreadOnly**: filtra las notificaciones que no han sido leidas

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/notifications'
```

**PUT /notifications/:id/mark-as-read**

Marca como leida la notificación con el id proporcionado

Requiere autenticación: Si

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/notifications/1/mark-as-read'
```

**PUT /notifications/mark-all-as-read**

Marca como leida todos las notificaciones del usuario autenticado

Requiere autenticación: Si

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/notifications/mark-all-as-read'
```

**GET /notifications/count**

Devuelve el número de notificaciones no leidas del usuario

Requiere autenticación: Si

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/notifications/count'
```

**WEBSOCKETS**

El servidor de websockets permite notificar por rol de usuario y por id de usuario

**Notificacion por id de usuarios**: recibe los ids de usuarios y la notificación

Firma: notifyByUserIds(ids: number[], notification: NotificationDto)

**Notificacion por roles de usuario**: recibe los roles de usuarios y la notificación

Firma:  notifyByUserRole(roles: Role[], notification: NotificationDto)

**ONE SIGNAL**

El servicio de one signal permite notificar por ids de usuario

**Notificacion por id de usuarios**: recibe los ids de usuarios y la notificación

Firma: notifyUsersById(userIds: number[], { message, ...notification }: NotificationDto)

---

### occupations

Gestion las ocupaciones/profesiones de los clientes

Los endpoints de este módulo son:

**GET /occupations**

Devuelve las notificaciones páginadas

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/occupations'
```

---

### orders

Gestion los pedidos de recetas, planes, combos

Los endpoints de este módulo son:

**GET /orders**

Devuelve los pedidos páginadas

Requiere autenticación: Si

Rol de usuario requerido: CLIENT, SELLER, ADMIN

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de orden
- **clientId**: filtra por id de cliente
- **sellerId**: filtra por id de vendedor

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/orders'
```

**POST /orders**

Crea una pedido de recetas, planes o combos

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/orders' \
--data-raw '{
    "sellerId": 1,
    "productId": 1,
    "type": "recipe"
}'
```
**GET /orders/:id**

Devuelve información sobre un pedido

Requiere autenticación: Si

Rol de usuario requerido: CLIENT, SELLER, ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/orders/73'
```

**GET /orders/capture-order**

Hace el traspaso del monto del pedido desde la cuenta paypal del comprador a la cuenta de la plataforma

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/orders/capture-order?token=48937310MD900630C&PayerID=TVTNPJ3BNW3HL'
```

**POST /orders/:id/pay**

Usado para autorizar el pago por parte del cliente a través de paypal cuando se tiene un orden pendiente

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/orders/48/pay'
```

**GET /orders/:id/pdf**

Genera un resumen de la orden en formato PDF

Requiere autenticación: Si

Rol de usuario requerido: CLIENT, SELLER, ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/orders/73/pdf'
```

---

### payment-gateways

Inicializa los servicios necesarios para pagar hacer pagos electronicos

El servicio principal tiene dos métodos que son:

getPaymentUrl: recibe una orden y devuelve una url para hacer el pago

captureOrder: recibe un token de pago y hace el traspaso de cuenta a cuenta

---

### payment-methods

Gestiona los métodos de pagos

Los endpoints de este módulo son:

**GET /payment-methods**

Devuelve los métodos de pago paginadas

Requiere autenticación: Si

Rol de usuario requerido: CLIENT, SELLER, ADMIN

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de metodo de pago
- **name**: filtra por nombre de metodo de pago

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/payment-methods'
```

---

### payments

Gestiona los pagos que hacen los clientes en los pedidos de compra

Este módulo no contiene ningún endpoint, los pagos son creados en el módulo de pedidos.

El módulo solo contiene los dto y entidades de typeorm relacionadas con pagos

---

### plans

Gestiona los planes de recetas

Los endpoints de este módulo son:

**GET /plans**

Devuelve los planes páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de combo
- **sellerId**: filtra por id de vendedor
- **clientId**: filtra por id de cliente
- **name**: filtra por nombre del plan
- **hideFavoritedForClientId**: este filtro oculta los planes que el usuario tiene en favoritos
- **hideClientPlans**: este filtro oculta los planes que crean los clientes
- **rating**: filtra por rating de plan
- **orderByMostPurchased**: este filtro hace que se ordenen del más comprado al menos comprado

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/plans'
```

**POST /plans**

Crea un plan

Requiere autenticación: Si

Rol de usuario requerido: SELLER, CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/plans' \
--form 'name="El plan"' \
--form 'description="Esta es la descripciòn"' \
--form 'price="100"' \
--form 'numberOfDays="10"' \
--form 'images=@"/E:/Ale/Imágenes/pexels-lisa-fotios-1083822.jpg"' \
--form 'planDays[0][day]="1"' \
--form 'planDays[0][mealPeriodId]="1"' \
--form 'planDays[0][recipeId]="1"' \
--form 'planDays[1][day]="1"' \
--form 'planDays[1][mealPeriodId]="1"' \
--form 'planDays[1][recipeId]="1"' \
--form 'planDays[2][day]="1"' \
--form 'planDays[2][mealPeriodId]="2"' \
--form 'planDays[2][recipeId]="1"' \
--form 'planDays[3][day]="14"' \
--form 'planDays[3][mealPeriodId]="1"' \
--form 'planDays[3][recipeId]="1"'
```

**GET /plans/:id**

Devuelve información sobre un plan por id de plan

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/plans/3'
```

**GET /plans/:slug**

Devuelve información sobre un plan por slug de plan

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/plans/el-plan-1654128140352'
```

**PUT /plans/:id**

Actualiza un plan

Requiere autenticación: Si

Rol de usuario requerido: SELLER, CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/plans/2' \
--data-raw '{
    "name": "updated name",
    "description": "updated description",
    "price": 1000.20,
    "numberOfDays": 14,
    "planDays": [{
        "day": 1,
        "mealPeriodId": 1,
        "recipeId": 1
    }, {
        "day": 1,
        "mealPeriodId": 1,
        "recipeId": 2
    }, {
        "day": 1,
        "mealPeriodId": 2,
        "recipeId": 3
    }, {
        "day": 14,
        "mealPeriodId": 1,
        "recipeId": 1
    }]
}'
```

**DELETE /plans/:id**

Elimina un plan

Requiere autenticación: Si

Rol de usuario requerido: SELLER, CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/plans/2'
```

**POST /plans/:id/images**

Agrega una imagen a un plan

Requiere autenticación: Si

Rol de usuario requerido: SELLER, CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/plans/2/images' \
--form 'image=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/akiabara.jpg"'
```

**DELETE /plans/:id/images/:imageId**

Elmina una imagen a un plan

Requiere autenticación: Si

Rol de usuario requerido: SELLER, CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/plans/2/images/2'
```

---

### purchased-products

Gestiona los productos adquiridos.

Cada vez que se completa una orden se guarda un producto adquirido.

Los endpoints de este módulo son:

- **GET /purchased-products**

Devuelve los productos adquiridos páginados

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **productId**: filtra por id de producto
- **name**: filtra por nombre de producto
- **type**: fiptra por tipo de producto (recipe, plan, combo)

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/purchased-products'
```

---

### ratings

Gestiona las valoraciones de recetas, planes y combos

Los endpoints de este módulo son:

**GET /ratings**

Devuelve las valoraciones páginadas

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **itemId**: filtra por id de item (receta, plan o combo)
- **itemType**: filtra por tipo de item (recipe, plan, combo)
- **sellerId**: filtra por id de vendedor

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/ratings'
```

**POST /ratings**

Agrega una valoración a una receta, plan o combo

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/ratings' \
--data-raw '{
    "type": "recipe",
    "productId": 4,
    "value": 4,
    "comment": "asdfas"
}'
```

---

### recipe-difficulties

Gestiona los niveles de dificultad de las recetas

Los endpoints de este módulo son:

**GET /recipe-difficulties**

Devuelve las dificultades de receta páginadas

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/recipe-difficulties'
```

---

### recipes

Gestiona las recetas

Los endpoints de este módulo son:

**GET /recipes**

Devuelve las recetas paginadas

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de combo
- **sellerId**: filtra por id de vendedor
- **name**: filtra por nombre del plan
- **hideFavoritedForClientId**: este filtro oculta los planes que el usuario tiene en favoritos
- **rating**: filtra por rating de plan
- **orderByMostPurchased**: este filtro hace que se ordenen del más comprado al menos comprado

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/recipes'
```

**GET /recipes/by-hierarchy**

Devuelve las recetas paginadas y ordenadas por jerarquía (primero las adquiridas y luego las favoritas)

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **name**: filtra por nombre de receta

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/recipes/by-hierarchy'
```

**POST /recipes**

Crea una receta

Requiere autenticación: Si

Rol de usuario requerido: SELLER, ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/recipes' \
--form 'name="El nombre de la receta"' \
--form 'preparationTime="30"' \
--form 'description="Esta es la descripción"' \
--form 'shortDescription="La descripción corta"' \
--form 'isPremium="false"' \
--form 'numberOfDinners="1"' \
--form 'recipeDifficultyId="1"' \
--form 'categoryIds[0]="1"' \
--form 'mealPeriodIds[0]="1"' \
--form 'images=@"/E:/Ale/Imágenes/311643152_10224624009842497_3287567281981413546_n.jpg"' \
--form 'recipeVideos[0][name]="Daddy Yankee - 09. Tu Principe ft Zion y Lennox - Barrio Fino (Bonus Track Version) (Audio Oficial)"' \
--form 'recipeVideos[0][url]="https://www.youtube.com/watch?v=h-r627KOxj4"' \
--form 'recipeVideos[0][isRecipeCover]="false"' \
--form 'recipeIngredients[0][ingredientId]="1"' \
--form 'recipeIngredients[0][measurementUnitId]="1"' \
--form 'recipeIngredients[0][value]="1/2"' \
--form 'recipeIngredients[0][onlyPremium]="true"' \
--form 'recipeSteps[0][content]="El step"' \
--form 'chefId="1"'
```

**GET /recipes/:id**

Devuelve información sobre una receta por id de receta

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/recipes/4'
```

**GET /recipes/:slug**

Devuelve información sobre una receta por slug de receta

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/recipes/el-nombre-de-la-receta-1653944455405'
```

**PUT /recipes/:id**

Actualiza una receta

Requiere autenticación: Si

Rol de usuario requerido: SELLER, CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/recipes/2' \
--data-raw '{
    "name": "El nombre de la receta",
    "preparationTime": 30,
    "description": "Esta es la descripción",
    "shortDescription": "La descripción corta",
    "isPremium": true,
    "price": 15.60,
    "numberOfDinners": 2,
    "recipeDifficultyId": 1,
    "categoryIds": [1],
    "mealPeriodIds": [1],
    "recipeVideos": [
        {
            "name": "Daddy Yankee - 09. Tu Principe ft Zion y Lennox - Barrio Fino (Bonus Track Version) (Audio Oficial)",
            "url": "https://www.youtube.com/watch?v=h-r627KOxj4",
            "isRecipeCover": false
        }
    ],
    "recipeIngredients": [
        {
            "ingredientId": 1,
            "measurementUnitId": 1,
            "value": "1/2"
        }
    ],
    "recipeSteps": [
        {
            "content": "El step actualizado"
        }
    ]
}'
```

**DELETE /recipes/:id**

Elimina una receta

Requiere autenticación: Si

Rol de usuario requerido: SELLER, ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/recipes/1'
```

**DELETE /recipes/multiple**

Elimina varias recetas

Requiere autenticación: Si

Rol de usuario requerido: SELLER

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/recipes/multiple' \
--data-raw '{
    "ids": [1]
}'
```

**POST /recipes/:id/images**

Agrega una imagen a una receta

Requiere autenticación: Si

Rol de usuario requerido: SELLER, ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/recipes/2/images' \
--form 'image=@"/E:/Ale/Imágenes/pexels-lisa-fotios-1083822.jpg"'
```

**DELETE /recipes/:id/images/:imageId**

Elmina una imagen a una receta

Requiere autenticación: Si

Rol de usuario requerido: SELLER, CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/recipes/2/images/1'
```

---

### seller-ratings

Gestiona las valoraciones de los vendedores

Los endpoints de este módulo son:

**GET /seller-ratings**

Devuelve las valoraciones de vendedores páginadas

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **sellerId**: filtra por id de vendedor

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/seller-ratings'
```

**POST /seller-ratings**

Agrega una valoración a un vendedor

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/seller-ratings' \
--data-raw '{
    "sellerId": 1,
    "value": 1,
    "comment": "asdfas",
    "orderId": 76
}'
```

---

### sellers

Gestiona a los vendedores

Los endpoints de este módulo son:

**GET /sellers**

Devuelve los vendedores páginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de usuario
- **email**: filtra por email de usuario
- **name**: filtra por nombre del vendedor
- **phoneNumber**: filtra por telefono del vendedor
- **userStatusCode**: filtra por estatus de usuario
- **minRating**: filtra por un minimo de rating

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/sellers'
```

**GET /sellers/:id**

Devuelve información sobre un usuario vendedor buscando por id

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/sellers/1'
```

**GET /sellers/:slug**

Devuelve información sobre un usuario vendedor buscando por slug

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/sellers/alexis-navarro'
```

**PUT /sellers/:id**

Actualiza un usuario de tipo vendedor

Requiere autenticación: Si

Rol de usuario requerido: ADMIN, SELLER

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/sellers/1' \
--form 'email="elcorreo@gmail.com"' \
--form 'name="El nombre"' \
--form 'userStatusCode="usc-001"' \
--form 'whatsapp="+584261249733"' \
--form 'instagram="alex"' \
--form 'paypal="elpaypal@gmail.com"' \
--form 'phoneNumber="+584261249733"' \
--form 'facebook="alex"' \
--form 'shortDescription="descripción corta"' \
--form 'description="descripción larga"' \
--form 'banner=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/barberia-popular.jpg"' \
--form 'logo=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/ambar.jpg"' \
--form 'frontImage=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/bilberry.jpg"' \
--form 'occupationIds[0]="1"' \
--form 'credential=@"/C:/xampp/htdocs/patio-olmos-excel-reader/storage/app/store-logos/barberia-popular.jpg"' \
--form 'credentialNumber="254654654"'
```

**PUT /sellers/:id/password**

Actualiza la contraseña de un usuario de tipo vendedor

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request PUT 'http://localhost:3000/clients/6/password' \
--data-raw '{
    "password": "password"
}'
```

**DELETE /sellers/:id**

Elimina un usuario de tipo vendedor

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/sellers/7'
```

**DELETE /sellers/multiple**

Elimina varios usuario de tipo vendedor

Requiere autenticación: Si

Rol de usuario requerido: ADMIN

Ejemplo de petición con curl:

```bash
curl --location --request DELETE 'http://localhost:3000/sellers/multiple' \
--data-raw '{
    "ids": [8, 9]
}'
```

---

### shopping-list

Gestiona las listas de compras de los clientes

Los endpoints de este módulo:

**GET /shopping-list**

Devuelve las listas de compras paginadas

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

Parametros de query string:
- **page**: indica la página de resultados que se quiere obtener
- **perPage**: indica cuantos resultados se requiren por página
- **id**: filtra por id de usuario
- **name**: filtra por nombre del 
- **clientId**: filtra por id de cliente

Ejemplo de petición con curl:

```bash
curl --location --request GET 'http://localhost:3000/shopping-list'
```

**POST /shopping-list**

Genera una lista de compras basado en el overview de cliente

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/shopping-list' \
--data-raw '{
    "type": "monthly"
}'
```

**POST /shopping-list/image**

Genera una imagen de la  lista de compras basado en el overview de cliente en base64 o en formato PNG

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/shopping-list/image' \
--data-raw '{
    "ingredients": [
        {
            "name": "The name"
        },
        {
            "name": "The name f3"
        },
        {
            "name": "The name 12",
            "checked": true
        },
        {
            "name": "The name 34"
        }
    ],
    "asBase64": true
}'
```

**POST /shopping-list/store-image**

Almacena una imagen de la  lista de compras basado en el overview de cliente

Requiere autenticación: Si

Rol de usuario requerido: CLIENT

Ejemplo de petición con curl:

```bash
curl --location --request POST 'http://localhost:3000/shopping-list/store-image' \
--data-raw '{
    "ingredients": [
        {
            "name": "The name"
        },
        {
            "name": "The name f3"
        },
        {
            "name": "The name 12",
            "checked": true
        },
        {
            "name": "The name 34"
        }
    ]
}'
```

---

### summaries

Genera resumenes generares, usado para reportes

Los endpoints de este módulo son:

- **GET /summaries/dashboard**

Genera un objeto con la cantidad de clientes, recetas, planes, combos y ratings

El resultado varia dependiendo del rol de usuario

Requiere autenticación: Si

Rol de usuario requerido: SELLER, ADMIN, CLIENT

```bash
curl --location --request GET 'http://localhost:3000/summaries/dashboard'
```
---

### support

En este modulo se encuentran la mayoria de utilidades generares como interceptores, decoradores, utilidades de paginación, entre otros.

No tiene ningún endpoint, solo es un carpeta contenedora

### user-statuses

Gestiona los estatus de usuario

Los endpoints de este módulo son:

- **GET /user-statuses**

Devuelve los estatus de usuario paginados

Requiere autenticación: No

Rol de usuario requerido: No requiere rol

```bash
curl --location --request GET 'http://localhost:3000/user-statuses'
```

---

### users

Gestiona los usuarios del sistema

Este módulo no contiene ningún endpoint, los usuarios son creados en los módulo de clientes, vendedores y administradores.

El módulo solo contiene los dto y entidades de typeorm relacionadas con usuarios

---

### validation

En este modulo se encuentran las reglas de validación personalizadas

No tiene ningún endpoint, solo es un carpeta contenedora