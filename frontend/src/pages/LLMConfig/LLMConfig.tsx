import React, { useState, useEffect } from 'react';
import styles from './LLMConfig.module.scss';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings } from 'lucide-react';
import { LLMConfigRequest } from '@/lib/api';

const LLM_CONFIG_KEY = 'llm_config';

const LLMConfig = () => {
  const [formData, setFormData] = useState<LLMConfigRequest>({
    apiUrl: 'https://api.openai.com/v1',
    apiKey: 'sk-1234567890abcdef1234567890abcdef',
    model: 'gpt-3.5-turbo'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem(LLM_CONFIG_KEY);
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setFormData(prev => ({
          ...prev,
          ...parsedConfig
        }));
      } catch (error) {
        console.error('解析LLM配置失败:', error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      localStorage.setItem(LLM_CONFIG_KEY, JSON.stringify(formData));

      setSuccess(true);
      console.log('LLM配置保存成功');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
      console.error('保存LLM配置失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Settings />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>LLM配置</DialogTitle>
            <DialogDescription>
              配置大模型API地址、API密钥、模型名称等
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md mb-4">
              配置保存成功
            </div>
          )}
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="api-url-1">API URL</Label>
              <Input
                id="api-url-1"
                name="apiUrl"
                value={formData.apiUrl}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="api-key-1">API Key</Label>
              <Input
                id="api-key-1"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="model-1">Model</Label>
              <Input
                id="model-1"
                name="model"
                value={formData.model}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '保存中...' : '保存配置'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default LLMConfig;
