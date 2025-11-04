import { useParams } from "react-router-dom"
import { CommitTable } from "./CommitTable"
import { AddCommitButton } from "./AddCommitButton"
import { EditProjectButton } from "./EditProjectButton"
import { useEffect, useState, useCallback, useMemo } from "react"
import { apiFetch } from "@/lib/api"
import { useAuth } from "../auth/AuthContext"
import type { CommitApiResponse } from "@/lib/projectApi"
import { mapCommitsResponse } from "@/lib/projectApi"


export default function ProjectPage(){
    const {id} = useParams()
    const {token} = useAuth()
    const [commits, setCommits] = useState<any[]>([])
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
            const data = await apiFetch<CommitApiResponse>('/projects/'+id+"/commits", {token, signal})
            setCommits(mapCommitsResponse(data))
            console.log(data)
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
       console.log(isLoading)
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
        <div>
            <div>
                {content}
            </div>
            <div>
                <AddCommitButton param={id} onCreated={() => fetchCommits(undefined, true)}/>
                <EditProjectButton />
            </div>
        </div>
    )
}