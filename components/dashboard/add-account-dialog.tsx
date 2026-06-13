'use client';

import { useState } from 'react';
import { Plus, Hash, Lock, Server, Tag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useAddAccount } from '@/hooks/use-accounts';
import { ApiError } from '@/lib/api';

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY = { login: '', investor_password: '', server: '', label: '' };

export function AddAccountDialog({ open, onOpenChange }: AddAccountDialogProps) {
  const [fields, setFields] = useState(EMPTY);
  const { mutate: addAccount, isPending, error, reset } = useAddAccount();

  const apiError = error instanceof ApiError ? error.message : error ? 'خطا در افزودن حساب.' : null;

  const set = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleOpenChange = (next: boolean) => {
    if (!next) { setFields(EMPTY); reset(); }
    onOpenChange(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount(
      {
        login: fields.login,
        investor_password: fields.investor_password,
        server: fields.server,
        label: fields.label || undefined,
      },
      { onSuccess: () => handleOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن حساب MT5</DialogTitle>
          <DialogDescription>
            اطلاعات حساب MetaTrader 5 خود را وارد کنید. فقط به پسورد سرمایه‌گذار (read-only) نیاز داریم.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="acc-login">شماره حساب</Label>
            <Input
              id="acc-login"
              type="text"
              value={fields.login}
              onChange={set('login')}
              placeholder="12345678"
              iconLeft={<Hash className="h-4 w-4" />}
              required
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acc-password">پسورد سرمایه‌گذار</Label>
            <Input
              id="acc-password"
              type="password"
              value={fields.investor_password}
              onChange={set('investor_password')}
              placeholder="investor password"
              iconLeft={<Lock className="h-4 w-4" />}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acc-server">سرور</Label>
            <Input
              id="acc-server"
              type="text"
              value={fields.server}
              onChange={set('server')}
              placeholder="ICMarkets-MT5"
              iconLeft={<Server className="h-4 w-4" />}
              required
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acc-label">
              برچسب{' '}
              <span className="text-xs text-[var(--color-text-muted)]">(اختیاری)</span>
            </Label>
            <Input
              id="acc-label"
              type="text"
              value={fields.label}
              onChange={set('label')}
              placeholder="مثال: حساب اصلی"
              iconLeft={<Tag className="h-4 w-4" />}
            />
          </div>

          {apiError && (
            <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-[var(--color-status-error)]">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" size="sm" type="button">انصراف</Button>
            </DialogClose>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              loading={isPending}
              disabled={isPending}
            >
              <Plus className="h-4 w-4 ml-1" />
              افزودن حساب
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
