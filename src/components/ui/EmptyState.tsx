import { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
    icon?: ReactNode
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            {icon && (
                <div className="mb-4 text-gray-400">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-medium text-gray-900 text-center">
                {title}
            </h3>
            {description && (
                <p className="mt-2 text-sm text-gray-500 text-center max-w-sm">
                    {description}
                </p>
            )}
            {action && (
                <Button onClick={action.onClick} className="mt-4">
                    {action.label}
                </Button>
            )}
        </div>
    )
}

interface LoadingStateProps {
    text?: string
    fullScreen?: boolean
}

export function LoadingState({ text = 'Loading...', fullScreen = false }: LoadingStateProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <p className="text-gray-600">{text}</p>
        </div>
    )

    if (fullScreen) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                {content}
            </div>
        )
    }

    return content
}

interface ErrorStateProps {
    title?: string
    message: string
    onRetry?: () => void
}

export function ErrorState({ 
    title = 'Something went wrong', 
    message, 
    onRetry 
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="mb-4 text-red-500">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center">
                {title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 text-center max-w-sm">
                {message}
            </p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline" className="mt-4">
                    Try Again
                </Button>
            )}
        </div>
    )
}
