import { UserRequest } from "../types/userType";
import { PrismaClient, Prisma } from "../../generated/prisma";
import { Request, Response } from "express";
import redis from "../utils/redis";

const prisma = new PrismaClient();

interface CommitParams {
  projectId?: number;
}

interface CommitByIdParams {
  commitId: string;
  projectId: string;
}

interface CommitBody {
  message: string;
}

interface CommitUpdateBody {
  message?: string;
}

export async function getCommit(req: Request, res: Response) {
  const reqCommit = req as UserRequest;
  if (!reqCommit.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const key = `commit:${reqCommit.user.id}`
  try {
    const cached = await redis.get(key)
    if (cached) {
      return res.json({ data: JSON.parse(cached) })
    }
    const allCommit = await prisma.commit.findMany({
      where: {
        userId: reqCommit.user.id,
      },
      orderBy: {
        createAt: "desc",
      },
    });
    await redis.set(key, JSON.stringify(allCommit), 'EX', 120)
    return res.json({
      data: allCommit ?? [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil commit";
    return res.status(500).json({ message });
  }
}

export async function getCommitPerProject(req: Request<CommitParams, {}, {}>, res: Response) {
  const reqCommit = req as UserRequest;
  if (!reqCommit.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const projectId = Number(req.params?.projectId);
  if (Number.isNaN(projectId)) {
    return res.status(400).json({ message: "projectId harus berupa angka" });
  }
  const key = `commit:${reqCommit.user.id}:${projectId}`
  try {
    const cached = await redis.get(key)
    if (cached) {
      return res.json({ data: JSON.parse(cached) })
    }
    const allCommit = await prisma.commit.findMany({
      where: {
        userId: reqCommit.user.id,
        projectLocalId: projectId,
      },
      orderBy: {
        createAt: "desc",
      },
    });
    await redis.set(key, JSON.stringify(allCommit), 'EX', 120)
    return res.json({
      data: allCommit ?? [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil commit";
    return res.status(500).json({ message });
  }
}

export async function createCommit(req: Request<CommitParams, {}, CommitBody>, res: Response) {
  const reqCommit = req as UserRequest;
  if (!reqCommit.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const projectId = Number(req.params?.projectId);
  const message = (req.body?.message ?? "").trim();

  if (Number.isNaN(projectId)) {
    return res.status(400).json({ message: "projectId harus berupa angka" });
  }
  if (!message) {
    return res.status(400).json({ message: "message wajib diisi" });
  }

  try {
    const project = await prisma.project.update({
      where: {
        userId_localId: { userId: reqCommit.user.id, localId: projectId }
      },
      data: {
        totalCommit: {
          increment: 1
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: "Project tidak ditemukan" });
    }


    const newCommit = await prisma.commit.create({
      data: {
        localId: project.totalCommit,
        userId: reqCommit.user.id,
        projectLocalId: projectId,
        message,
      },
    });

    return res.status(201).json({
      data: newCommit,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ message: "Project dengan id tersebut tidak ditemukan!" })
      }
    }
    const message = error instanceof Error ? error.message : "Gagal membuat commit";
    return res.status(400).json({ message });
  }
}

export async function getCommitById(req: Request<CommitByIdParams>, res: Response) {
  const reqCommit = req as unknown as UserRequest;
  if (!reqCommit.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const localId = Number(req.params.commitId);
  const projectId = Number(req.params.projectId);

  if (Number.isNaN(localId)) {
    return res.status(400).json({ message: "localId harus berupa angka" });
  }
  if (Number.isNaN(projectId)) {
    return res.status(400).json({ message: "projectId harus berupa angka" });
  }
  const key = `commit:${reqCommit.user.id}:${projectId}:${localId}`
  try {
    const cached = await redis.get(key)
    if (cached) {
      return res.json({ data: JSON.parse(cached) })
    }
    const commit = await prisma.commit.findFirst({
      where: {
        localId,
        projectLocalId: projectId,
        userId: reqCommit.user.id,
      },
    });

    if (!commit) {
      return res.status(404).json({ message: "Commit dengan id tersebut tidak ditemukan" });
    }
    await redis.set(key, JSON.stringify(commit), 'EX', 60)
    return res.json({
      data: commit,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil commit";
    return res.status(500).json({ message });
  }
}

export async function updateCommit(req: Request<CommitByIdParams, {}, CommitUpdateBody>, res: Response,) {
  const reqCommit = req as unknown as UserRequest;
  if (!reqCommit.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const localId = Number(req.params.commitId);
  const projectId = Number(req.params.projectId);

  if (Number.isNaN(localId)) {
    return res.status(400).json({ message: "localId harus berupa angka" });
  }
  if (Number.isNaN(projectId)) {
    return res.status(400).json({ message: "projectId harus berupa angka" });
  }

  const message = req.body?.message?.trim();
  if (!message) {
    return res.status(400).json({ message: "message wajib diisi" });
  }
  const key = `commit:${reqCommit.user.id}:${projectId}:${localId}`
  try {
    const existing = await prisma.commit.findFirst({
      where: {
        localId,
        projectLocalId: projectId,
        userId: reqCommit.user.id,
      },
    });

    if (!existing) {
      return res.status(404).json({ message: "Commit dengan id tersebut tidak ditemukan" });
    }

    const updated = await prisma.commit.update({
      where: {
        userId_projectLocalId_localId: {
          userId: reqCommit.user.id,
          projectLocalId: projectId,
          localId: localId
        }
      },
      data: { message },
    });
    await redis.set(key, JSON.stringify(updated), 'EX', 120)
    return res.json({ data: updated });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.json(404).json({message: 'Commit dengan id tersebut tidak ditemukan'})
    }
    const messageError = error instanceof Error ? error.message : "Gagal memperbarui commit";
    return res.status(400).json({ message: messageError });
  }
}

export async function deleteCommit(req: Request<CommitByIdParams>, res: Response) {
  const reqCommit = req as unknown as UserRequest;
  if (!reqCommit.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const localId = Number(req.params.commitId);
  const projectId = Number(req.params.projectId);

  if (Number.isNaN(localId)) {
    return res.status(400).json({ message: "localId harus berupa angka" });
  }
  if (Number.isNaN(projectId)) {
    return res.status(400).json({ message: "projectId harus berupa angka" });
  }

  try {
    await prisma.commit.delete({
      where: {
        userId_projectLocalId_localId: {
          userId: reqCommit.user.id,
          projectLocalId: projectId,
          localId: localId
        }
      },
    });

    return res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.json(404).json({message: 'Commit dengan id tersebut tidak ditemukan'})
    }
    const message = error instanceof Error ? error.message : "Gagal menghapus commit";
    return res.status(400).json({ message });
  }
}

