'use client';

import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';

export default function LoginPage() {
  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-blue)] mb-4 shadow-[var(--shadow-glow-cyan)]"
          animate={{ boxShadow: ['var(--shadow-glow-cyan)', '0 0 30px rgba(0,212,255,0.4)', 'var(--shadow-glow-cyan)'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-2xl font-black text-[var(--color-void)]">IR</span>
        </motion.div>

        <h1 className="text-3xl font-black neon-text tracking-widest">IRFX</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          پلتفرم تحلیل رفتار معاملاتی
        </p>
      </div>

      {/* Card */}
      <div className="glass-elevated rounded-2xl p-6 border border-[var(--color-border)]">
        <Tabs defaultValue="login">
          <TabsList variant="pills" className="w-full mb-6">
            <TabsTrigger value="login" className="flex-1">ورود</TabsTrigger>
            <TabsTrigger value="register" className="flex-1">ثبت‌نام</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
        IRFX Trading Psychology Platform
      </p>
    </motion.div>
  );
}
