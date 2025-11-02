import { useParams } from "react-router-dom"
import { CommitTable } from "./CommitTable"



export default function ProjectPage(){
    const {id} = useParams()
    console.log(id)
    return (
        <div>
            <CommitTable />
        </div>
    )
}