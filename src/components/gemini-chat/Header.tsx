import { Trash2, X } from 'lucide-react';

interface HeaderProps {
  onClearChat: () => void;
  onClosePopup: () => void;
}

export function Header({ onClearChat, onClosePopup }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 shadow-sm sm:px-6">
      <div className="flex items-center space-x-3">
        <h1 className="text-lg">
          <span className="font-semibold text-foreground">Stay Attache</span>
        </h1>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={onClearChat}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          aria-label="Clear chat"
        >
          <Trash2 className="h-5 w-5" />
          <span className="sr-only">Clear chat</span>
        </button>
        <button
          onClick={onClosePopup}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close chat</span>
        </button>
      </div>
    </header>
  );
}
