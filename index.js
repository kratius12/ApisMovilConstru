import express from "express";
import cors from "cors";
import {dirname, join} from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { PORT } from "./config.js";
import obrasRoutes from "./routes/obras.routes.js"
import clientesRoutes from "./routes/clientes.routes.js";
import empleadosRoutes from "./routes/empleados.routes.js";
import loginRoutes from './routes/login.routes.js'
import proveedoresRoutes from './routes/proveedores.routes.js'
import categoriasRoutes from './routes/categorias.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import materialesRoutes from './routes/materiales.routes.js'
import especialidadesRoutes from './routes/especialidades.routes.js'
import rolesRoutes from './routes/roles.routes.js'
import comprasRoutes from './routes/compras.routes.js'

const app = express()
const _dirname = dirname(fileURLToPath(import.meta.url))
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(obrasRoutes)
app.use(clientesRoutes)
app.use(empleadosRoutes)
app.use(loginRoutes)
app.use(proveedoresRoutes)
app.use(categoriasRoutes)
app.use(dashboardRoutes)
app.use(materialesRoutes)
app.use(especialidadesRoutes)
app.use(rolesRoutes)
app.use(comprasRoutes)

app.use(express.static(join(_dirname,"../client/dist")))
app.listen(PORT)
console.log("server listeing in port: "+PORT)



app.set('view engine', 'hbs');

app.use('*/Bootstrap-4-Multi-Select-BsMultiSelect',express.static('public/Bootstrap-4-Multi-Select-BsMultiSelect'));
app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));
app.use('*/images',express.static('public/images'));

app.get('/testhtml', (req, res) => {
    res.render('home');
});