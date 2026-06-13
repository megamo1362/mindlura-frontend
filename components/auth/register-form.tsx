'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Key, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/hooks/use-auth-api';
import { ApiError } from '@/lib/api';

export function RegisterForm() {
  const [fields, setFields] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    invite_code: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate: register, isPending, error } = useRegister();

  const apiError = error instanceof ApiError ? error.message : error ? 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.' : null;
  const displayError = validationError ?? apiError;

  const set = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (fields.password !== fields.confirmPassword) {
      setValidationError('رمز عبور و تأیید آن یکسان نیستند.');
      return;
    }
    if (fields.password.length < 8) {
      setValidationError('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }

    register({
      email: fields.email,
      password: fields.password,
      full_name: fields.full_name || undefined,
      invite_code: fields.invite_code,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Label htmlFor="reg-name">نام (اختیاری)</Label>
        <Input
          id="reg-name"
          type="text"
          value={fields.full_name}
          onChange={set('full_name')}
          placeholder="نام و نام خانوادگی"
          iconLeft={<User className="h-4 w-4" />}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-email">ایمیل</Label>
        <Input
          id="reg-email"
          type="email"
          value={fields.email}
          onChange={set('email')}
          placeholder="user@example.com"
          iconLeft={<Mail className="h-4 w-4" />}
          required
          dir="ltr"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="reg-password">رمز عبور</Label>
          <Input
            id="reg-password"
            type="password"
            value={fields.password}
            onChange={set('password')}
            placeholder="حداقل ۸ کاراکتر"
            iconLeft={<Lock className="h-4 w-4" />}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-confirm">تأیید رمز</Label>
          <Input
            id="reg-confirm"
            type="password"
            value={fields.confirmPassword}
            onChange={set('confirmPassword')}
            placeholder="تأیید رمز عبور"
            iconLeft={<Lock className="h-4 w-4" />}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-invite">کد دعوت</Label>
        <Input
          id="reg-invite"
          type="text"
          value={fields.invite_code}
          onChange={set('invite_code')}
          placeholder="کد دعوت خود را وارد کنید"
          iconLeft={<Key className="h-4 w-4" />}
          required
          dir="ltr"
        />
      </div>

      {displayError && (
        <motion.div
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-[var(--color-status-error)]"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{displayError}</span>
        </motion.div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={isPending}
        disabled={isPending}
      >
        ایجاد حساب کاربری
      </Button>
    </motion.form>
  );
}
