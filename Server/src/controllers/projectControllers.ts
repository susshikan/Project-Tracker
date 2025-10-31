import { UserRequest } from "../types/userType";
import { PrismaClient } from '../../generated/prisma'
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface ProjectParam{
    id?: number
}

interface CreateProjectBody {
    localId: number;
    title: string;
    deadline: Date;
    status: boolean;
}

interface UpdateProjectBody {
    title?: string;
    status?: boolean;
    deadline?: Date;
}

export async function getProject(req: Request, res: Response){
    const reqProject = req as UserRequest
    if (!reqProject.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    let allProject
    try {
        allProject = await prisma.project.findMany({
            where: {
                userId: reqProject.user.id
            },
            orderBy: {
                createAt: 'desc'
            }
        })
    } catch (error) {
        
    }
    res.json({
        data: allProject
    })
}

export async function getProjectById(req: Request<ProjectParam, {}, {}>, res: Response){
    const reqProject = req as UserRequest
    if (!reqProject.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    let project
    const paramId = Number(req.params?.id)
    try {
        project = await prisma.project.findFirst({
            where: {
                localId: paramId,
                userId: reqProject.user.id
            }
        })
    } catch (error) {
        
    }
    if (!project) throw new Error('Project dengan id tersebut tidak ditemukan')
    res.json({
        data: project
    })
}

export async function createProject(req: Request<{}, {}, CreateProjectBody>, res: Response){
    const reqProject = req as UserRequest
    if (!reqProject.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const localId = Number(req.body?.localId)
    const title = (req.body?.title ?? "").trim()
    const deadline = new Date(req.body.deadline);
    const status: boolean = Boolean(req.body.status)

    if (Number.isNaN(localId)) {
        return res.status(400).json({ message: "localId harus berupa angka" })
    }

    if (!title) {
        return res.status(400).json({ message: "title wajib diisi" })
    }

    try {
        const updateUser = await prisma.user.update({
            where: {
                id: reqProject.user.id
            },
            data: {
                totalProject:  {
                    increment: 1
                }
            }
        })
        const newProject = await prisma.project.create({
            data: {
                localId: updateUser.totalProject,
                title,
                userId: reqProject.user.id,
                totalCommit: 0,
                deadline: deadline,
                status: status
            }
        })

        return res.status(201).json({ data: newProject })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Gagal membuat project"
        return res.status(400).json({ message })
    }
}

export async function updateProject(req: Request<ProjectParam, {}, UpdateProjectBody>, res: Response){
    const reqProject = req as UserRequest
    if (!reqProject.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const paramId = Number(req.params?.id)
    if (Number.isNaN(paramId)) {
        return res.status(400).json({ message: "Id project tidak valid" })
    }

    const updateData: { title?: string, deadline?: Date, status?: boolean } = {}

    if (req.body?.title !== undefined) {
        const newTitle = req.body.title.trim()
        if (!newTitle) {
            return res.status(400).json({ message: "title wajib diisi" })
        }
        updateData.title = newTitle
    }

    if (req.body?.status !== undefined) {
        const newStatus = Boolean(req.body.status)
        updateData.status = newStatus
    }

    if (req.body?.deadline !== undefined) {
        const newStatus = new Date(req.body.deadline)
        updateData.deadline = newStatus
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "Tidak ada data yang diperbarui" })
    }

    try {
        const existing = await prisma.project.findFirst({
            where: {
                localId: paramId,
                userId: reqProject.user.id
            }
        })

        if (!existing) {
            return res.status(404).json({ message: "Project dengan id tersebut tidak ditemukan" })
        }

        const updated = await prisma.project.update({
            where: { id: existing.id },
            data: updateData
        })

        return res.json({ data: updated })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Gagal memperbarui project"
        return res.status(400).json({ message })
    }
}

export async function deleteProject(req: Request<ProjectParam>, res: Response){
    const reqProject = req as UserRequest
    if (!reqProject.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const paramId = Number(req.params?.id)
    if (Number.isNaN(paramId)) {
        return res.status(400).json({ message: "Id project tidak valid" })
    }

    try {
        const existing = await prisma.project.findFirst({
            where: {
                localId: paramId,
                userId: reqProject.user.id
            }
        })

        if (!existing) {
            return res.status(404).json({ message: "Project dengan id tersebut tidak ditemukan" })
        }

        await prisma.project.delete({
            where: { id: existing.id }
        })

        return res.status(204).send()
    } catch (error) {
        const message = error instanceof Error ? error.message : "Gagal menghapus project"
        return res.status(400).json({ message })
    }
}
