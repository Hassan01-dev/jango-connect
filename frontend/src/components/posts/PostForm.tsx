import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import { uploadToCloudinary } from '@/lib/uploadToCloudinary'
import axios from '@/lib/axios'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const schema = z.object({
  content: z.string().min(1, 'Content is required'),
  images: z
    .custom<File[]>()
    .refine(
      (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      'Only .jpg, .png, .webp files are allowed.'
    )
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      'Each file must be less than 5MB.'
    )
})

type FormData = z.infer<typeof schema>

export default function PostForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: '',
      images: []
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      setSelectedFiles([...selectedFiles, ...fileArray])
      setValue('images', [...selectedFiles, ...fileArray])
    }
  }

  const removeImage = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updatedFiles)
    setValue('images', updatedFiles)
  }

  const onSubmit = async (data: FormData) => {
    try {
      setErrorMessage(null)

      const uploadedUrls = await Promise.all(
        data.images.map(uploadToCloudinary)
      )

      const response = await axios.post('/posts', {
        content: data.content,
        media: uploadedUrls
      })

      if (response.status === 201 && response.data?.post?.uuid) {
        reset()
        setSelectedFiles([])
      } else {
        setErrorMessage('Unexpected response from server.')
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error || 'Something went wrong while posting.'
      setErrorMessage(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" {...register('content')} />
        {errors.content && (
          <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="images">Upload Images</Label>
        <Input
          id="images"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          className="w-full border-2 border-dashed rounded-xl p-4 cursor-pointer text-center text-sm text-muted-foreground"
          onClick={() =>
            document.getElementById('images')?.click()
          }
        >
          Drag and drop or click to upload
        </div>

        {errors.images?.message && (
          <p className="text-sm text-red-500 mt-1">{errors.images.message}</p>
        )}

        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {selectedFiles.map((file, index) => (
              <Card
                key={index}
                className="relative overflow-hidden rounded-md border"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1"
                >
                  <Trash2 size={16} />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Post'}
      </Button>
    </form>
  )
}
