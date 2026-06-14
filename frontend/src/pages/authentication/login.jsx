import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdLockOutline } from 'react-icons/md'; // Using standard material design icons
import api from '../../api/axios';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { HiOutlineCircleStack } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validationSchema';

function Login() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const response = await api.post('/accounts/login/', data);

            localStorage.setItem(
                import.meta.env.VITE_AUTH_TOKEN_KEY,
                response.data.token,
            );

            toast.success('Login successful');
            navigate('/');
        } catch (error) {
            console.error(error.message);
            toast.error('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-100">
                {/* Header/Logo section echoing the main layout */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-tr from-indigo-500 to-indigo-950 rounded-xl shadow-md shadow-indigo-200 mb-3">
                        <HiOutlineCircleStack className="text-white text-2xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Exalore ERP
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Sign in to manage your system dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email Input Column */}
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MdEmail className="text-slate-400 text-lg" />
                            </div>

                            <Input
                                label="Email Address"
                                icon={MdEmail}
                                type="email"
                                placeholder="admin@example.com"
                                {...register('email')}
                                disabled={loading}
                            />
                        </div>

                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Input Column */}
                    <div>
                        <Input
                            label="Password"
                            icon={MdLockOutline}
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                            disabled={loading}
                        />

                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Button */}
                    <Button type="submit" disabled={loading || isSubmitting}>
                        {loading ? 'Verifying Session...' : 'Login'}
                    </Button>
                </form>

                {/* Footer info snippet matching base dashboard themes */}
                <div className="text-center mt-6 pt-4 border-t border-slate-50">
                    <span className="text-xs text-slate-400">
                        Secure Database Node: admin_ClientDB
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Login;
