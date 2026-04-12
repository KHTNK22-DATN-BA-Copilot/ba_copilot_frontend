"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { APIKeyItem, AIProvider, ProviderModelMap } from "@/type/types";
import {
  deleteAPIKey,
  fetchAPIKeys,
  getProviderDisplay,
  providerList,
  providerMeta,
  saveAPIKey,
  statusMeta,
  testAPIConnection,
} from "./utils";

export default function VisibilitySettings() {
  const [keys, setKeys] = useState<APIKeyItem[]>([]);
  const [providers, setProviders] = useState<ProviderModelMap>({
    openai: [],
    anthropic: [],
    gemini: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRevealKey, setIsRevealKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{
    valid: boolean;
    message: string;
    signature: string;
  } | null>(null);
  const [deletingProvider, setDeletingProvider] = useState<AIProvider | null>(null);

  const [formData, setFormData] = useState<{
    provider: AIProvider;
    model: string;
    apiKey: string;
  }>({
    provider: "openai",
    model: "",
    apiKey: "",
  });

  const modelOptions = useMemo(() => {
    return providers[formData.provider] ?? [];
  }, [formData.provider, providers]);

  const formSignature = `${formData.provider}|${formData.model}|${formData.apiKey}`;
  const canSave = !!testResult?.valid && testResult.signature === formSignature;

  const loadKeys = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const result = await fetchAPIKeys();
    if (result.success && result.data) {
      setKeys(result.data.keys);
      setProviders(result.data.providers);

      if (!formData.model) {
        const firstModel = result.data.providers[formData.provider]?.[0] ?? "";
        setFormData((previous) => ({
          ...previous,
          model: firstModel,
        }));
      }
    } else {
      setErrorMessage(result.message || "Failed to load API keys.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadKeys();
  }, []);

  useEffect(() => {
    if (!modelOptions.length) {
      return;
    }

    if (!modelOptions.includes(formData.model)) {
      setFormData((previous) => ({
        ...previous,
        model: modelOptions[0],
      }));
    }
  }, [modelOptions, formData.model]);

  const openModalForProvider = (provider: AIProvider) => {
    const existing = keys.find((item) => item.provider === provider);
    const firstModel = providers[provider]?.[0] ?? "";
    setFormData({
      provider,
      model: existing?.model ?? firstModel,
      apiKey: existing?.rawKey ?? "",
    });
    setTestResult(null);
    setIsRevealKey(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (provider: AIProvider) => {
    setDeletingProvider(provider);
    const result = await deleteAPIKey(provider);
    if (!result.success) {
      setErrorMessage(result.message || "Failed to delete API key.");
    }
    await loadKeys();
    setDeletingProvider(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setErrorMessage("");
    const result = await testAPIConnection(formData);
    if (result.success && result.data) {
      setTestResult({
        valid: result.data.valid,
        message: result.data.message,
        signature: formSignature,
      });
    } else {
      setTestResult({
        valid: false,
        message: result.message || "Connection test failed.",
        signature: formSignature,
      });
    }
    setIsTesting(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage("");
    const result = await saveAPIKey({
      provider: formData.provider,
      model: formData.model,
      apiKey: formData.apiKey,
    });

    if (!result.success) {
      setErrorMessage(result.message || "Failed to save API key.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setIsModalOpen(false);
    setTestResult(null);
    await loadKeys();
  };

  const handleProviderChange = (provider: AIProvider) => {
    const firstModel = providers[provider]?.[0] ?? "";
    setFormData({
      provider,
      model: firstModel,
      apiKey: "",
    });
    setTestResult(null);
  };

  const handleModelChange = (model: string) => {
    setFormData((previous) => ({
      ...previous,
      model,
    }));
    setTestResult(null);
  };

  const handleKeyChange = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      apiKey: value,
    }));
    setTestResult(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Your Configured API Keys
        </h4>
        <Button
          size="sm"
          className="cursor-pointer"
          onClick={() => openModalForProvider("openai")}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Key
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading API keys...
        </div>
      ) : null}

      {!isLoading && !keys.length ? (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          No API key configured yet. Add one provider key to get started.
        </div>
      ) : null}

      {!isLoading && keys.length ? (
        <div className="space-y-2">
          {keys.map((item) => {
            const meta = providerMeta[item.provider];
            const badge = statusMeta[item.status];
            const deleting = deletingProvider === item.provider;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {meta.logo}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {meta.label} - {item.model}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {item.maskedKey}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                  <Badge className={badge.className}>{badge.label}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => openModalForProvider(item.provider)}
                  >
                    Change Model
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-600"
                    onClick={() => handleDelete(item.provider)}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {errorMessage ? (
        <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
      ) : null}

      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={loadKeys} disabled={isLoading}>
          Save Changes
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add or Update an API Key</DialogTitle>
            <DialogDescription>
              Configure and manage your API keys for different AI providers.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select
                value={formData.provider}
                onValueChange={(value) => handleProviderChange(value as AIProvider)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providerList.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-gray-100 text-[10px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          {providerMeta[provider].logo}
                        </span>
                        {providerMeta[provider].label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Model</Label>
              <Select value={formData.model} onValueChange={handleModelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="relative">
                <Input
                  value={formData.apiKey}
                  type={isRevealKey ? "text" : "password"}
                  placeholder="Enter your API key"
                  onChange={(event) => handleKeyChange(event.target.value)}
                  className="pr-9"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                  onClick={() => setIsRevealKey((previous) => !previous)}
                >
                  {isRevealKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <a
                href={providerMeta[formData.provider].keyHelpUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-600 underline underline-offset-2 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Need to get an API key?
              </a>
            </div>
          </div>

          {testResult ? (
            <p
              className={`text-sm ${
                testResult.valid
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {testResult.message}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={handleTestConnection}
              disabled={isTesting || !formData.apiKey || !formData.model}
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4 mr-1" />
                  Test Connection
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !canSave}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Key"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}