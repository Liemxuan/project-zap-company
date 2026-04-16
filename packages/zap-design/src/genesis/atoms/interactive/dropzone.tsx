"use client"

import * as React from "react"
import { useDropzone, DropzoneOptions } from "react-dropzone"
import { UploadCloud, File as FileIcon, X } from "lucide-react"

import { cn } from '../../../lib/utils'

export interface DropzoneProps extends DropzoneOptions {
  className?: string
  value?: File[]
  onChange?: (files: File[]) => void
  hideFileList?: boolean
  children?: React.ReactNode
}

export const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  ({ className, value, onChange, hideFileList, children, ...props }, ref) => {
    const [files, setFiles] = React.useState<File[]>(value || [])

    React.useEffect(() => {
      if (value !== undefined) {
        setFiles(value)
      }
    }, [value])

    const onDrop = React.useCallback(
      (acceptedFiles: File[]) => {
        const newFiles = [...files, ...acceptedFiles]
        setFiles(newFiles)
        onChange?.(newFiles)
        if (props.onDrop) {
          props.onDrop(acceptedFiles, [], null as unknown as React.DragEvent<HTMLElement>)
        }
      },
      [files, onChange, props]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      ...props,
      onDrop,
    })

    const removeFile = (fileToRemove: File, e: React.MouseEvent) => {
      e.stopPropagation()
      const newFiles = files.filter((f) => f !== fileToRemove)
      setFiles(newFiles)
      onChange?.(newFiles)
    }

    return (
      <div className={cn("space-y-4", className)} ref={ref}>
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-[var(--container-radius,12px)] border-2 border-dashed border-muted p-6 text-center transition-colors hover:bg-muted/50",
            isDragActive && "border-primary bg-primary/10 text-primary",
            className
          )}
        >
          <input {...getInputProps()} />
          {children ? (
            children
          ) : (
            <>
              <UploadCloud className={cn("mb-4 h-10 w-10 text-muted-foreground", isDragActive && "text-primary")} />
              <p className="mb-2 text-sm font-medium">
                Drag & drop files here, or click to select files
              </p>
              <p className="text-xs text-muted-foreground">
                Support for images and documents.
              </p>
            </>
          )}
        </div>

        {!hideFileList && files.length > 0 && (
          <div className="grid gap-2">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border border-input p-2 pr-4"
              >
                <div className="flex items-center space-x-2">
                  <div className="rounded-md bg-muted p-2">
                    <FileIcon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  aria-label={`Remove ${file.name}`}
                  onClick={(e) => removeFile(file, e)}
                  type="button"
                  className="rounded-full p-1 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
Dropzone.displayName = "Dropzone"
