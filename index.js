import express from 'express';
import pool from './database.js';

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`)
})

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use(express.static("public"));

//Agregar canciones
app.post("/api/v1/canciones", async (req, res) => {
    try {
        let { titulo, artista, tono } = req.body;

        if(!titulo || !artista || !tono){
            return res.status(404).json({
                message: "Debe ingresar todos los datos solicitados."
            })
        }

        let consulta = {
            text: "INSERT INTO canciones (titulo, artista, tono) VALUES ($1, $2, $3) RETURNING id, titulo, artista, tono",
            values: [titulo, artista, tono]
        }

        let results = await pool.query(consulta);
        console.log(results.rows);

        res.status(200).json({
            message: `Canción: agregada con exito al repertorio.`,
            cancion: results.rows[0]
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Ha ocurrido un error al agregar la canción al repertorio."
        })
    }
})

//obtener lista de canciones
app.get("/api/v1/canciones", async (req, res) => {
    try {
        let consulta = {
            text: "SELECT id, titulo, artista, tono FROM canciones",
            values: []
        }

        let results =  await pool.query(consulta);

        if(results.rowCount > 0){
            res.status(200).json({
                canciones: results.rows,
                cantidad: results.rowCount,
                message: "Repertorio obtenido con exito."
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al obtener la lista de canciones del repertorio."
        })
    }
})

//eliminar cancion por id
app.delete("/api/v1/canciones", async (req, res) => {
    try {
        let id = req.query.id;

        let consulta = {
            text: "DELETE FROM canciones WHERE id = $1 RETURNING id, titulo, artista, tono",
            values: [id]
        }

        let results = await pool.query(consulta);
        if(results.rowCount > 0){
            res.status(200).json({
                cancion: results.rows[0],
                message: "Canción eliminada correctamente del repertorio."
            })
        }else {
            res.status(400).json({
                message: "Error al eliminar la canción del repertorio."
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al obtener los datos de la canción."
        })
    }
})

//editar cancion
app.put("/api/v1/canciones/:id", async (req, res) => {
    try {
        let { titulo, artista, tono } = req.body;
        let id = req.params.id;

        let consulta = {
            text: "UPDATE canciones SET titulo = $1, artista = $2, tono = $3 WHERE id = $4 RETURNING id, titulo, artista, tono",
            values: [titulo, artista, tono, id]
        }

        let results = await pool.query(consulta);

        console.log(req.body);
        console.log(id);

        if(results.rowCount < 1){
            return res.status(400).json({
                message: "Canción no encontrada."
            })
        }

        res.status(201).json({
            cancion: results.rows[0],
            message: "Canción actualizada con exito."
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al actualizar los datos de la canción."
        })
    }
})