'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Label, TextInput, Button } from 'flowbite-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { toast } from 'react-hot-toast'

const loginSchema = z.object({
    username: z.string().min(1, 'El usuario es requerido'),
    password: z.string().min(1, 'La contraseña es requerida')
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { login, isAuthenticated } = useAuthStore()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    })

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard')
        }
    }, [isAuthenticated, router])

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true)
        try {
            const response = await authAPI.login(data)
            login(response.user, response.access_token)
            toast.success('Inicio de sesión exitoso')
            router.push('/dashboard')
        } catch {
            toast.error('Credenciales inválidas')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-jaguar-50 via-white to-coffee-50 dark:from-dark-950 dark:via-dark-900 dark:to-coffee-950 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full">
                <div className="max-w-md w-full space-y-4">
                    <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <img
                            src="/logo_dorado_sin_nombre.png"
                            alt="JHC INVENTARIOS"
                            className="h-20 w-auto"
                        />
                    </div>
                    <h2 className="text-3xl font-extrabold text-coffee-800 dark:text-jaguar-200">
                        JHC INVENTARIOS
                    </h2>
                    <p className="mt-1 text-base text-coffee-600 dark:text-coffee-300">
                        Sistema de Gestión de Conjuntos
                    </p>
                    <div className="mt-3 bg-jaguar-100 dark:bg-coffee-800/30 rounded-full px-3 py-1 inline-block">
                        <span className="text-sm text-coffee-700 dark:text-jaguar-300 font-medium">
                            Inicia sesión en tu cuenta
                        </span>
                    </div>
                </div>

                    <Card className="bg-white dark:bg-dark-800 border border-jaguar-200 dark:border-coffee-600 shadow-xl">
                    <div className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="username" value="Usuario" className="text-coffee-700 dark:text-jaguar-300 font-medium" />
                                <TextInput
                                    id="username"
                                    type="text"
                                    placeholder="Ingresa tu usuario"
                                    {...register('username')}
                                    className="mt-1 bg-jaguar-50 dark:bg-dark-700 border-jaguar-300 dark:border-coffee-600 focus:border-jaguar-500 focus:ring-jaguar-500"
                                    color={errors.username ? 'failure' : 'gray'}
                                    helperText={errors.username?.message}
                                />
                            </div>

                            <div>
                                <Label htmlFor="password" value="Contraseña" className="text-coffee-700 dark:text-jaguar-300 font-medium" />
                                <div className="relative mt-1">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Ingresa tu contraseña"
                                        {...register('password')}
                                        className="bg-jaguar-50 dark:bg-dark-700 border-jaguar-300 dark:border-coffee-600 focus:border-jaguar-500 focus:ring-jaguar-500 pr-10"
                                        color={errors.password ? 'failure' : 'gray'}
                                        helperText={errors.password?.message}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-coffee-500 hover:text-coffee-700 dark:text-coffee-400 dark:hover:text-jaguar-300"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <HiEyeOff className="h-5 w-5" />
                                        ) : (
                                            <HiEye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-jaguar-400 to-jaguar-500 hover:from-jaguar-500 hover:to-jaguar-600 text-dark-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-dark-900 border-t-transparent mr-2"></div>
                                        Iniciando sesión...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <span className="text-lg mr-2"></span>
                                        Iniciar Sesión
                                    </div>
                                )}
                            </Button>
                        </form>
                    </div>
                    </Card>

                    <div className="text-center bg-white dark:bg-dark-800 rounded-lg p-4 border border-jaguar-200 dark:border-coffee-600 shadow-lg">
                    <h3 className="text-sm font-semibold text-coffee-700 dark:text-jaguar-300 mb-2">
                        🔑 Credenciales de Demo
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-jaguar-50 dark:bg-coffee-800/30 p-2 rounded border border-jaguar-200 dark:border-coffee-600">
                            <p className="font-medium text-coffee-800 dark:text-jaguar-200">Admin</p>
                            <p className="text-coffee-600 dark:text-coffee-300">admin / admin123</p>
                        </div>
                        <div className="bg-jaguar-50 dark:bg-coffee-800/30 p-2 rounded border border-jaguar-200 dark:border-coffee-600">
                            <p className="font-medium text-coffee-800 dark:text-jaguar-200">Vendedor</p>
                            <p className="text-coffee-600 dark:text-coffee-300">vendedor / vendedor123</p>
                        </div>
                        <div className="bg-jaguar-50 dark:bg-coffee-800/30 p-2 rounded border border-jaguar-200 dark:border-coffee-600">
                            <p className="font-medium text-coffee-800 dark:text-jaguar-200">Almacén</p>
                            <p className="text-coffee-600 dark:text-coffee-300">almacen / almacen123</p>
                        </div>
                        <div className="bg-jaguar-50 dark:bg-coffee-800/30 p-2 rounded border border-jaguar-200 dark:border-coffee-600">
                            <p className="font-medium text-coffee-800 dark:text-jaguar-200">Compras</p>
                            <p className="text-coffee-600 dark:text-coffee-300">compras / compras123</p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}