'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'bash' }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = React.useState(false);
  const { toast } = useToast();

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "The code has been copied successfully.",
    });
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <div className="relative my-4 font-code rounded-md bg-gray-800 text-gray-200">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <span className="text-xs font-semibold text-gray-400">{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:bg-gray-700 hover:text-white"
          onClick={onCopy}
        >
          {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
