import { IconInnerShadowTop } from "@tabler/icons-react"
import { Link } from "react-router-dom"

export default function Title(){
    return (
        <Link to="/dashboard">
            <IconInnerShadowTop className="!size-5" />
            <span className="text-base font-semibold">Acme Inc.</span>
        </Link>
    )
}