'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on the server
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="relative" suppressHydrationWarning>
        <Monitor className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">主题切换</span>
      </Button>
    );
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        );
      case 'dark':
        return (
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
        );
      case 'system':
      default:
        return (
          <Monitor className="h-[1.2rem] w-[1.2rem] transition-all duration-300 theme-icon" />
        );
    }
  };

  const getThemeLabel = (themeValue: string) => {
    switch (themeValue) {
      case 'light':
        return '浅色主题';
      case 'dark':
        return '深色主题';
      case 'system':
      default:
        return '跟随系统';
    }
  };

  const getCurrentThemeDescription = () => {
    if (theme === 'system') {
      return `跟随系统 (当前: ${currentTheme === 'dark' ? '深色' : '浅色'})`;
    }
    return getThemeLabel(theme || 'system');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label={`当前主题: ${getCurrentThemeDescription()}. 点击切换主题`}
        >
          {getIcon()}
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>浅色主题</span>
          </div>
          {theme === 'light' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>深色主题</span>
          </div>
          {theme === 'dark' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>跟随系统</span>
          </div>
          {theme === 'system' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
