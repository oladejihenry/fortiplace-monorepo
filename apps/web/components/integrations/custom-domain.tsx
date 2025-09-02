"use client";
import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Copy, Trash } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface DomainEntry {
  id: string;
  domain: string;
  custom_domain_status: "pending" | "verified" | "error" | "active";
  type: "custom_domain" | "subdomain";
  subdomain: string;
  custom_domain: string;
  subdomain_url: string;
}

interface DnsRecord {
  type: string;
  host: string;
  value: string;
  ttl?: number;
}

interface VerificationRecord {
  type: string;
  domain: string;
  value: string;
  reason?: string;
}

export default function CustomDomainIntegration() {
  const [domain, setDomain] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "verified" | "error" | "failed" | "false">("idle");
  const [domains, setDomains] = useState<DomainEntry[]>([]);
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([]);
  const [verificationRecords, setVerificationRecords] = useState<VerificationRecord[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<DomainEntry | null>(null);

  console.log(status);

  // Fetch current domains (custom + subdomain) from your backend
  async function fetchDomains() {
    try {
      const res = await axios.get("/api/integrations/custom-domain/list");
      if (res.status === 200) {
        setDomains(res.data.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setMessage(error.response?.data.message);
      }
    }
  }

  // Add domain
  async function handleAddDomain() {
    setStatus("pending");
    setMessage("");
    try {
      const res = await axios.post("/api/integrations/custom-domain", { domain });
      if (res.status === 200) {
        setMessage("Domain added! Polling for verification...");
        pollStatus();
        fetchDomains();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setMessage(error.response?.data.message);
      }
    }
  }

  // Poll status
  async function pollStatus() {
    const interval = setInterval(async () => {
      const res = await axios.get("/api/integrations/custom-domain/status");
      console.log(res.data.data.custom_domain_status);
        if (res.status === 200) {
            setStatus(res.data.data.custom_domain_status);
            const verification = res.data.data.verification || {};
            setDnsRecords(verification.dns_records || []);
            setVerificationRecords(verification.verification_records || []);
            fetchDomains();
            if (res.data.data.custom_domain_status === "verified" || res.data.data.custom_domain_status === "error") {
                clearInterval(interval);
            }
        }
    }, 5000);
  }

  useEffect(() => {
    fetchDomains();
    pollStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    function handleCopy(value: string) {
        navigator.clipboard.writeText(value);
        toast.success("Copied to clipboard!");
    }

    async function handleDeleteDomain(id: string) {
        try {
            const res = await axios.delete(`/api/integrations/custom-domain/${id}`);
            if (res.status === 200) {
                fetchDomains();
                setMessage("Custom domain deleted!");
                setDomain("");
                toast.success("Custom domain deleted!");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                setMessage(error.response?.data.message);
            }
        }
    }

    const hasCustomDomain = domains.some(d => d.custom_domain && d.custom_domain.trim() !== "");

    function openDeleteModal(domain: DomainEntry) {
        setDomainToDelete(domain);
        setShowDeleteModal(true);
    }

    function closeDeleteModal() {
        setDomainToDelete(null);
        setShowDeleteModal(false);
    }

    async function confirmDeleteDomain() {
        if (!domainToDelete) return;
        await handleDeleteDomain(domainToDelete.id);
        closeDeleteModal();
    }

  return (
    <div className="flex flex-col space-y-8">
      <h2 className="text-2xl font-bold text-start mb-2">Connect your custom domain</h2>
      <p className="text-sm text-muted-foreground mb-6 text-start">
        Connect your custom domain to your store.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <Input
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="yourdomain.com"
          className="flex-1"
        />
        <Button onClick={handleAddDomain} className="w-full sm:w-auto">
          Add Domain
        </Button>
      </div>
      {message && <p className="mb-4 text-center text-sm text-muted-foreground">{message}</p>}

      <div className="bg-card rounded-lg shadow p-4 mb-8">
        <h3 className="font-semibold mb-3">Your Domains</h3>
        
        {/* Mobile: Card Layout */}
        <div className="flex flex-col gap-3 sm:hidden">
          {domains.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">No domains connected yet.</div>
          ) : (
            domains.map((d, i) => (
              <div key={i} className="bg-background rounded-lg p-4 flex flex-col gap-2">
                <div className="font-mono break-all text-sm">{d.custom_domain && d.custom_domain.trim() !== "" ? d.custom_domain : d.subdomain_url}</div>
                <div className="flex items-center justify-between">
                  <Badge variant={
                    d.custom_domain_status === "verified" || d.custom_domain_status === "active"
                      ? "default"
                      : d.custom_domain_status === "pending"
                      ? "secondary"
                      : "destructive"
                  }>
                    {d.custom_domain_status.charAt(0).toUpperCase() + d.custom_domain_status.slice(1)}
                  </Badge>
                  {d.custom_domain && d.custom_domain.trim() !== "" && (
                    <Button variant="destructive" size="sm" onClick={() => openDeleteModal(d)}>
                      <Trash className="w-4 h-4" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop: Table Layout */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                {hasCustomDomain && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No domains connected yet.
                  </TableCell>
                </TableRow>
              ) : (
                domains.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono">
                      {d.custom_domain && d.custom_domain.trim() !== "" ? d.custom_domain : d.subdomain_url}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        d.custom_domain_status === "verified" || d.custom_domain_status === "active"
                          ? "default"
                          : d.custom_domain_status === "pending"
                          ? "secondary"
                          : "destructive"
                      }>
                        {d.custom_domain_status.charAt(0).toUpperCase() + d.custom_domain_status.slice(1)}
                      </Badge>
                    </TableCell>
                    {d.custom_domain && d.custom_domain.trim() !== "" && (
                      <TableCell>
                        <Button variant="destructive" size="icon" onClick={() => openDeleteModal(d)}>
                          <Trash className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="bg-muted rounded-xl shadow p-6">
        <h3 className="font-semibold mb-2">DNS Instructions Mapping</h3>
        <p className="text-sm text-muted-foreground mb-6 text-start">
          The following DNS records are required to map your custom domain to your store.
        </p>
        {(status === "pending" || status === "failed") && (
          <div className="flex items-center gap-2 mb-4">
            <svg className="animate-spin h-5 w-5 text-yellow-500" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="text-yellow-600 font-medium">
              Verifying your domain... This may take a few minutes.
            </span>
          </div>
        )}

        {/* Mobile: Card Layout for DNS Records */}
        <div className="flex flex-col gap-3 sm:hidden mt-4">
          {status === "pending" || status === "idle" ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-background rounded p-3 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Type:</span>
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Host:</span>
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Value:</span>
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">TTL:</span>
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))
          ) : dnsRecords.length > 0 ? (
            dnsRecords.map((rec, i) => (
              <div key={i} className="bg-background rounded p-3 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Type:</span>
                  <span>{rec.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Host:</span>
                  <span>{rec.host}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Value:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm break-all">{rec.value}</span>
                    <button
                      type="button"
                      aria-label="Copy DNS value"
                      className="p-1 rounded hover:bg-accent transition"
                      onClick={() => handleCopy(rec.value)}
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">TTL:</span>
                  <span>{rec.ttl ?? "Automatic"}</span>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-background rounded p-3 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Type:</span>
                  <span>A</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Host:</span>
                  <span>@</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Value:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">76.76.21.21</span>
                    <button
                      type="button"
                      aria-label="Copy DNS value"
                      className="p-1 rounded hover:bg-accent transition"
                      onClick={() => handleCopy("76.76.21.21")}
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">TTL:</span>
                  <span>Automatic</span>
                </div>
              </div>
              <div className="bg-background rounded p-3 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Type:</span>
                  <span>CNAME</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Host:</span>
                  <span>www</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Value:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">cname.vercel-dns.com</span>
                    <button
                      type="button"
                      aria-label="Copy DNS value"
                      className="p-1 rounded hover:bg-accent transition"
                      onClick={() => handleCopy("cname.vercel-dns.com")}
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">TTL:</span>
                  <span>Automatic</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Desktop: Table Layout for DNS Records */}
        <div className="hidden sm:block overflow-x-auto mt-4">
          <table className="w-full min-w-[600px] text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-2 font-semibold">Type</th>
                <th className="text-left px-4 py-2 font-semibold">Host name</th>
                <th className="text-left px-4 py-2 font-semibold">Value</th>
                <th className="text-left px-4 py-2 font-semibold">TTL</th>
              </tr>
            </thead>
            <tbody>
              { status === "idle" ? (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-muted-foreground">
                    No DNS instructions yet. Add a domain to get started.
                  </td>
                </tr>
              
              ) : dnsRecords.length > 0 ? (
                dnsRecords.map((rec, i) => (
                  <tr key={i} className="bg-background rounded">
                    <td className="px-4 py-2">{rec.type}</td>
                    <td className="px-4 py-2">{rec.host}</td>
                    <td className="px-4 py-2">
                      <span className="font-mono break-all">{rec.value}</span>
                      <button
                        type="button"
                        aria-label="Copy DNS value"
                        className="ml-2 p-1 rounded hover:bg-accent transition"
                        onClick={() => handleCopy(rec.value)}
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                    <td className="px-4 py-2">{rec.ttl ?? <span className="text-muted-foreground">Automatic</span>}</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="bg-background rounded">
                    <td className="px-4 py-2">A</td>
                    <td className="px-4 py-2">@</td>
                    <td className="px-4 py-2">
                      <span className="font-mono">76.76.21.21</span>
                      <button
                        type="button"
                        aria-label="Copy DNS value"
                        className="ml-2 p-1 rounded hover:bg-accent transition"
                        onClick={() => handleCopy("76.76.21.21")}
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">Automatic</td>
                  </tr>
                  <tr className="bg-background rounded">
                    <td className="px-4 py-2">CNAME</td>
                    <td className="px-4 py-2">www</td>
                    <td className="px-4 py-2">
                      <span className="font-mono">cname.vercel-dns.com</span>
                      <button
                        type="button"
                        aria-label="Copy DNS value"
                        className="ml-2 p-1 rounded hover:bg-accent transition"
                        onClick={() => handleCopy("cname.vercel-dns.com")}
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">Automatic</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {verificationRecords.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-1">Verification Records</h4>
            <ul className="text-xs space-y-1">
              {verificationRecords.map((v, i) => (
                <li key={i} className="bg-background rounded p-2">
                  <b>Type:</b> {v.type} | <b>Domain:</b> {v.domain} | <b>Value:</b> <span className="font-mono">{v.value}</span>
                  {v.reason && <> | <b>Reason:</b> {v.reason}</>}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Status: <b
            className={`capitalize ${
                status === "verified"
                ? "text-green-500"
                : (status === "pending" || status === "idle")
                ? "text-yellow-500"
                : (status === "false")
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
            >
            {status}
            </b>
        </p>
      </div>
      {showDeleteModal && domainToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white dark:bg-background rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h4 className="font-semibold mb-2">Delete Domain</h4>
            <p className="mb-4 text-sm">
              Are you sure you want to delete <span className="font-mono break-all">{domainToDelete.custom_domain || domainToDelete.subdomain_url}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteDomain}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}