import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PencilOff, CalendarIcon  } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { apiFetch } from "@/lib/api"
import { useAuth } from "../auth/AuthContext"

type AddButtonProps = {
    onCreated?: () => void,
    param?: string,
    data?: any
}

export function EditProjectButton({ onCreated, param, data }: AddButtonProps) {
    const { token } = useAuth()
    const [open, setOpen] = React.useState(false)
    const [isSaving, setIsSaving] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [form, setForm] = React.useState<{
        title: string
        description: string
        deadline: Date | undefined
        status: "In Progress" | "Done"
    }>({
        title: data?.projectName ?? "",
        description: data?.description ?? "",
        deadline: data?.deadline ? new Date(data.deadline) : undefined,
        status: data?.status === "Done" ? "Done" : "In Progress",
    })

    const resetForm = React.useCallback(() => {
        setForm({
        title: data?.projectName ?? "",
        description: data?.description ?? "",
        deadline: data?.deadline ? new Date(data.deadline) : undefined,
        status: data?.status === "Done" ? "Done" : "In Progress",
        })
        setError(null)
    }, [data])

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
        resetForm()
        }
        setOpen(nextOpen)
    }

    const handleInputChange =
        (field: "title" | "description") => (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            [field]: event.target.value,
        }))
        }

    const handleDateSelect = (selected?: Date) => {
        setForm((prev) => ({
        ...prev,
        deadline: selected,
        }))
    }

    const handleStatusChange = (nextStatus: string) => {
        setForm((prev) => ({
        ...prev,
        status: nextStatus === "Done" ? "Done" : "In Progress",
        }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!token) {
        setError("Sesi login tidak ditemukan, silakan masuk kembali.")
        return
        }

        const title = form.title.trim()
        const description = form.description.trim()

        if (!title) {
        setError("Nama project wajib diisi.")
        return
        }

        setIsSaving(true)
        setError(null)

        try {
        await apiFetch("/projects/"+param, {
            method: "PUT",
            token,
            body: {
            title,
            description: description,
            deadline: form.deadline?.toISOString(),
            status: form.status === "Done",
            },
        })

        resetForm()
        setOpen(false)
        onCreated?.()
        } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Gagal membuat project."
        setError(message)
        } finally {
        setIsSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
            <Button variant="outline" size="icon">
            <PencilOff />
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <form className="grid gap-4" onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogDescription>
                Edit your project here
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                id="project-name"
                name="name"
                value={form.title}
                onChange={handleInputChange("title")}
                disabled={isSaving}
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="project-description">Description</Label>
                <Input
                id="project-description"
                name="description"
                value={form.description}
                onChange={handleInputChange("description")}
                disabled={isSaving}
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="project-status">Status</Label>
                <RadioGroup
                id="project-status"
                value={form.status}
                onValueChange={handleStatusChange}
                className="grid gap-2 sm:grid-cols-2"
                disabled={isSaving}
                >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="In Progress" id="status-in-progress" disabled={isSaving} />
                    <Label htmlFor="status-in-progress" className="font-normal">
                    In Progress
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Done" id="status-done" disabled={isSaving} />
                    <Label htmlFor="status-done" className="font-normal">
                    Done
                    </Label>
                </div>
                </RadioGroup>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="project-deadline">Deadline</Label>
                <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.deadline && "text-muted-foreground"
                    )}
                    type="button"
                    disabled={isSaving}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.deadline ? format(form.deadline, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    mode="single"
                    selected={form.deadline}
                    onSelect={handleDateSelect}
                    initialFocus
                    />
                </PopoverContent>
                </Popover>
            </div>
            {error ? (
                <p className="text-sm text-destructive">
                {error}
                </p>
            ) : null}
            <DialogFooter>
                <DialogClose asChild>
                <Button variant="outline" type="button" disabled={isSaving}>
                    Cancel
                </Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
                </Button>
            </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    )
}
