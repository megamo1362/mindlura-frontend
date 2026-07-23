'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, CheckCircle2, ExternalLink, Wallet } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { OtpInput } from '@/components/ui/otp-input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { useLang } from '@/app/i18n/LangContext';
import { useWalletAddresses, useUpdateWalletAddress } from '@/hooks/use-payment';

type TelegramStep = 'idle' | 'linking' | 'otp_input';

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 2 * 60 * 1000;

interface TelegramStatus {
  connected: boolean;
  telegram_id: string | null;
  code_linked: boolean;
}

export default function AdminSettingsPage() {
  const { t } = useLang();

  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [telegramId, setTelegramId] = useState<string | null>(null);

  const [step, setStep] = useState<TelegramStep>('idle');
  const [botUrl, setBotUrl] = useState('');
  const [code, setCode] = useState('');
  const [generating, setGenerating] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollDeadline = useRef<number>(0);

  const stopPolling = () => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
    setPolling(false);
  };

  useEffect(() => {
    apiFetch<TelegramStatus>('/admin/telegram/status')
      .then(data => {
        setConnected(data.connected);
        setTelegramId(data.telegram_id);
      })
      .finally(() => setLoading(false));

    return () => stopPolling();
  }, []);

  const requestOtp = async () => {
    setError('');
    try {
      await apiFetch('/admin/telegram/send-otp-via-bot', { method: 'POST' });
      stopPolling();
      setStep('otp_input');
    } catch {
      // webhook hasn't linked telegram_id yet — keep polling
    }
  };

  const startPolling = () => {
    setTimedOut(false);
    setPolling(true);
    pollDeadline.current = Date.now() + POLL_TIMEOUT_MS;
    pollTimer.current = setInterval(async () => {
      if (Date.now() > pollDeadline.current) {
        stopPolling();
        setTimedOut(true);
        return;
      }
      try {
        const status = await apiFetch<TelegramStatus>('/admin/telegram/status');
        if (status.code_linked) {
          await requestOtp();
        }
      } catch {
        // ignore transient errors, keep polling
      }
    }, POLL_INTERVAL_MS);
  };

  const connectTelegram = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await apiFetch<{ code: string; bot_url: string }>('/admin/telegram/generate-code', { method: 'POST' });
      setCode(res.code);
      setBotUrl(res.bot_url);
      setStep('linking');
      startPolling();
    } catch {
      // ignore
    } finally {
      setGenerating(false);
    }
  };

  const retryConnect = () => {
    setStep('idle');
    setTimedOut(false);
    setError('');
  };

  const verifyOtp = async (otp: string) => {
    setVerifying(true);
    setError('');
    try {
      const res = await apiFetch<{ success: boolean; telegram_id: string }>('/admin/telegram/verify', { method: 'POST', body: { otp } });
      setConnected(true);
      setTelegramId(res.telegram_id ?? null);
      setStep('idle');
    } catch (err) {
      setError(err instanceof ApiError && err.status === 400 ? t.profile_otp_invalid : t.profile_otp_error);
    } finally {
      setVerifying(false);
    }
  };

  const confirmDisconnect = async () => {
    setDisconnecting(true);
    try {
      await apiFetch('/admin/telegram/disconnect', { method: 'POST' });
      setConnected(false);
      setTelegramId(null);
      setStep('idle');
      setDisconnectOpen(false);
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="skeleton h-64 max-w-xl rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t.admin_settings_title}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.admin_settings_sub}</p>
      </div>

      <section className="rounded-[var(--radius-lg)] bg-[var(--color-glass)] p-5 border border-[var(--color-border)] space-y-4 max-w-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-[var(--color-cyan)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">
              {t.admin_settings_telegram_title}
            </h2>
          </div>
          {connected && (
            <Badge variant="green" dot>
              <CheckCircle2 className="w-3 h-3" />
              {t.admin_settings_telegram_connected}
            </Badge>
          )}
        </div>

        {connected ? (
          <div className="space-y-3">
            <p className="text-xs text-[var(--color-text-muted)]">{t.admin_settings_telegram_connected_desc}</p>
            <div className="rounded-xl bg-[var(--color-success-dim-weak)] border border-[var(--color-success-glow)] px-4 py-3 space-y-1">
              <p className="text-[10px] text-[var(--color-text-muted)]">{t.admin_settings_telegram_id_label}</p>
              <p className="text-sm text-[var(--color-text-primary)] font-mono">{telegramId}</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setDisconnectOpen(true)}>
              {t.admin_settings_telegram_disconnect}
            </Button>
          </div>
        ) : step === 'idle' ? (
          <div className="space-y-2">
            <p className="text-xs text-[var(--color-text-muted)]">{t.admin_settings_telegram_desc}</p>
            <Button variant="outline" size="sm" loading={generating} onClick={connectTelegram}>
              <Send className="w-3.5 h-3.5" />
              {t.admin_settings_telegram_connect_btn}
            </Button>
            {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
          </div>
        ) : step === 'linking' ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-cyan-dim-weak)] p-4 space-y-4">
            <div className="rounded-xl bg-[var(--color-cyan-dim)] border border-[var(--color-cyan-glow)] px-4 py-3 text-center">
              <p className="text-[10px] text-[var(--color-text-muted)] mb-1">
                {t.admin_settings_telegram_step_open}
              </p>
              <p className="text-2xl font-mono font-bold tracking-[0.3em] text-[var(--color-cyan)]">{code}</p>
            </div>

            <ol className="space-y-2.5">
              {[t.admin_settings_telegram_step_open, t.admin_settings_telegram_step_start].map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--color-text-muted)]">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${i === 0 ? 'bg-[var(--color-cyan)] text-black' : 'bg-[var(--color-cyan-glow)] text-[var(--color-cyan)]'}`}>
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>

            <a
              href={botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-blue-dim)] border border-[var(--color-blue-light)] text-xs font-medium text-[var(--color-cyan)] hover:bg-[var(--color-cyan-dim)] transition-colors"
            >
              <Send className="w-3 h-3" />
              {t.admin_settings_telegram_open_bot}
              <ExternalLink className="w-3 h-3" />
            </a>

            {polling && !timedOut && (
              <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-cyan)] animate-pulse" />
                {t.admin_settings_telegram_waiting}
              </p>
            )}

            {timedOut && (
              <div className="space-y-2">
                <p className="text-xs text-[var(--color-danger)]">{t.admin_settings_telegram_timeout}</p>
                <Button variant="outline" size="sm" onClick={retryConnect}>
                  {t.admin_settings_telegram_try_again}
                </Button>
              </div>
            )}

            {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}

            <button
              type="button"
              onClick={() => { stopPolling(); setStep('idle'); setError(''); }}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] underline"
            >
              {t.admin_settings_telegram_start_over}
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-cyan-dim-weak)] p-4 space-y-3">
            <p className="text-xs text-[var(--color-cyan)]">{t.admin_settings_telegram_otp_sent}</p>
            <OtpInput onComplete={verifyOtp} disabled={verifying} error={!!error} />
            {error && <p className="text-xs text-[var(--color-danger)] text-center">{error}</p>}
            <button
              type="button"
              onClick={() => { setStep('idle'); setError(''); }}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] underline"
            >
              {t.admin_settings_telegram_start_over}
            </button>
          </div>
        )}
      </section>

      <WalletAddressesSection />

      <Dialog open={disconnectOpen} onOpenChange={setDisconnectOpen}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>{t.admin_settings_telegram_disconnect_confirm_title}</DialogTitle></DialogHeader>
          <p className="text-sm text-[var(--color-text-secondary)]">{t.admin_settings_telegram_disconnect_confirm_body}</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDisconnectOpen(false)}>{t.cancel}</Button>
            <Button variant="danger" onClick={confirmDisconnect} loading={disconnecting}>
              {t.admin_settings_telegram_disconnect}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WalletAddressesSection() {
  const { t } = useLang();
  const { data: wallets = [], isLoading } = useWalletAddresses();
  const updateWallet = useUpdateWalletAddress();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const addressFor = (network: string, current: string) => drafts[network] ?? current;

  const save = (network: string, current: string, isActive: boolean) => {
    const address = drafts[network] ?? current;
    updateWallet.mutate({ network, data: { address, is_active: isActive } });
  };

  return (
    <section className="rounded-[var(--radius-lg)] bg-[var(--color-glass)] p-5 border border-[var(--color-border)] space-y-4 max-w-xl">
      <div className="flex items-center gap-2">
        <Wallet className="w-4 h-4 text-[var(--color-cyan)]" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">
          {t.admin_wallet_title}
        </h2>
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">{t.admin_wallet_desc}</p>

      {isLoading ? (
        <div className="space-y-2">{[...Array(2)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-4">
          {wallets.map((w) => (
            <div key={w.network} className="rounded-xl border border-[var(--color-border)] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text-primary)]">{w.network}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-text-muted)]">{t.admin_wallet_active_label}</span>
                  <Switch
                    checked={w.is_active}
                    onCheckedChange={(v) => save(w.network, addressFor(w.network, w.address), v)}
                  />
                </div>
              </div>
              <Input
                label={t.admin_wallet_address_label}
                value={addressFor(w.network, w.address)}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [w.network]: e.target.value }))}
                className="font-mono"
              />
              <Button
                variant="secondary"
                size="sm"
                loading={updateWallet.isPending}
                onClick={() => save(w.network, addressFor(w.network, w.address), w.is_active)}
              >
                {t.admin_wallet_save_btn}
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
