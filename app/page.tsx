"use client";

import { useState } from "react";
import { CSVUploader } from "@/components/ui/csv-uploader";
import { FieldMapper } from "@/components/ui/field-mapper";
import { EnrichmentTable } from "@/components/ui/enrichment-table";
import { CSVRow, EnrichmentField, RowEnrichmentResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type AppStep = "upload" | "map" | "enrich";

export default function HomePage() {
  const [step, setStep] = useState<AppStep>("upload");
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<EnrichmentField[]>([]);
  const [emailColumn, setEmailColumn] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (rows: CSVRow[], columns: string[]) => {
    setCsvData(rows);
    setColumns(columns);
    setStep("map");
  };

  const processStream = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\\n");

      buffer = lines.pop() || ""; // Keep the last partial line

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const json = JSON.parse(line.substring(6));
            if (json.type === 'enrichment-result') {
              const result = json.data as RowEnrichmentResult;
              setCsvData(currentData => {
                const newData = [...currentData];
                if (newData[result.rowIndex]) {
                  const newRow = { ...newData[result.rowIndex] };
                  for (const fieldName in result.enrichments) {
                    const enrichment = result.enrichments[fieldName];
                    // Handle both simple values and array values
                    newRow[fieldName] = Array.isArray(enrichment.value)
                      ? enrichment.value.join(", ")
                      : enrichment.value?.toString() ?? "";
                  }
                  newData[result.rowIndex] = newRow;
                }
                return newData;
              });
            }
          } catch (e) {
            console.error("Error parsing stream data:", e);
          }
        }
      }
    }
  };
  
  const handleStartEnrichment = async (emailCol: string, fields: EnrichmentField[]) => {
    setEmailColumn(emailCol);
    setSelectedFields(fields);
    setStep("enrich");
    setIsProcessing(true);

    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: csvData, fields, emailColumn: emailCol }),
      });

      if (response.ok && response.body) {
        await processStream(response.body.getReader());
        toast.success("Enrichment complete!");
      } else {
        const errorText = await response.text();
        toast.error(`Enrichment failed: ${response.statusText}`, { description: errorText });
        handleBack();
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred during enrichment.");
      handleBack();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    setStep("upload");
    setCsvData([]);
    setColumns([]);
    setSelectedFields([]);
    setEmailColumn("");
    setIsProcessing(false);
  };
  
  const renderStep = () => {
    switch (step) {
      case "upload":
        return (
          <div className="text-center w-full max-w-xl mx-auto">
            <div className="pt-8 pb-6">
              <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
                <span className="relative px-1 text-transparent bg-clip-text bg-gradient-to-tr from-red-600 to-yellow-500">
                  Fire Enrich
                </span>
                <span className="block leading-tight">Drag, Drop, Enrich.</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Turn a list of emails into a rich dataset with company profiles, funding data, tech stacks, and more.
              </p>
            </div>
            <CSVUploader onUpload={handleUpload} />
            <div className="mt-4 text-center">
              <a href="/sample-data.csv" download="sample-data.csv" className="inline-flex items-center text-sm text-primary hover:underline">
                <Download className="mr-2 h-4 w-4" />
                Download sample CSV
              </a>
            </div>
          </div>
        );
      case "map":
        return <FieldMapper columns={columns} onStartEnrichment={handleStartEnrichment} />;
      case "enrich":
        return (
          <EnrichmentTable
            rows={csvData}
            fields={selectedFields}
            emailColumn={emailColumn}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-12 md:p-24">
      <div className="w-full max-w-6xl">
        {step !== "upload" && (
          <Button variant="ghost" onClick={handleBack} disabled={isProcessing} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Upload
          </Button>
        )}
        <div className="flex justify-center">{renderStep()}</div>
      </div>
      <footer className="py-6 mt-12 text-center text-xs text-muted-foreground w-full">
        <p>
          Built with{" "}
          <Link href="https://www.mendable.ai" target="_blank" className="underline">
            Mendable
          </Link>{" "}
          &{" "}
          <Link href="https://www.firecrawl.dev" target="_blank" className="underline">
            Firecrawl
          </Link>
          .
        </p>
        <p className="mt-2">
          This is an open-source project. Get the code on{" "}
          <Link href="https://github.com/mendableai/fire-enrich" target="_blank" className="underline">
            GitHub
          </Link>
          .
        </p>
      </footer>
    </main>
  );
}