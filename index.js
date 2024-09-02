const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = 5000;
const app = express();

app.use(express.json());

// ruta del archivo json para utilizar en el codigo
const repertorioPath = path.join(__dirname, "./data/repertorio.json");

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send("algo esta mal");
});

//RUTAS
//ruta html principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

//ruta obtengo todas las canciones del json
app.get("/canciones", (req, res) => {
  try {
    const repertorio = JSON.parse(
      fs.readFileSync(repertorioPath, "utf-8")
    );
    res.status(200).json(repertorio);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el repertorio" });
  }
});

//POST -CREAR

//ruta creo una nueva cancion, agrego al repertorio
app.post("/canciones", (req, res) => {
  try {
    repertorio = req.body; 
    const repertorio = JSON.parse(fs.readFileSync(repertorioPath, "utf-8"));

    const nuevaCancion = {
      id: repertorio.length + 1,
      titulo: req.body.titulo,
      artista: req.body.artista,
      tono: req.body.tono,
    };

    repertorio.push(nuevaCancion);
    fs.writeFileSync(repertorioPath, JSON.stringify(repertorio, null, 2));

    res.status(201).send("Cancion agregada al repertorio con exito");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el repertorio auuuch " + error }); 
  }
});



// PUT
// ruta acutalizo cancion en el repertorio por su id
app.put("/canciones/:id", (req, res) => {
  const id = req.params.id;
  try {
    const repertorio = JSON.parse(fs.readFileSync(repertorioPath, "utf-8"));

    const index = repertorio.findIndex(
      (cancion) => cancion.id === parseInt(id)
    );
    if (index === -1) {
      return res.status(404).json({ error: "Cancion no encontrada" });
    }
    repertorio[index] = {
      id: parseInt(id),
      titulo: req.body.titulo,
      artista: req.body.artista,
      tono: req.body.tono,
    };
    fs.writeFileSync(repertorioPath, JSON.stringify(repertorio, null, 2));
    res.status(200).send("Cancion actualizada con exito");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la cancion " + error }); 
  }
});

// DELETE
app.delete("/canciones/:id", (req, res) => {
  const id = req.params.id;
  try {
    const repertorio = JSON.parse(fs.readFileSync(repertorioPath, "utf-8"));
    const id = parseInt(req.params.id);
    const index = repertorio.findIndex((cancion) => cancion &&  cancion.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Cancion no encontrada" });
    }
    repertorio.splice(index, 1);

    fs.writeFileSync(repertorioPath, JSON.stringify(repertorio, null, 2));

    res.status(200).send("Cancion eliminada con exito");
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la cancion " + error }); // Error 500))
  }
});

// ruta 404 
app.all("*", (req, res) => {
  res.status(404).send("Pagina no encontrada");
});


// inicio
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});