import { UserRequest } from "../types/userType";
import { PrismaClient } from '../../generated/prisma'
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface commitParams {
    projectLocalId?: number
}

interface commitBody{
    projectLocalId: number
    message: string
}

interface commitUpdateBody{
    message?: string
}

export async function getCommit(req: Request, res: Response){
    const reqCommit = req as UserRequest
    if (!reqCommit.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    let allCommit;
    try {
        allCommit = await prisma.commit.findMany({
            where: {
                userId: reqCommit.user.id
            }
        })
    } catch (error) {
        
    }
    res.json({
        data: allCommit
    })
}


export async function getCommitPerProject(req: Request<commitParams, {}, {}>, res: Response){
    const reqCommit = req as UserRequest
    if (!reqCommit.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    let allCommit;
    const projectId = Number(req.params?.projectLocalId)
    if (Number.isNaN(projectId)) {
        return res.status(400).json({ message: "projectId harus berupa angka" })
    }
    try {  
        allCommit = await prisma.commit.findMany({
            where: {
                userId: reqCommit.user.id,
                projectLocalId: projectId
            }
        })
    } catch (error) {
        
    }
    res.json({
        data: allCommit
    })
}


export async function createCommit(req: Request<{}, {}, commitBody>, res: Response){
    const reqCommit = req as UserRequest
    if (!reqCommit.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    let allCommit;
    const projectId = Number(req.body?.projectLocalId)
    const message = (req.body?.message ?? "").trim()

    if (Number.isNaN(projectId)) {
        return res.status(400).json({ message: "localId harus berupa angka" })
    }
    if (!message) {
        return res.status(400).json({ message: "title wajib diisi" })
    }
    try {  
        const newCommit = await prisma.commit.create({
            data: {
                userId: reqCommit.user.id,
                projectLocalId: projectId,
                message: message
            }
        })
    } catch (error) {
        
    }
    res.json({
        data: allCommit
    })
}


export async function updateCommit(){

}


export async function deleteCommit(){

}
