"use client";

import { useState } from "react";
import { CSVUploader } from "@/components/ui/csv-uploader";
import { FieldMapper } from "@/components/ui/field-mapper";
import { EnrichmentTable } from "@/components/ui/enrichment-table";
import { CSVRow, EnrichmentField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type AppStep = "upload" | "map" | "enrich";

export default function HomePage() {
  const [step, setStep] = useState<AppStep>("upload");
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<EnrichmentField[]>([]);
  const [emailColumn, setEmailColumn] = useState<string>("");

  const handleUpload = (rows: CSVRow[], columns: string[]) => {
    setCsvData(rows);
    setColumns(columns);
    setStep("map");
  };

  const handleStartEnrichment = async (
    emailCol: string,
    fields: EnrichmentField[]
  ) => {
    setEmailColumn(emailCol);
    setSelectedFields(fields);
    setStep("enrich");

    // This is a simplified fetch, a real implementation would use streaming
    const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: csvData, fields, emailColumn: emailCol }),
    });

    if (response.ok) {
        const reader = response.body?.getReader();
        if (!reader) {
            toast.error("Could not read enrichment stream.");
            return
        }

        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const json = JSON.parse(line.substring(6));
                    // Update state with the new data
                    setCsvData(currentData => {
                        const newData = [...currentData];
                        if (newData[json.rowIndex]) {
                            newData[json.rowIndex] = {
                                ...newData[json.rowIndex],
                                ...json.enrichments
                            };
                        }
                        return newData;
                    });
                }
            }
        }
        toast.success("Enrichment complete!");
    } else {
        toast.error("Enrichment failed.");
        handleBack(); // Go back to the mapping step on failure
    }
  };

  const handleBack = () => {
    setStep("upload");
    setCsvData([]);
    setColumns([]);
    setSelectedFields([]);
    setEmailColumn("");
  };

  const renderStep = () => {
    switch (step) {
      case "upload":
        return (
          <>
            <div className="text-center pt-8 pb-6">
              <h1 className="text-[2.5rem] lg:text-[3.8rem] text-[#36322F] dark:text-white font-semibold tracking-tight leading-[0.9]">
                <span className="relative px-1 text-transparent bg-clip-text bg-gradient-to-tr from-red-600 to-yellow-500 inline-flex justify-center items-center">
                  Fire Enrich
                </span>
                <span className="block leading-[1.1]">Drag, Drop, Enrich.</span>
              </h1>
            </div>
            <CSVUploader onUpload={handleUpload} />
          </>
        );
      case "map":
        return (
          <FieldMapper
            columns={columns}
            onStartEnrichment={handleStartEnrichment}
          />
        );
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
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-24">
      <div className="w-full max-w-4xl">
        {step !== "upload" && (
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}
        {renderStep()}
      </div>
    </main>
  );
}