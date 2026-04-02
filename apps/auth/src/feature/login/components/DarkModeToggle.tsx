'use client';
import { Icon } from 'zap-design/src/genesis/atoms/icons/Icon';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import type { Theme } from '@/const';

interface Props {
  theme: Theme;
  onToggle: () => void;
  label: string;
}

export function DarkModeToggle({ theme, onToggle, label }: Props) {
  return (
    <Button variant="ghost" size="sm" onClick={onToggle} className="flex items-center gap-2">
      <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={16} />
      <span className="text-xs">{label}</span>
    </Button>
  );
}
