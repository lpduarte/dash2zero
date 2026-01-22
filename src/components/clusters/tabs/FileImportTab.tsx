import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Info, Download } from "lucide-react";
import { toast } from "sonner";
import { NewCompanyData } from "./ManualEntryTab";

interface FileImportTabProps {
  onAddCompanies: (companies: NewCompanyData[]) => void;
  onClose: () => void;
}

interface ParsedRow {
  name: string;
  nif: string;
  email: string;
  valid: boolean;
  errors: string[];
}

// Validate Portuguese NIF (9 digits)
function isValidNif(nif: string): boolean {
  return /^\d{9}$/.test(nif);
}

// Validate email format
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Mock file parsing - in a real app this would use a library like xlsx
function parseFile(file: File): Promise<ParsedRow[]> {
  return new Promise((resolve) => {
    // Simulate file processing
    setTimeout(() => {
      // For now, return mock data
      // In production, you would use xlsx library to parse the file
      const mockData: ParsedRow[] = [
        {
          name: "Empresa Exemplo 1, Lda",
          nif: "123456789",
          email: "contacto@exemplo1.pt",
          valid: true,
          errors: [],
        },
        {
          name: "Empresa Exemplo 2, SA",
          nif: "987654321",
          email: "geral@exemplo2.pt",
          valid: true,
          errors: [],
        },
      ];
      resolve(mockData);
    }, 500);
  });
}

export function FileImportTab({ onAddCompanies, onClose }: FileImportTabProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const headers = "Nome;NIF;Email";
    const example = "Empresa Exemplo, Lda;123456789;contacto@empresa.pt";
    const content = `${headers}\n${example}`;

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template_empresas.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".xlsx") &&
        !selectedFile.name.endsWith(".xls") &&
        !selectedFile.name.endsWith(".csv")) {
      toast.error("Por favor, selecione um ficheiro Excel (.xlsx, .xls) ou CSV");
      return;
    }

    setFile(selectedFile);
    setIsLoading(true);

    try {
      const data = await parseFile(selectedFile);
      setParsedData(data);
    } catch {
      toast.error("Erro ao processar o ficheiro");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleClear = () => {
    setFile(null);
    setParsedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImport = () => {
    if (!parsedData) return;

    const validCompanies = parsedData
      .filter(r => r.valid)
      .map(r => ({
        name: r.name,
        nif: r.nif,
        email: r.email,
      }));

    if (validCompanies.length === 0) {
      toast.error("Nenhuma empresa válida para importar");
      return;
    }

    onAddCompanies(validCompanies);
    toast.success(`${validCompanies.length} empresa${validCompanies.length > 1 ? "s" : ""} importada${validCompanies.length > 1 ? "s" : ""} com sucesso`);
    onClose();
  };

  const validCount = parsedData?.filter(r => r.valid).length ?? 0;
  const invalidCount = parsedData ? parsedData.length - validCount : 0;

  if (!parsedData) {
    return (
      <div className="space-y-4 pt-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            O ficheiro deve conter as colunas: <strong>Nome</strong>, <strong>NIF</strong>, <strong>Email</strong>
            <br />
            <button
              onClick={downloadTemplate}
              className="text-primary underline hover:no-underline mt-2 inline-flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              Descarregar template
            </button>
          </AlertDescription>
        </Alert>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground"
            }
            ${isLoading ? "opacity-50 pointer-events-none" : ""}
          `}
        >
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">A processar ficheiro...</p>
            </div>
          ) : file ? (
            <div className="text-center">
              <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-bold">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">Clique para alterar</p>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Arraste um ficheiro ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Excel (.xlsx, .xls) ou CSV
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-bold">{file?.name}</span>
          </div>
          <span className="text-sm">
            <span className="text-foreground font-bold">{parsedData.length}</span>
            <span className="text-muted-foreground"> empresa{parsedData.length !== 1 ? "s" : ""}</span>
          </span>
          {invalidCount > 0 && (
            <span className="text-sm text-destructive">
              {invalidCount} com erros
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Escolher outro ficheiro
        </Button>
      </div>

      <div className="border rounded-lg max-h-[300px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="w-32">NIF</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-16 text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parsedData.map((row, i) => (
              <TableRow key={i} className={row.valid ? "" : "bg-destructive/5"}>
                <TableCell className="font-normal">{row.name || <span className="text-muted-foreground italic">—</span>}</TableCell>
                <TableCell>{row.nif || <span className="text-muted-foreground italic">—</span>}</TableCell>
                <TableCell className="text-muted-foreground">{row.email || <span className="italic">—</span>}</TableCell>
                <TableCell className="text-center">
                  {row.valid ? (
                    <CheckCircle className="h-4 w-4 text-green-500 inline-block" />
                  ) : (
                    <span title={row.errors.join(", ")}>
                      <AlertCircle className="h-4 w-4 text-destructive inline-block" />
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleImport} disabled={validCount === 0}>
          Importar {validCount} empresa{validCount !== 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
}
