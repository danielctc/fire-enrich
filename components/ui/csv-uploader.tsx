"use client"

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CSVRow } from "@/lib/types";
import { FIRE_ENRICH_CONFIG } from "@/lib/config";
import Link from "next/link";

export function CSVUploader({ onUpload }: { onUpload: (rows: CSVRow[], columns: string[]) => void }) {
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setLoading(true);
      const file = acceptedFiles[0];
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as CSVRow[];
          const columns = results.meta.fields || [];

          if (rows.length > FIRE_ENRICH_CONFIG.CSV_LIMITS.MAX_ROWS) {
            toast.error(
              <div className="flex flex-col">
                <span>CSV file contains too many rows.</span>
                <span className="text-xs">Maximum allowed: {FIRE_ENRICH_CONFIG.CSV_LIMITS.MAX_ROWS} rows</span>
                <span className="text-xs mt-2">
                  To process larger datasets, clone the repository and run it locally.
                  <Link href="https://github.com/mendableai/fire-enrich" target="_blank" className="underline ml-1">
                    Get the code
                  </Link>
                </span>
              </div>
            );
            setLoading(false);
            return;
          }

          if (columns.length > FIRE_ENRICH_CONFIG.CSV_LIMITS.MAX_COLUMNS) {
            toast.error(
              <div className="flex flex-col">
                <span>CSV file contains too many columns.</span>
                <span className="text-xs">Maximum allowed: {FIRE_ENRICH_CONFIG.CSV_LIMITS.MAX_COLUMNS} columns</span>
                <span className="text-xs mt-2">
                  To process larger datasets, clone the repository and run it locally.
                  <Link href="https://github.com/mendableai/fire-enrich" target="_blank" className="underline ml-1">
                    Get the code
                  </Link>
                </span>
              </div>
            );
            setLoading(false);
            return;
          }

          onUpload(rows, columns);
          setLoading(false);
        },
        error: (error) => {
          toast.error("Error parsing CSV file.");
          console.error("CSV parsing error:", error);
          setLoading(false);
        },
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
      ${isDragActive ? "border-primary" : "border-gray-300"}`}
    >
      <input {...getInputProps()} />
      {loading ? (
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
      ) : (
        <p>Drag &apos;n&apos; drop a CSV file here, or click to select one</p>
      )}
    </div>
  );
} 