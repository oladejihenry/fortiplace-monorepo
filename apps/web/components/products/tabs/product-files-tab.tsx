import { FileUpload } from "@/components/file-upload"
import { UseFormReturn } from "react-hook-form"
import { BasicInfoFormValues } from "../basic-product-form"
import { Switch } from "@workspace/ui/components/switch"

interface ProductFilesTabProps {
  form: UseFormReturn<BasicInfoFormValues>
  fileMetadata: {
    name: string;
    size: number;
    type: string;
    file_hash?: string;
  } | null
  setFileMetadata: (metadata: {
    name: string;
    size: number;
    type: string;
    file_hash?: string;
  } | null) => void
}

export function ProductFilesTab({ form, fileMetadata, setFileMetadata }: ProductFilesTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Product File</label>
        <FileUpload
          endpoint="product-file"
          value={form.watch("product_file") || ""}
          initialFileMetadata={fileMetadata}
          onChange={(value, metadata) => {
            form.setValue("product_file", value)
            if (metadata) {
              form.setValue("file_hash", metadata.file_hash || "")
              setFileMetadata({
                name: metadata.name || "",
                size: metadata.size || 0,
                type: metadata.type || "",
                file_hash: metadata.file_hash || ""
              })
            }
          }}
          onRemove={() => {
            form.setValue("product_file", "")
            form.setValue("file_hash", "")
            setFileMetadata(null)
          }}
        />
        <p className="text-sm text-muted-foreground">
          Upload your product file (PDF, ZIP, JPG, PNG or RAR up to 100MB)
        </p>
        {form.formState.errors.product_file && (
          <p className="text-sm text-red-500">{form.formState.errors.product_file.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">View Product Online (PDF only)</label>
        <p className="text-sm text-muted-foreground">
          Allow customers to view the product online and not download it
        </p>
        <Switch
          checked={form.watch("view_product_online")}
          onCheckedChange={(checked) => form.setValue("view_product_online", checked)}
        />
      </div>
    </div>
  )
}