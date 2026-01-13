import React from 'react';
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

const LLMConfig = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          {/* <Button variant="outline">Open Dialog</Button> */}
            <Settings />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>LLM配置</DialogTitle>
            <DialogDescription>
              配置大模型API地址、API密钥、模型名称等
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="api-url-1">API URL</Label>
              <Input id="api-url-1" name="api-url" defaultValue="https://api.openai.com/v1" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="api-key-1">API Key</Label>
              <Input id="api-key-1" name="api-key" defaultValue="sk-1234567890abcdef1234567890abcdef" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="model-1">Model</Label>
              <Input id="model-1" name="model" defaultValue="gpt-3.5-turbo" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button type="submit">保存配置</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default LLMConfig;
