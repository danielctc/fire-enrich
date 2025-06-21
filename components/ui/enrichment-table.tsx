"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CSVRow, EnrichmentField } from "@/lib/types"

export function EnrichmentTable({
  rows,
  fields,
  emailColumn,
}: {
  rows: CSVRow[]
  fields: EnrichmentField[]
  emailColumn: string
}) {
  const displayColumns = [emailColumn, ...fields.map(f => f.name)];

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {displayColumns.map(col => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {displayColumns.map(col => (
                <TableCell key={col}>
                  {row[col] || "..."}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 