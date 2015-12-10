---
layout: post
title:  "MongoDB y NodeJS ya están aquí"
date:   2015-07-22 12:30:33
categories: general
tags: mongodb, nodejs, cursos
link_icon: "http://abirtone.com/static/post/2015-07-22-mongodb-nodejs/mongo_and_nodejs.png"
type: post
description: "Ya están aquí los cursos subvencionados de MongoDB y NodeJS"
---

Aunque poco a poco, seguimos publicando nuevos cursos. Esta vez nos alegra anunciaros que **ya** están **aquí** los cursos  **<a class="link" href="/formacion/#mongodb">MongoDB</a> y <a class="link" href="/formacion/desarrollo-web-nodejs/">NodeJS</a>**.

En los últimos años tanto **NodeJS como MongoDB** han ganado una gran **popularidad** entre no solo la comunidad de **desarralladores**, sino también muchas **empresas** han optado por empezar a desarrollar ellos. 

¿Por qué la popularidad de NodeJS y MongoDB, os preguntaréis? Nos os preocupeis, os lo contamos:

## MongoDB

**MongoDB** es el motor de bases de datos **NoSQL por excelencia**, y se ha ganado su popularidad pulso. 

Los sistemas NoSQL tienen la ventaja de que **no** están **sujetos a un esquema** tan estricto como los sistemas SQL tradicionales (MySQL, PostgreSQL, Oracle...). Imaginaros que en algún momento necesitamos un **tipo de dato nuevo** en nuestra base de datos, no tendremos que cambiar su esquema. Sencillamente **lo añadimos y ya está**, así de fácil.

**Enfoque tradicional**

En un enfoque SQL tradicional, si tenemos una tabla como la que sigue en nuestra base de datos:

| Nombre columna | Tipo |
| ------------- | ------------- |
| NombreUsuario | VARCHAR(100)  |
| Telefono  | VARCHAR(20)  | 


**Insertar** un registro es sencillo:

{% highlight sql %}
INSERT INTO Users (NombreUsuario, Telefono) VALUES("Juan", "918271038") 
{% endhighlight %}

Ahora el problema... **¡¡ Nuevo requisito de cliente !!**. Tambien hay que guardar el **teléfono móvil**... Hay que **cambiar la tabla** y ya tenemos **en producción** guardados casi **1.000.000 de usuarios**. El cambio no es trivial.

**Enfoque NoSQL con MongoDB**

El mismo problema con MongoDB, antes del nuevo requisito de cliente, **insertar/modificar** usuario sería así de **sencillo**:

{% highlight javascript %} 
use Auth
db.users.insert({nombre_usuario: 'Juan', telefono: '918271038'})

// Mostramos todos los registros
db.users.find()
 
{ "_id" : ObjectId("4fbaf11c7b25b0skwu0403c26"), nombre_usuario: 'Juan', telefono: '918271038' }
{% endhighlight %}

Y, he aquí la magia, tras el **nuevo requisito** de cliente:

{% highlight javascript %} 
use Auth
db.users.insert({nombre_usuario: 'Pedro', telefono: '9182710000', telefono_movil: '666193872'}) // <- nuevo registro: 'telefono_movil'

// Mostramos todos los registros, incluyendo el del otro ejemplo
db.users.find()
 
{ "_id" : ObjectId("4fbaf11c7b25b00aabc403c26"), nombre_usuario: 'Juan', telefono: '918271038', telefono_movil: '666193872' }
{ "_id" : ObjectId("1928f01c7b25b009ae0403c26"), nombre_usuario: 'Pedro', telefono: '9182710000' }
{% endhighlight %}

Como véis, prácticamente *+no** hay **cambios**. La potencia que nos da es impresionante.

## NodeJS

Basado el motor de JavaScript desarrollado por Google, el <a class="link" href="https://code.google.com/p/v8/">V8</a>, y el paradigma de proramación orientada a eventos cosigue un *alto rendimiento** con muy **pocos recursos**. 

Cuesta creer, hasta que no lo ves, que con el **mismo hardware** y mismas condiciones, una web hecha con NodeJS puede **incrementar** su **rendimiento hasta** un **300%** y manejar has 25 veces más usuarios concurrente. Es, sencillamente, impresionante.

NodeJS usa la **sintaxis** de programación de **JavaScript** por lo que si tienes experiencia en programación con JavaScript el cambio será casi inmediato.

Por si no fuera poco, **programar** en NodeJs **es increiblemente rápido**. Mirad lo sencillo que es crear un **servidor web** en NodeJS. ¡Son literamente **5 lineas**! (ejemplo de su <a class="link" href="https://nodejs.org/">web oficial</a>):

{% highlight javascript %}
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
{% endhighlight %}

Y si pensábais que programar era sencillo.... **ejecutarlo** es trivial:

{% highlight sh %}
% node example.js
{% endhighlight %}

## NodeJS + MongoDB

Tras estos los 2 pequeños ejemplos, ¿os imaginais la potencia de **combinar MongoDB y NodeJS**? Podreís tener una **web completa** funcionando en un **par de horas**... Si sois de los que para necesitáis ver para creer, deberíais de echarle un ojo a este link: 

<a class="link" href="http://www.raywenderlich.com/61078/write-simple-node-jsmongodb-web-service-ios-app">Escribir un servicio web para iOS con NodeJS y MongoDB &rarr;</a>

## Aprender MongoDB y NodeJS

Te has quedado con ganas de más ¿verdad? No te preocupes, en Abirtone iremos publicando más post sobre el tema.

Si quieres **aprender MongoDB y NodeJS**, te recomendamos que mires **nuestros cursos de MongoDB y NodeJS**. Se te hará la boca agua :)

<a class="btn btn-danger" href="/formacion/#mongodb">Ir a cursos de MongoDB</a>
<a class="btn btn-danger" href="/formacion/desarrollo-web-nodejs/">Ir a curso de NodeJS</a>

**Recuerda que para estar al tanto de novedades puedes seguirnos en Twitter, Facebook y Linkedin!** (al final de la web están los enlaces.