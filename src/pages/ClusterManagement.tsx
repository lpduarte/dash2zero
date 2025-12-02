import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/dashboard/Header";
import { ClusterSidebar } from "@/components/clusters/ClusterSidebar";
import { ClusterStats } from "@/components/clusters/ClusterStats";
import { ProvidersTable } from "@/components/clusters/ProvidersTable";
import { EmailDialog } from "@/components/clusters/EmailDialog";
import { ImportDialog } from "@/components/clusters/ImportDialog";
import { CreateClusterDialog } from "@/components/clusters/CreateClusterDialog";
import { mockClusters, emailTemplates } from "@/data/mockClusters";
import { Cluster, ClusterProvider } from "@/types/cluster";
import { Mail, Upload } from "lucide-react";

export default function ClusterManagement() {
  const [clusters, setClusters] = useState<Cluster[]>(mockClusters);
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(
    mockClusters[0]?.id || null
  );
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [createClusterDialogOpen, setCreateClusterDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ClusterProvider | undefined>();

  const selectedCluster = clusters.find((c) => c.id === selectedClusterId);

  const handleSendEmail = (providerId?: string) => {
    if (providerId) {
      const provider = selectedCluster?.providers.find((p) => p.id === providerId);
      setSelectedProvider(provider);
    } else {
      setSelectedProvider(undefined);
    }
    setEmailDialogOpen(true);
  };

  const handleImport = (file: File) => {
    console.log("Importing file:", file.name);
    // Implementation would parse Excel and add providers
  };

  const handleCreateCluster = (name: string) => {
    const newCluster: Cluster = {
      id: Date.now().toString(),
      name,
      providers: [],
      createdAt: new Date(),
    };
    setClusters([...clusters, newCluster]);
    setSelectedClusterId(newCluster.id);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <ClusterSidebar
          clusters={clusters}
          selectedClusterId={selectedClusterId}
          onSelectCluster={setSelectedClusterId}
          onCreateCluster={() => setCreateClusterDialogOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-6">
            {selectedCluster ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{selectedCluster.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedCluster.providers.length} fornecedores neste cluster
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setImportDialogOpen(true)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Excel
                    </Button>
                    <Button
                      onClick={() => handleSendEmail()}
                      disabled={selectedCluster.providers.length === 0}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email para Todos
                    </Button>
                  </div>
                </div>

                <ClusterStats providers={selectedCluster.providers} />

                <Card className="p-6">
                  <ProvidersTable
                    providers={selectedCluster.providers}
                    onSendEmail={handleSendEmail}
                  />
                </Card>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Nenhum cluster selecionado
                  </p>
                  <Button onClick={() => setCreateClusterDialogOpen(true)}>
                    Criar Primeiro Cluster
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        templates={emailTemplates}
        provider={selectedProvider}
        providers={selectedProvider ? undefined : selectedCluster?.providers}
      />

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        clusterId={selectedClusterId || ""}
        onImport={handleImport}
      />

      <CreateClusterDialog
        open={createClusterDialogOpen}
        onOpenChange={setCreateClusterDialogOpen}
        onCreate={handleCreateCluster}
      />
    </div>
  );
}
