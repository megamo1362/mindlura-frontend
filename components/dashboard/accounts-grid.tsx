'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InlineLoader } from '@/components/shared';
import { AccountCard } from './account-card';
import { AddAccountDialog } from './add-account-dialog';
import { useAccounts } from '@/hooks/use-accounts';

export function AccountsGrid() {
  const [addOpen, setAddOpen] = useState(false);
  const { data: accounts, isLoading, isError } = useAccounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)]">حساب‌های MT5</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {accounts?.length
              ? `${accounts.length} حساب متصل`
              : 'هنوز حسابی اضافه نشده'}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 ml-1.5" />
          افزودن حساب
        </Button>
      </div>

      {/* Content */}
      {isLoading && <InlineLoader label="در حال بارگذاری حساب‌ها..." />}

      {isError && (
        <div className="text-center py-16 text-[var(--color-status-error)] text-sm">
          خطا در دریافت اطلاعات. لطفاً صفحه را بازنشانی کنید.
        </div>
      )}

      {!isLoading && !isError && accounts?.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-20 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-elevated)] flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8 text-[var(--color-text-muted)]" />
          </div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
            هنوز حسابی اضافه نکرده‌اید
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] max-w-xs mb-6">
            برای شروع تحلیل رفتار معاملاتی، ابتدا حساب MT5 خود را متصل کنید.
          </p>
          <Button variant="primary" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 ml-1.5" />
            افزودن اولین حساب
          </Button>
        </motion.div>
      )}

      {!isLoading && accounts && accounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((account, i) => (
            <AccountCard key={account.id} account={account} index={i} />
          ))}
        </div>
      )}

      <AddAccountDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
