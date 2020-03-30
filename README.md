# pdep-bot

La idea de este bot, es que asigne el rol **alumno** y cambie el nickname al mismo nombre y apellido que tienen ingresado en el campus virtual.

Los alumnos deberan ingresar en el channel "lobby" el comando `!<mail>`, el mail ingresado debe ser el mismo que esta en la lista de participantes del curso.

La base de datos esta en un cluster en mongodb, el modelo de la base es:
``` javascript  
  {_id: "ObjectId" ,mail: "String",nombreApellido: "String" ,verificado: "Boolean"} 
```
