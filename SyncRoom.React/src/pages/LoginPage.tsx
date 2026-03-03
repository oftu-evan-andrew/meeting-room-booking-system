import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Building2, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

interface LoginPageProps {
  onSubmit: (data: { username: string; password: string }) => void;
  loading?: boolean;
  error?: string | null;
}

export function LoginPage({ onSubmit, loading, error }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">

      {/* Left — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,white 39px,white 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,white 39px,white 40px)' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold-400/5 blur-3xl pointer-events-none" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-semibold text-white">SyncRoom</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <h1 className="font-display text-5xl font-semibold text-white leading-tight mb-6">
            Your workspace,<br />
            <span className="text-gold-400">perfectly synced.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            Reserve meeting rooms and keep your team aligned — all from one place.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-3 gap-4">
          {[
            { value: '50+', label: 'Rooms Available' },
            { value: '< 30s', label: 'Avg. Booking Time' },
            { value: '99.9%', label: 'Uptime SLA' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="font-display text-2xl font-semibold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-semibold text-white">SyncRoom</span>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-modal">
            <div className="mb-7">
              <h2 className="font-display text-2xl font-semibold text-slate-900">Sign in</h2>
              <p className="text-sm text-slate-500 mt-1">Enter your credentials to access the workspace.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Username"
                placeholder="e.g. j.smith"
                autoComplete="username"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.username?.message}
                {...register('username')}
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                rightElement={
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register('password')}
              />

              {error && (
                <div className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
                Sign In
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold-600 font-medium hover:text-gold-700 transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
