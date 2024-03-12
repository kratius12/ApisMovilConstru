import { Router, json } from "express";
import { PrismaClient } from "@prisma/client";
import { ucfirst } from "../plugins.js";

const prisma = new PrismaClient()
const router = Router()

router.put("/estadoAct/:id", async (req, res) => {
    try {
        const { estado } = req.body

        const actividad = await prisma.detalle_obra.update({
            where: {
                id: parseInt(req.params.id)
            }, data: {
                estado: estado
            }
        }
        )

        setTimeout(() => {
            return res.status(200).json({ message: "Delayed response after 10 seconds" });
        }, 100);
    } catch (error) {
        console.log(error)
    }
})

router.get("/obrasEmp/:id", async (req, res) => {
    try {
      const obras = await prisma.obras.findMany({
        where: {
          idEmp: parseInt(req.params.id),
        },
        include: {
          detalle_obra: true,
          actividades_empleados: true,
          empleado: true,
          cliente: true
        },
      });
  
      const obrasAct = await prisma.actividades_empleados.findMany({
        where: {
          idEmp: parseInt(req.params.id),
        },
        include: {
          obras: true,
        },
      });
  
      
  
      // Utilizamos un Set para almacenar las obras únicas
      const obrasUnicas = new Set();
  
      obras.forEach((obra) => {
        obrasUnicas.add(JSON.stringify(obra));
      });
  
      // obrasAct.forEach((actividad) => {
      //   actividad.obras.forEach((obra) => {
      //     obrasUnicas.add(JSON.stringify(obra));
      //   });
      // });
  
      // Convertimos nuevamente las obras a objetos antes de enviar la respuesta
      const obrasUnicasArray = Array.from(obrasUnicas).map((obraString) =>
        JSON.parse(obraString)
      );
  
      const info = {
        obras: obrasUnicasArray,
      };
  
      return res.status(200).json(info);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  router.get("/obrasCli/:id", async (req, res) => {
    try {
      const obras = await prisma.obras.findMany({
        where: {
          idCliente: parseInt(req.params.id),
        },
        include: {
          empleado: true,
        },
      });
  
      const obrasAct = await prisma.actividades_empleados.findMany({
        where: {
          idEmp: parseInt(req.params.id),
        },
        include: {
          obras: true,
        },
      });
  
      // Utilizamos un Set para almacenar las obras únicas
      const obrasUnicas = new Set();
  
      obras.forEach((obra) => {
        obrasUnicas.add(JSON.stringify(obra));
      });
      const obrasUnicasArray = Array.from(obrasUnicas).map((obraString) =>
        JSON.parse(obraString)
      );
  
      const info = {
        obras: obrasUnicasArray,
      };
  
      return res.status(200).json(info);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  })

  router.post("/obras", async (req, res) => {
    try {
      const { descripcion, fechaini, idCliente, idEmp } = req.body;
      const obra = await prisma.obras.create({
        data: {
          descripcion: ucfirst(descripcion),
          fechaini: fechaini,
          estado: "Pendiente",
          idCliente: parseInt(idCliente),
          idEmp: parseInt(idEmp)
        },
      });
      res.status(200).json(obra);
    } catch (error) {
      console.log("message:" + error.message);
      return res.status(500).json({ message: error.message });
    }
  });

router.post("/AddActividadMov",async(req,res)=>{
  try {
    const {actividad, fechaini, fechafin, estado, idEmp, idObra} = req.body
    const activida = await prisma.detalle_obra.create({
      data:{
        actividad: actividad,
        fechaini: fechaini,
        fechafin: fechafin,
        estado: estado,
        idObra: parseInt(idObra)
      }
      
    }
    
    )
    const emps = await prisma.actividades_empleados.create({
      data:{
        actividad: activida.actividad,
        idEmp: parseInt(idEmp),
        idObra: parseInt(idObra)
      }
    })
  } catch (error) {
    console.error(error)
  }
})

export default router