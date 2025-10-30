import { UserRequest } from "../types/userType";
import { PrismaClient } from "../../generated/prisma";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface CommitParams {
  projectLocalId?: string;
}

interface CommitByIdParams {
  localId: string;
  projectLocalId: string;
}

interface CommitBody {
  localId: number;
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

  try {
    const allCommit = await prisma.commit.findMany({
      where: {
        userId: reqCommit.user.id,
      },
      orderBy: {
        createAt: "desc",
      },
    });

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

  const projectId = Number(req.params?.projectLocalId);
  if (Number.isNaN(projectId)) {
    return res.status(400).json({ message: "projectId harus berupa angka" });
  }

  try {
    const allCommit = await prisma.commit.findMany({
      where: {
        userId: reqCommit.user.id,
        projectLocalId: projectId,
      },
      orderBy: {
        createAt: "desc",
      },
    });

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

  const localId = Number(req.body?.localId);
  const projectId = Number(req.params?.projectLocalId);
  const message = (req.body?.message ?? "").trim();

  if (Number.isNaN(projectId)) {
    return res.status(400).json({ message: "projectId harus berupa angka" });
  }
  if (Number.isNaN(localId)) {
    return res.status(400).json({ message: "localId harus berupa angka" });
  }
  if (!message) {
    return res.status(400).json({ message: "message wajib diisi" });
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        userId: reqCommit.user.id,
        localId: projectId,
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project tidak ditemukan" });
    }

    const newCommit = await prisma.commit.create({
      data: {
        localId,
        userId: reqCommit.user.id,
        projectLocalId: projectId,
        message,
      },
    });

    return res.status(201).json({
      data: newCommit,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membuat commit";
    return res.status(400).json({ message });
  }
}

export async function getCommitById(req: Request<CommitByIdParams>, res: Response) {
  const reqCommit = req as unknown as UserRequest;
  if (!reqCommit.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const localId = Number(req.params.localId);
  const projectId = Number(req.params.projectLocalId);

  if (Number.isNaN(localId)) {
    return res.status(400).json({ message: "localId harus berupa angka" });
  }
  if (Number.isNaN(projectId)) {
    return res.status(400).json({ message: "projectId harus berupa angka" });
  }

  try {
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

  const localId = Number(req.params.localId);
  const projectId = Number(req.params.projectLocalId);

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
      where: { id: existing.id },
      data: { message },
    });

    return res.json({ data: updated });
  } catch (error) {
    const messageError = error instanceof Error ? error.message : "Gagal memperbarui commit";
    return res.status(400).json({ message: messageError });
  }
}

export async function deleteCommit(req: Request<CommitByIdParams>, res: Response) {
  const reqCommit = req as unknown as UserRequest;
  if (!reqCommit.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const localId = Number(req.params.localId);
  const projectId = Number(req.params.projectLocalId);

  if (Number.isNaN(localId)) {
    return res.status(400).json({ message: "localId harus berupa angka" });
  }
  if (Number.isNaN(projectId)) {
    return res.status(400).json({ message: "projectId harus berupa angka" });
  }

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

    await prisma.commit.delete({
      where: { id: existing.id },
    });

    return res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus commit";
    return res.status(400).json({ message });
  }
}

