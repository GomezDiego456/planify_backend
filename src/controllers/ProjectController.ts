import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    // console.log(req.user);

    //asigna un manager
    project.manager = req.user.id;
    try {
      //para almacenar en la base de datos
      await project.save();
      res.send("profesor creado correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      console.log(error);
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error("profesor no encontrado");
        return res.status(404).json({ error: error.message });
      }
      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findByIdAndUpdate(id, req.body);

      if (!project) {
        const error = new Error("profesor no encontrado");
        return res.status(404).json({ error: error.message });
      }

      await project.save();
      res.json("profesor actualizado correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error("profesor no encontrado");
        return res.status(404).json({ error: error.message });
      }

      await project.deleteOne();
      res.json("profesor eliminado correctamente");
    } catch (error) {
      console.log(error);
    }
  };
}

export default ProjectController;
