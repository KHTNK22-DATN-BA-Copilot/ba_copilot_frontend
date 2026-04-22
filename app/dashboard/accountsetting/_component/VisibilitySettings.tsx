"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
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
  changeAPIModel,
  deleteAPIKey,
  fetchAPIKeys,
  getProviderDisplay,
  providerMeta,
  saveAPIKey,
  statusMeta,
} from "./utils";

export default function VisibilitySettings({ providers }: { providers: ProviderModelMap }) {
  const [keys, setKeys] = useState<APIKeyItem[]>([]);
  const [availableProviders, setAvailableProviders] = useState<ProviderModelMap>(providers);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRevealKey, setIsRevealKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingProvider, setDeletingProvider] = useState<AIProvider | null>(null);

  const [formData, setFormData] = useState<{
    provider: AIProvider;
    model: string;
    apiKey: string;
  }>({
    provider: Object.keys(providers)[0] as AIProvider,
    model: "",
    apiKey: "",
  });

  const modelOptions = useMemo(() => {
    return availableProviders[formData.provider] ?? [];
  }, [availableProviders, formData.provider]);

  useEffect(() => {
    setAvailableProviders(providers);
  }, [providers]);

  const existingKey = useMemo(
    () => keys.find((item) => item.provider === formData.provider),
    [formData.provider, keys],
  );


  const loadKeys = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const result = await fetchAPIKeys();
    console.log(result)
    if (result.success && result.data) {
      setKeys(result.data.keys);

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
    const firstModel = availableProviders[provider]?.[0] ?? "";
    setFormData({
      provider,
      model: existing?.model ?? firstModel,
      apiKey: "",
    });
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


  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage("");

    const existing = keys.find((item) => item.provider === formData.provider);
    const trimmedApiKey = formData.apiKey.trim();

    if (!trimmedApiKey && existing) {
      if (existing.model !== formData.model) {
        const result = await changeAPIModel(formData.provider, { model: formData.model });
        if (!result.success) {
          setErrorMessage(result.message || "Failed to change model.");
          setIsSaving(false);
          return;
        }
      }
    } else {
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
    }

    setIsSaving(false);
    setIsModalOpen(false);
    await loadKeys();
  };

  const handleProviderChange = (provider: AIProvider) => {
    const firstModel = availableProviders[provider]?.[0] ?? "";
    setFormData({
      provider,
      model: firstModel,
      apiKey: "",
    });
  };

  const handleModelChange = (model: string) => {
    setFormData((previous) => ({
      ...previous,
      model,
    }));
  };

  const handleKeyChange = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      apiKey: value,
    }));
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
            const providerLabel = item.provider

            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
            
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {providerLabel} - {item.model}
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
          Refresh
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
                  {Object.keys(availableProviders).map((provider) => {

                    return (
                      <SelectItem key={provider} value={provider}>
                        <span className="inline-flex items-center gap-2">
                          {provider}
                          {/* <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            {models?.length} models
                          </span> */}
                        </span>
                      </SelectItem>
                    );
                  })}
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
              {/* <a
                href={providerMeta[formData.provider].keyHelpUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-600 underline underline-offset-2 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Need to get an API key?
              </a> */}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !formData.model || (!formData.apiKey.trim() && !existingKey)}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Saving...
                </>
              ) : existingKey && !formData.apiKey.trim() ? (
                "Update Model"
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