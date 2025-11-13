import {useCallback, useState,} from "react"
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
import { CirclePlus } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { useAuth } from "../auth/AuthContext"

type AddButtonProps = {
  onCreated?: () => void
  param?: string
}

export function AddCommitButton({ onCreated, param }: AddButtonProps) {
  const { token } = useAuth()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<{message: string}>({message: ""})

  const resetForm = useCallback(() => {
    setForm({
      message: ""
    })
    setError(null)
  }, [])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm()
    }
    setOpen(nextOpen)
  }

  const handleInputChange =
    (field: "message") => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }))
    }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!token) {
      setError("Sesi login tidak ditemukan, silakan masuk kembali.")
      return
    }

    const message = form.message.trim()

    if (!message) {
      setError("message wajib diisi.")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      await apiFetch("/projects/"+param+"/commits", {
        method: "POST",
        token,
        body: {
          message
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
        <Button variant="outline" className="p-5 w-50">
          <CirclePlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Commit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Label htmlFor="project-name">Message</Label>
            <Input
              id="message"
              name="message"
              value={form.message}
              onChange={handleInputChange("message")}
              disabled={isSaving}
            />
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
