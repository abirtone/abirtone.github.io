---
layout: post
title:  "Docker en la ejecución de test de integración en NodeJS"
date:   2015-07-28 08:30:33
categories: docker
tags: nodejs supertest docker-compose docker chain mocha
type: post
link_icon: "http://abirtone.com/static/post/2015-07-28-uso-de-docker-en-aplicacion-de-nodejs/docker.png"
description: "Despliegue de aplicaciones nodejs con contenedores y Docker"
---

## Motivación

El **objetivo** de este tutorial es permitir al **desarrollador de NodeJS** tener unas nociones básicas de como realizar el **despliegue de su aplicación a través de contenedores (`docker`)** y llevando la orquestación de estos con `docker-compose`. Del mismo modo, este tutorial nos enseñará como tomar ventaja del uso de contenedores a la hora de ejecutar nuestros tests de integración, mejorando de este modo la calidad de nuestros desarrollos.

## Requisitos

Aunque no es imprescindible, se aconseja tener **conocimientos básicos de NodeJS** para el seguimiento de este tutorial.

## Propósito

Aunque el tutorial este basado en una aplicación desarrollada con NodeJS que se conecta a una base de datos MongoDB, la finalidad de este tutorial no es **enseñar** como desarrollar aplicaciones `javascript` sino mostrar al desarrollador como puede tomar **ventaja del uso de docker y docker-compose en el desarrollo de sus aplicaciones**

## Detalle del tutorial

En el tutorial **desarrollaremos** una `API rest` desde  con haciendo uso de `NodeJS` y de la librería `mongoose`. Usaremos `express` como servidor de aplicaciones.

## Estructura del proyecto

El **código fuente** de este proyecto, como el del resto de tutoriales desarrollados en Abirtone, **<a target="_blank" class="link" href=""> puede ser descargado desde nuestro repositorio público de Github &rarr;</a>**. A continuación explicamos la estructura de directorio que encontrarás en este proyecto:


*  abirtone-blog-agenda-api
    - etc: Contioene los ficheros de configuración de `docker-compose`
    - config: Ficheros de  configuración de las rutas y de neustro servior express.
    - app:  
        - models: Modelos de datos (Definidos con mongoose)
        - routes: Implementación de lógica de negocio usada por nuestra aplicación.
    - test: Tests de integración implementados con `supertest` y `should`.
    - application.js: Fichero de arranque de nuestra aplicación.
    - pacakge.json  
    - nodemon.json
    - Dockerfile: Fichero utilizado para construir una imagen de Docker de nuestra aplicación.


## Implementando una API Rest con NodeJS y Mongoose

Partimos de la base de que contamos con **NodeJS instalado** en nuestro sistema. Para cualquier duda os sugerimos visitar la página oficial de nodejs en [NodeJS Official Site](http://nodejs.org)


**Definiendo nuestro modelo de datos**

Para **almancenar** los datos usaremos `MongoDB` como base de datos y la librería `mongoose` para la definición de nuestras colecciones así como para la lectura/escritura en nuestro sistema. A continuación se muestra **nuestro modelo de datos** que esta definido en los siguientes ficheros:

*app/models/contact.js*

{% highlight javascript %}
    var ContactSchema = new Schema({
      firstName: String,
      lastName: String,
      favourite: Boolean,
      bornDate: Date,
      phone: String,
      email: String,
      creationdDate: {type:Date, default:Date.now}
    });
{% endhighlight %}

*app/models/agenda.js*

{% highlight javascript %}
    var AgendaSchema = new Schema({
      title: String,
      description: String,
      creationdDate: {type:Date, default:Date.now},
      contacts: [Contact.schema]
    });
{% endhighlight %}


Como se puede ver en el ejemplo anterior, la definición de nuestras colecciones se realizada de modo muy sencillo, aunque para desarrollos más complejos os animamos a que realicéis nuestro **<a href="http://abirtone.com/formacion/nodejs/" class="link" target="_blank">cruso de especialista en nodejs</a>**.

**Mongoose nos permite definir la estructura de nuestras colecciones**, definiendo tipo de datos, indices, así como nodos de nuestros documentos. Para desarrollos haciendo uso de MongoDB, os recomendamos que os forméis **<a href="http://abirtone.com/formacion/#mongodb" class="link" target="_blank">crusos de especialista en MongoDB</a>**, dónde conseguiréis una formación que os permitirá liderar desarrollos con MongoDB.

**CONFIGURACIÓN DE EXPRESS**

Tal y como hemos comentado anteriormente, haremos uso de **express para desplegar nuestra aplicación**. Una buena práctica para organizar nuestro código es tener la configuración de `express` aislada del resto de código, por eso podemos ver la configuración de nuestro servidor a continuación.

*config/express.js*

{% highlight javascript %}
//Creamos la conexión con nuestra mongodb a trabés de mongoose.
var mongoHost = process.env.MONGO_ADDR || 'localhost';
var mongoPort = process.env['MONGO_PORT'] || '27017';
mongoose.connect('mongodb://'+mongoHost+':'+mongoPort+'/it-blogs');

//Implementamos CORS para nuestra API  
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

//Aquí definimos los middlewares de express
module.exports = function (app) {
  if(process.env.NODE_ENV == 'prod'){
    app.use(logger('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
  }else{
    app.use(logger('dev'));
  }
  app.use(compression({
      threshold: 512
  }));

  app.use(bodyParser.json());
  app.use(validator());
  app.use(cookieParser());

  //Hacemos uso de nuestro middleware creado anteriormente.
  app.use(allowCrossDomain);
  app.use(session({
      resave: true,
      saveUninitialized: true,
      secret: pkg.name
  }));

};
{% endhighlight %}

**DEFINICIÓN DE RUTAS**

Nuestra **API implementará** los servicios descritos a continuación.

*config/routes.js*

{% highlight javascript %}
//Crear una nueva agenda
app.post('/agendas',agendaRoute.createAgenda);

//Elimina una agenda de nuestro sistem, así como los contactos incluidos dentro de ella.
app.delete('/agendas/:agenda_id',agendaRoute.deleteAgenda);

//Devuelve la lista de agendas almacenadas en nuestro sistema.
app.get('/agendas',agendaRoute.getListOfAgendas);

//Da de alta un nuevo contacto en una agenda
app.post('/agendas/:agenda_id/contacts',contactRoute.createContact);

//Devuelve la lista de contactos almacenados en una agenda
app.get('/agendas/:agenda_id/contacts',contactRoute.getContactsInAgenda);

//Devuelve los detalles de un contacto
app.get('/agendas/:agenda_id/contacts/:contact_id',contactRoute.getContactDetail);
{% endhighlight %}

**IMPLEMENTACIÓN DE LA LÓGICA DE NEGOCIO**

La implementación de estos servicios puede ser encontrada en el directorio *app/routes*, allí encontramos **2 ficheros llamados agenda y contact** que tienen la implementación de la lógica de negocio que se encargará de la comunicación con nuestra base de datos.

*app/routes/agenda.js*

{% highlight javascript %}
//Crear una nueva agenda
exports.createAgenda = function(req,res,next){
  winston.info('Creating a new agenda');
  agendaValidation(req);
  checkRequestValidationErrors(req,res,next);
  agenda = new Agenda(req.body);
  agenda.save(function(err) {
    if (err) {
      res.send(err);
      next();
    }
    winston.info('Agendas has been created successfuly.');
    res.status(201);
    res.json({agenda: agenda});
  });
}

//Elimina una agenda de nuestro sistem, así como los contactos incluidos dentro de ella.
exports.deleteAgenda = function(req,res,next){
  winston.info('Deleting existing agenda and its contacts.');
  Agenda.remove({_id: req.param('agenda_id')}, function(err) {
    if (err) {
        res.status(500);
        res.json({errors:err});
        next();
    }
    winston.info('The agenda with id '+req.param('agenda_id')+' has been removed successfuly.');
    res.status(204);
    next();
  });
}

//Devuelve la lista de agendas almacenadas en nuestro sistema.
exports.getListOfAgendas= function(req,res,next){
  winston.info('Return the list of agendas.');
  Agenda.find({})
  .select('title description')
  .exec(function(err,agendas) {
    if(err){
      winston.info('Unexpected error while invoking mongo database.');
      res.status(500);
      res.json({errors:err});
      next();
    }
    res.status(200);
    res.json(agendas);
    next();
  });
}

function checkRequestValidationErrors(req,res,next){
  var errors = req.validationErrors();
  if (errors) {
      winston.info('Something failed while creating the agenda.');
      res.status(400);
      res.json({errors:errors});
      next();
  }
}


function agendaValidation(req){
    winston.info('Validaing the agenda request.');
    req.checkBody('title','required').notEmpty();
}
{% endhighlight %}

*app/routes/contact.js*

{% highlight javascript %}
//Da de alta un nuevo contacto en una agenda
exports.createContact= function(req,res,next){
  winston.info('Adding new contact into the agenda.');
  contactValidation(req);
  checkRequestValidationErrors(req,res,next);

  Agenda.findOne({_id:req.param('agenda_id')},function(err,agenda){
      if(err){
        res.status(404);
        res.send(err);
        next();
      }
      winston.info("Agenda was found then adding contact to agenda.");
      contact = new Contact(req.body);

      agenda.contacts.push(contact);
      agenda.save(function(err) {
        if (err) {
          res.send(err);
          next();
        }
        winston.info('Contact has been added to the agenda successfuly.');
        res.status(201);
        res.json({contact: contact});
        next();
      });
  });
}

//Devuelve la lista de contactos almacenados en una agenda
exports.getContactsInAgenda= function(req,res,next){
  winston.info('Return the list of contacts  for an agenda.');
  Agenda.findOne({_id:req.param('agenda_id')})
  .select('contacts')
  .exec(function(err,agenda) {
    if(err){
      winston.info('Unexpected error while invoking mongo database.');
      res.status(500);
      res.json({errors:err});
      next();
    }
    res.status(200);
    res.json(agenda.contacts);
    next();
  });
}

//Devuelve los detalles de un contacto
exports.getContactDetail= function(req,res,next){
  winston.info('Return the contact details');
  Agenda.findOne({'contacts._id': req.param('contact_id')}, {'contacts.$': 1},
    function (err, agenda) {
        if (err) {
          winston.info('Unexpected error while invoking mongo database.');
          res.status(500);
          res.json({errors:err});
          next();
        }
        res.status(200);
        res.json(agenda.contacts[0]);
        next();
    }
);
}

function checkRequestValidationErrors(req,res,next){
  var errors = req.validationErrors();
  if (errors) {
      winston.info('Something failed while creating the contact.');
      res.status(400);
      res.json({errors:errors});
      next();
  }
}

function contactValidation(req){
  winston.info('Validaing the contact request.');
  req.checkBody('firstName','required').notEmpty();
}
{% endhighlight %}


## Despliegue de aplicación con contenedores

Para el uso de **Docker** y **Docker-Compose** en sistemas operativos distintos a Linux utilizaremos **boot2docker**. Si aún no tenemos instalado en nuestro sistema Docker o boot2docker podéis echar un vistazo a los siguientes links:

- [Docker Official Site](https://www.docker.com/)
- [Boot2Docker Official Site](http://boot2docker.io/)


En el directorio `etc` encontraremos un fichero llamado `docker-compose.yml`, esté, será quien orqueste los contenedores requeridos para el despliegue del sistema. Si echamos un vistazo a este fichero veremos lo siguiente:

{% highlight yaml %}
mongo:
  image: mongo:latest
  restart: always
  command: mongod --smallfiles --quiet --logpath=/dev/null --rest --httpinterface
  ports:
    - "37017:27017"
    - "38017:28017"


application:
  build: ../
  volumes:
    - ../app:/src/app
    - ../config:/src/config
  ports:
    - "4000:3000"
  environment:
    - RUN_MODE=prod
    - LOGS_DIR=/var/logs/agenda
  links:
    - "mongo:mongo"
  volumes:
    - logs:/var/logs/agenda
{% endhighlight %}

Como podemos observar en el fichero anterior docker-compose.yml, contamos con dos contenedores:

  - **mongo**: Se trata de una instancia de mongo que será utilizada por nuestra aplicación.
  - **application**: Se trata de la "contenerización" de nuestra propia aplicación.

Para mongo usamos la imagen oficial, y lo indicamos así: `image: mongo:latest`, mientras que para la aplicación haremos que docker-compose cree una imagen y la almacene en nuestro repositorio local `build: ../`, este referencia al fichero `Dockerfile` que podemos encontrar en nuestro proyecto.

Para desplegar nuestra aplicación ejecutaremos los siguientes comandos desde nuestro directorio `etc`:

  - **docker-compose build**: Creará la imagen correspondiente a nuestra aplicación.
  - **docker-compose up -d**: Este comando lanzará los contenedores definidos en nuestro fichero `docker-compose.yml`
  - **docker-compose ps**: Muestra el estado de los contenedores definidos. Deberíamos ver 2 registros que se corresponden con el contenedor de nuestra aplicación y con la mongo definida.
  - **docker-compose logs**: Visualizaremos los logs escrito por los contenedores. De este modo podremos visualizar los logs escritas por nuestra aplicación a través de `winston`.

Para conocer Docker en profundidad y ser capaces de hacer desarrollos de calidad usandolo os recomendamos visitéis nuestro curso de **Especialista en desarrollos con Docker**.

A través del comando curl podríamos verificar que nuestra aplicación ha sido desplegada correctamente, por ejemplo veamos lo siguientes comandos:

  - **Listado de agendas**:
  {% highlight bash %}
  curl http://localhost:4000/agendas
  {% endhighlight %}
  - **Crear una nueva agenda**:
  {% highlight bash %}
   curl -XPOST http://localhost:4000/agendas -H 'Content-Type:application/json' -H 'Accept:application/json' -d '{"title":"family", "description":"Just family"}' -i
  {% endhighlight %}
  - **Añadir un contacto a una agenda**:
  {% highlight bash %}
    curl -XPOST http://localhost:4000/agendas/55abe42f9b4ccb140074ed85/contacts -H 'Content-Type:application/json' -d '{"firstName":"Ivan", "lastName":"Corrales","email":"developer@wesovi.com"}'
  {% endhighlight %}



## Ejecución de tests de integración con contenedores

Desde un punto de vista personal, el mayor logro de Docker es ofrecernos la posibilidad de hacer testing de gran calidad, ofrenciéndonos ejecutar nuestros tests contra un entorno real y no contra uno de pruebas.  En el direcorio `etc` de nuestro proyecto podemos observar que tenemos otro fichero llamado `docker-compose-test.yml`. Este fichero es idéntico al que utilizamos para desplegar nuestra aplicación y la única diferencia entre ambos es el valor de la variable de entorno `RUN_MODE` que utilizamos para identificar que script debemos ejecutar.

{% highlight yaml %}
mongo:
    image: mongo:latest
    restart: always
    command: mongod --smallfiles --quiet --logpath=/dev/null --rest --httpinterface
    ports:
      - "37017:27017"
      - "38017:28017"

application:
    build: ../
    ports:
      - "4000:3000"
    environment:
      - RUN_MODE=test
      - LOGS_DIR=/var/logs/agenda
    links:
      - "mongo:mongo"
    volumes:
      - logs:/var/logs/agenda
{% endhighlight %}

Los pasos a seguir para lanzar nuestros tests haciendo uso de `Docker` serían los siguientes (Suponiendo que nos encontramos en el directorio `etc`):

- **docker-compose -f docker-compose-test.yml build**: Creará la imagen correspondiente a nuestra aplicación.
- **docker-compose -f docker-compose-test.yml up -d**: Este comando lanzará los contenedores definidos en nuestro fichero `docker-compose.yml`

Por defecto `docker-compose` utiliza el fichero llamado `docker-compose-yml`, como vemos en el párrafo anterior le indicamos un fichero diferente a través del parámetro `-f`.

Al ejecutar nuestros tests se creará un fichero llamado `result.spec` en nuestro directorio `etc/log`.  En realidad, cuando ejecutamos nuestra batería de tests de integración lo que queremos saber es el resultado de nuestros tests y no preocuparnos de los problemas derivados por las herramientas. De este modo levantaremos nuestros contenedores y tendremos un `report` con los resultados de nuestros tests. Esto es muy útil para herramientas de C.I. (Integración Contina) tales como **Jenkins** o **Bamboo**.

## Conclusiones

- Docker nos da la posibilidad de hacer uso de la `infraestructura como código fuente`.
- Docker nos permite a los desarrolladores tener `un entorno idéntico/similar a producción e identico al de cualquiera de nuestros compañeros`. Nota: Decimos similar a producción, porque probablemente en producción definamos clusteres en nuestro `docker-compose`
- Garantiza la `calidad de nuestros Tests de Integración y de Aceptación` desde el momento que estamos haciendo uso de un sistema real, y no de mocks o servidores de prueba diferentes a producción.
- `Ahorro en máquinas` que están siempre en ejecución para que podamos ejecutar nuestros tests. De este modo nosotros mismos seremos capaces de levantar y detener nuestros contenedores
- Como resumen podríamos decir que los contenedores son actualmente la pieza fundamental en los procesos de `Integración continua` y `Despliegue continuo`.


## Deberes

Todos sabemos que los tutoriales son muy útiles, aunque realmente aprendemos cuando nos enfrentamos a desarrollos por nosotros mismos. Por eso desde este tutorial nos gustaría sugeriros las siguientes prácticas que os ayudarían a fortalecer los conocimientos adquiridos en este tutorial.

- Implementar los `tests` para el resto de servicios implementados.
- Hacer uso de `ngingx` que haga de `proxy` de nuestra aplicación.
- ¿Porque no probar un desarrollo dnde usamos un base de datos relacional y usemos `sequealize` en lugar de una mongo?


##  Codigo fuente

El código fuente de este proyecto puede ser encontrado en nuestro repositorio público de Github, en el siguiente enlace:  **[Abirtone Blog Agenda API](https://github.com/abirtone/blog-examples)**

##  Sobre el autor de este post

El **autor** de este post es **<a class="link" target="_blank" href="https://es.linkedin.com/pub/iván-corrales-solera/1b/88/b9">Iván Corrales</a>** especialista en sistemas de **Q&A y DevOps**, además de ser el **profesor** de en Abirtone de cursos como **<a class="link" href="">Cucumber &rarr;</a>**.