import { useParams } from "react-router-dom"
import { CommitTable } from "./CommitTable"
import { AddCommitButton } from "./AddCommitButton"
import { EditProjectButton } from "./EditProjectButton"
import { useEffect, useState, useCallback, useMemo } from "react"
import { apiFetch } from "@/lib/api"
import { useAuth } from "../auth/AuthContext"
import type { CommitApiResponse, ProjectApiItem, ProjectApiResponse, ProjectApiResponseById } from "@/lib/projectApi"
import { mapCommitsResponse, mapProjectResponseById, normalizeProject, normalizeProjectById } from "@/lib/projectApi"


export default function ProjectPage(){
    const {id} = useParams()
    const {token} = useAuth()
    const [commits, setCommits] = useState<any[]>([])
    const [projects, setProjects] = useState<any>()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string|null>(null)

    const fetchCommits = useCallback(async (signal?: AbortSignal, keepCommit = false) => {
        if (!token) {
            setCommits([])
            return
        }
        if (keepCommit) {
            setIsLoading(false)
            setError(null)
        } else{
            setIsLoading(true)
            setError(null)
        }

        try {
            const data = await apiFetch<ProjectApiResponseById>('/projects/'+id, {token, signal})
            let normalizeData = mapProjectResponseById(data);
            console.log(normalizeData)
            setProjects(normalizeData)
            setCommits(normalizeData.commits)
            
        } catch (error: any) {
            if (error.name == "AbortError") {
                return
            }
            setError(error.message || "Failed to load commits")
        } finally {
            setIsLoading(false)
        }
    }, [token, id]) 

    useEffect(() => {
        const controller = new AbortController()
        fetchCommits(controller.signal)

        return () => controller.abort()
    }, [fetchCommits])

    const content = useMemo(() => {
       if (isLoading) {
         return (
           <div className="flex min-h-[160px] items-center justify-center rounded-xl border bg-muted/30 text-sm text-muted-foreground">
             Memuat project...
           </div>
         )
       }
   
       if (error) {
         return (
           <div className="flex min-h-[160px] items-center justify-center rounded-xl border bg-destructive/5 px-4 text-sm text-destructive">
             {error}
           </div>
         )
       }   
   
       return <CommitTable data={commits}/>
     }, [error, isLoading, commits])

    return (
        <div className="p-9">
            {!isLoading && 
            <div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                        <h1 className="text-4xl">{projects?.projectName}</h1>
                        <div>{projects?.description}</div>
                    </div>
                    <div className="col-span-2">
                        {content}
                    </div>
                </div>
                <div className="flex justify-between mt-5">
                    <EditProjectButton param={id} onCreated={() => fetchCommits(undefined, true)} data={projects}/>
                    <AddCommitButton param={id} onCreated={() => fetchCommits(undefined, true)}/>
                </div>
            </div>}
        </div>
    )
}