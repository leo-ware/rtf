import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { handleConvexError, handlePermissionError, handleNotFoundError, handleServerError, handleUnknownError } from "@/lib/errorHandler";

export const useAdminErrorHandler = () => {
    const router = useRouter();
    const handleError = useCallback((error: any, context?: string) => {
        console.error(`Admin Error${context ? ` in ${context}` : ''}:`, error);

        // Authentication errors
        if (error?.message?.includes('not authenticated') || error?.message?.includes('User not found')) {
            router.push('/login');
            return;
        }

        // Permission errors
        if (error?.message?.includes('Insufficient permissions') ||
            error?.message?.includes('permission denied') ||
            error?.message?.includes('access denied') ||
            error?.message?.includes('cannot') ||
            error?.message?.includes('Only dev users') ||
            error?.message?.includes('Admin users cannot')) {

            const action = context || 'perform this action';
            const requiredRole = error?.message?.includes('dev') ? 'dev' : 'admin';

            handlePermissionError(action, 'admin resource', 'current', requiredRole, router);
            return;
        }

        // Not found errors
        if (error?.message?.includes('not found') ||
            error?.message?.includes('does not exist') ||
            error?.status === 404) {
            handleNotFoundError(context || 'resource', undefined, undefined, router);
            return;
        }

        // Server errors
        if (error?.status >= 500 ||
            error?.message?.includes('internal error') ||
            error?.message?.includes('server error') ||
            error?.data?.code === 'INTERNAL_SERVER_ERROR') {
            handleServerError(error, 'CONVEX_ERROR', router);
            return;
        }

        // Validation or business logic errors (show inline)
        if (error?.message?.includes('already exists') ||
            error?.message?.includes('validation') ||
            error?.message?.includes('invalid') ||
            error?.message?.includes('required') ||
            error?.message?.includes('must be')) {
            // These should be handled by the component with inline error messages
            return { inline: true, message: error?.message || 'Validation error' };
        }

        // Unknown errors
        handleUnknownError(error?.message || 'An unexpected error occurred', undefined, router);
    }, [router]);

    const handleAsyncOperation = useCallback(async (
        operation: () => Promise<any>,
        context?: string,
        onSuccess?: (result: any) => void,
        onError?: (error: any) => void
    ) => {
        try {
            const result = await operation();
            if (onSuccess) {
                onSuccess(result);
            }
            return result;
        } catch (error: any) {
            const errorResult = handleError(error, context);

            if (errorResult?.inline && onError) {
                onError(error);
            } else if (errorResult?.inline) {
                // Return error for component to handle
                throw error;
            }
            // For non-inline errors, the error handler will redirect
        }
    }, [handleError]);

    const createErrorHandler = useCallback((context: string) => {
        return (error: any) => handleError(error, context);
    }, [handleError]);

    return {
        handleError,
        handleAsyncOperation,
        createErrorHandler,
    };
};

// Specific error handlers for common operations
export const useArticleErrorHandler = () => {
    const { createErrorHandler } = useAdminErrorHandler();

    return {
        handleCreateError: createErrorHandler('create article'),
        handleUpdateError: createErrorHandler('update article'),
        handleDeleteError: createErrorHandler('delete article'),
        handlePublishError: createErrorHandler('publish article'),
    };
};

export const useUserErrorHandler = () => {
    const { createErrorHandler } = useAdminErrorHandler();

    return {
        handleCreateError: createErrorHandler('create user'),
        handleUpdateError: createErrorHandler('update user role'),
        handleDeleteError: createErrorHandler('delete user'),
    };
};

export const useImageErrorHandler = () => {
    const { createErrorHandler } = useAdminErrorHandler();

    return {
        handleUploadError: createErrorHandler('upload image'),
        handleDeleteError: createErrorHandler('delete image'),
        handleUpdateError: createErrorHandler('update image'),
    };
};

export const useEventErrorHandler = () => {
    const { createErrorHandler } = useAdminErrorHandler();

    return {
        handleCreateError: createErrorHandler('create event'),
        handleUpdateError: createErrorHandler('update event'),
        handleDeleteError: createErrorHandler('delete event'),
    };
};