import {Router, json} from 'express';
import { PrismaClient } from '@prisma/client';
import { ucfirst } from "../plugins.js";
import bcrypt from "bcrypt"
const prisma = new PrismaClient();
const router = Router();

const generarHash = async (password, saltRounds = 10) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
};

router.put('/clienteMo/:id', async (req, res) => {

    try {
            const {nombre,apellidos, email, direccion, telefono, tipoDoc, cedula, fecha_nac, } = req.body
            const result = await prisma.cliente.update({
                    where:{
                            idCli: parseInt(req.params.id)
                    },data:{
                            nombre: ucfirst(nombre),
                            apellidos:ucfirst(apellidos),
                            email: email,
                            direccion: ucfirst(direccion),
                            telefono: telefono,
                            tipoDoc: tipoDoc,
                            cedula: cedula,
                            fecha_nac: fecha_nac,
                    }
            })
            
            res.status(200)
    } catch (error) {
            console.log(error);
            return res.status(500).json(error)
    }

});

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

router.post('/cliente', async (req, res) => {

    const { nombre, apellidos, email, direccion, telefono, tipoDoc, cedula, fecha_nac, estado, contrasena } = req.body
    let date = new Date(fecha_nac)
    const { hash, salt } = await generarHash(contrasena);
    const result = await prisma.cliente.create({
        data: {
            nombre: ucfirst(nombre),
            apellidos: ucfirst(apellidos),
            email: email,
            direccion: ucfirst(direccion),
            telefono: telefono,
            tipoDoc: tipoDoc,
            cedula: cedula,
            fecha_nac: fecha_nac,
            estado: parseInt(estado),
            constrasena: hash,
        }
    })

    res.status(200).json(result);

});

export default router