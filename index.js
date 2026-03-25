import express from "express";
import fs from "fs";

const app = express();
app.use(express.json()); // ← sin body-parser

// Leer la data del archivo
const readData = () => {
  try {
    const data = fs.readFileSync("./db.json"); 
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return { books: [] }; // Retorno de seguridad
  }
};

// Escribir en el archivo json
const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    }   catch (error) {
        console.log(error);
    }
};

// RUTAS // 

app.get("/", (req, res) => {
    //Callback o funcion que recibe dos parámetros, petición y respuesta
    res.send('Bienvenido a mi primer API con Nodejs'); // Objeto de la respuesta
});

// books
app.get("/books", (req, res) => {
  const data = readData();
  res.json(data.books); // Accedemos a la propiedad 'books' de tu db.json
});

// Define una ruta GET para obtener un libro por su ID
app.get("/books/:id", (req, res) => {
    // Lee los datos de los libros desde alguna fuente de datos
    const data= readData();

    // Convierte el parámetro de la URL (id) de string a número entero
    const id = parseInt(req.params.id);

    // Busca el libro de la colección de los libros usando el ID proporcional
    const book = data.books.find((book) => book.id === id);

    // Devuelve el libro encontrado en formato JSON
    res.json(book);
});


// Insertar un nuevo libro (POST)
app.post("/books", (req, res) => {
    //Lee los datos actuales de los libros desde una fuente de datos
    const data = readData();

    //Extrae el cuerpo de la solicitud (datos del nuevo libro)
    const body = req.body;

    //Crea un nuevo objeto de libro con un ID único
    const newBook = {
        id: data.books.length + 1, // Asigna un ID basado en la longitud del array
        ...body, // Copia todas las propiedades enviadas en el cuerpo de la solicitud
    };

    // Agrega el nuevo libro a la colección de libros 
    data.books.push(newBook);

    // Guarda los datos actualizados 
    writeData(data);

    // Responde con el lirbo recién creado en formato JSON
    res.json(newBook);
});

// Actualizar un libro (PUT)
app.put("/books/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const bookIndex = data.books.findIndex((book) => book.id === id);

  if (bookIndex !== -1) {
    data.books[bookIndex] = {
      ...data.books[bookIndex],
      ...body,
    };
    writeData(data);
    res.json({ message: "Libro actualizado correctamente" });
  } else {
    res.status(404).json({ message: "Libro no encontrado" });
  }
});

// Eliminar un libro (DELETE)
app.delete("/books/:id", (req, res) => {
    // Leer los datos actuales
    const data = readData();

    // Obtener el ID del libro a eliminar desde los parámetros de la URL y convertirlo a número
    const id = parseInt(req.params.id);

    // Buscar el índice del libro en el array de libros usando el ID
    const bookIndex = data.books.findIndex((book) => book.id === id);

    // Si el libro existe, lo eliminamos del array usando splice
    data.books.splice(bookIndex, 1);

    // Guardamos los datos actualizados después de la eliminación
    writeData(data);

    // Enviamos una respuesta JSON indicando que el libro fue eliminado
    res.json({ message: "Book delete successfully" });
});

// Inicar Servidor
app.listen(3000, () => {
    //Función call back que imprime el mensaje
    console.log("Servidor iniciado en el Puerto 3000");
});
