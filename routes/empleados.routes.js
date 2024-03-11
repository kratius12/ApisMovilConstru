import {Router, json} from 'express';
import { PrismaClient } from '@prisma/client';
import { ucfirst } from "../plugins.js";
const prisma = new PrismaClient();
const router = Router();


router.put("/empleadoMo/:id", async (req, res) => {
    try {
        const { nombre, apellidos, direccion, telefono, tipoDoc, cedula, email,   } = req.body
        const result = await prisma.empleado.update({
            where: {
                idEmp: parseInt(req.params.id)
            },
            data: {
                nombre: ucfirst(nombre),
                apellidos: ucfirst(apellidos),
                direccion: ucfirst(direccion),
                telefono: telefono,
                tipoDoc: tipoDoc,
                cedula: cedula,
                email: email,
            }
        })
        setTimeout(() => {
            return res.status(200).json({ message: "Delayed response after 10 seconds" });
        }, 100);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message })
    }
})

router.get("/empleado/:id", async (req, res) => {
    try {
        const result = await prisma.empleado.findFirst({
            where: {
                idEmp: parseInt(req.params.id)
            },
            include: {
                empleado_especialidad: {
                    select: {
                        id: true,
                        especialidad: true
                    }
                },

            }
        })
        const rol = await prisma.rolpermisoempleado.findFirst({
            where:{
                idEmp:parseInt(req.params.id)
            },select:{
                idRol:true,
                rol:{
                    select:{
                        nombre:true
                    }
                }
            }
        })
        const enviar = {
            ...result,
           rol: {idRol: rol.idRol, nombre: rol.rol.nombre}
        } 
        res.status(200).json(enviar);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
})
export default router