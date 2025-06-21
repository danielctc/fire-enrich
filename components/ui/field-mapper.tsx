"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ALL_ENRICHMENT_FIELDS } from "@/lib/types/field-generation"
import type { EnrichmentField } from "@/lib/types"
import { useState } from "react"

export function FieldMapper({
  columns,
  onStartEnrichment,
}: {
  columns: string[]
  onStartEnrichment: (emailColumn: string, selectedFields: EnrichmentField[]) => void
}) {
  const [emailColumn, setEmailColumn] = useState("")
  const [selectedFields, setSelectedFields] = useState<EnrichmentField[]>([])

  const handleFieldToggle = (field: EnrichmentField) => {
    setSelectedFields(prev =>
      prev.some(f => f.name === field.name)
        ? prev.filter(f => f.name !== field.name)
        : [...prev, field]
    )
  }

  const handleStart = () => {
    if (!emailColumn) {
      alert("Please select the column containing email addresses.")
      return
    }
    if (selectedFields.length === 0) {
        alert("Please select at least one field to enrich.")
        return
    }
    onStartEnrichment(emailColumn, selectedFields)
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold">Map your data</Label>
        <p className="text-sm text-muted-foreground">
          Tell us which column contains the email addresses and what data you want to find.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="email-column">Email Column</Label>
            <Select onValueChange={setEmailColumn} value={emailColumn}>
            <SelectTrigger id="email-column">
                <SelectValue placeholder="Select email column" />
            </SelectTrigger>
            <SelectContent>
                {columns.map(col => (
                <SelectItem key={col} value={col}>
                    {col}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <Label>Fields to Enrich</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 rounded-lg border p-4">
            {ALL_ENRICHMENT_FIELDS.map(field => (
                <div key={field.name} className="flex items-center space-x-2">
                <Checkbox
                    id={field.name}
                    checked={selectedFields.some(f => f.name === field.name)}
                    onCheckedChange={() => handleFieldToggle(field)}
                />
                <Label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {field.displayName}
                </Label>
                </div>
            ))}
            </div>
        </div>
      </div>

      <Button onClick={handleStart} className="w-full">
        Start Enrichment
      </Button>
    </div>
  )
} 