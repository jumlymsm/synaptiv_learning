import { useState } from 'react'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import CourseForm from './CourseForm'
import type { CourseInput } from '../../types'

interface CreateCourseModalProps {
  open: boolean
  onClose: () => void
  onCreated: (data: CourseInput) => Promise<void>
}

export default function CreateCourseModal({ open, onClose, onCreated }: CreateCourseModalProps) {
  const [formData, setFormData] = useState<CourseInput | null>(null)
  const [formValid, setFormValid] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!formData || !formValid) return
    setSaving(true)
    try {
      await onCreated(formData)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} className="max-w-xl">
      <DialogHeader title="New Course" onClose={onClose} />
      <DialogBody>
        <CourseForm
          onChange={(data, valid) => {
            setFormData(data)
            setFormValid(valid)
          }}
        />
      </DialogBody>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!formValid || saving}>
          {saving ? 'Saving…' : 'Create Course'}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
