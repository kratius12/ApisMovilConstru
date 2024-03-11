import {Router, json} from 'express';
import { PrismaClient } from '@prisma/client';
import { ucfirst } from "../plugins.js";
const prisma = new PrismaClient();
const router = Router();

router.get("/checkEmail/:email/:id", async (req, res) => {
    try {
        if (parseInt(req.params.id) > 0) {
            const result = await prisma.cliente.findFirst({
                where: {
                    email: {
                        equals: req.params.email
                    },
                    idCli: {
                        not: parseInt(req.params.id)
                    }
                },
                select: {
                    email: true
                }
            })
            if (result) {
                return res.status(203).json({ message: 'El Correo ingresado ya existe' })
            }
            return res.status(200).json({ message: result })
        } else {
            const result = await prisma.cliente.findFirst({
                where: {
                    email: req.params.email
                },
                select: {
                    email: true
                }
            })
            if (result) {
                return res.status(203).json({ message: 'El Correo ingresado ya existe' })
            }
            return res.status(200).json({ message: result })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.get('/cliente/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        const result = await prisma.cliente.findFirst({
            where: {
                idCli: parseInt(req.params.id)
            }, select: {
                constrasena: false,
                nombre: true,
                apellidos: true,
                tipoDoc: true,
                cedula: true,
                direccion: true,
                email: true,
                estado: true,
                fecha_nac: true,
                telefono: true
            }
        })
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

export default router