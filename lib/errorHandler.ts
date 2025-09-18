import React from "react";
import { NextRouter } from "next/router";

export class AdminError extends Error {
    code: string;
    statusCode: number;
    details?: Record<string, any>;

    constructor(message: string, code: string, statusCode: number, details?: Record<string, any>) {
        super(message);
        this.name = "AdminError";
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }
}

export const createErrorUrl = (
    type: "403" | "404" | "500" | "unknown",
    params: {
        message?: string;
        code?: string;
        id?: string;
        timestamp?: string;
        action?: string;
        resource?: string;
        required?: string;
        current?: string;
        stack?: string;
        suggestion?: string;
    } = {}
) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            searchParams.set(key, value);
        }
    });

    const queryString = searchParams.toString();
    return `/admin/errors/${type}${queryString ? `?${queryString}` : ''}`;
};

export const redirectToError = (
    type: "403" | "404" | "500" | "unknown",
    params: Parameters<typeof createErrorUrl>[1] = {},
    router?: { push: (url: string) => void }
) => {
    const url = createErrorUrl(type, params);
    if (router) {
        router.push(url);
    } else if (typeof window !== 'undefined') {
        window.location.href = url;
    }
};

export const handlePermissionError = (
    action: string,
    resource: string,
    currentRole: string,
    requiredRole: string,
    router?: { push: (url: string) => void }
) => {
    redirectToError("403", {
        message: `Insufficient permissions to ${action}`,
        action,
        resource,
        current: currentRole,
        required: requiredRole,
        timestamp: new Date().toISOString(),
    }, router);
};

export const handleNotFoundError = (
    resourceType: string,
    resourceId?: string,
    suggestion?: string,
    router?: { push: (url: string) => void }
) => {
    redirectToError("404", {
        message: `${resourceType} not found`,
        // type: resourceType.toLowerCase(),
        id: resourceId,
        suggestion,
        timestamp: new Date().toISOString(),
    }, router);
};

export const handleServerError = (
    error: Error,
    code: string = "INTERNAL_SERVER_ERROR",
    router?: { push: (url: string) => void }
) => {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log error for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
        console.error(`[${errorId}] Server Error:`, error);
    }

    redirectToError("500", {
        message: error.message,
        code,
        id: errorId,
        timestamp: new Date().toISOString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, router);
};

export const handleUnknownError = (
    message: string = "An unexpected error occurred",
    details?: Record<string, any>,
    router?: { push: (url: string) => void }
) => {
    const errorId = `UNK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    redirectToError("unknown", {
        message,
        code: "UNKNOWN_ERROR",
        id: errorId,
        timestamp: new Date().toISOString(),
    }, router);
};

// Error boundary helper for React components
export const withErrorBoundary = <P extends object>(Component: React.ComponentType<P>) => {
    return class ErrorBoundaryWrapper extends React.Component<P, { hasError: boolean }> {
        constructor(props: P) {
            super(props);
            this.state = { hasError: false };
        }

        static getDerivedStateFromError(error: Error) {
            return { hasError: true };
        }

        componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
            console.error("Component Error:", error, errorInfo);
            handleUnknownError(error.message, {
                componentStack: errorInfo.componentStack,
                errorBoundary: true,
            });
        }

        render() {
            if (this.state.hasError) {
                return null; // Let the error page handle the display
            }

            return React.createElement(Component, this.props);
        }
    };
};

// Hook for handling async operation errors
export const useErrorHandler = (router?: { push: (url: string) => void }) => {
    const handleAsyncError = (error: any, context?: string) => {
        console.error(`Async Error${context ? ` in ${context}` : ''}:`, error);

        if (error?.message?.includes('permission') || error?.message?.includes('Insufficient')) {
            const action = context || 'perform this action';
            handlePermissionError(action, 'resource', 'current', 'required', router);
        } else if (error?.message?.includes('not found') || error?.status === 404) {
            handleNotFoundError(context || 'resource', undefined, undefined, router);
        } else if (error?.status >= 500) {
            handleServerError(error, 'SERVER_ERROR', router);
        } else {
            handleUnknownError(error?.message || 'An unexpected error occurred', undefined, router);
        }
    };

    return { handleAsyncError };
};

// Convex error handling
export const handleConvexError = (error: any, context?: string, router?: { push: (url: string) => void }) => {
    console.error(`Convex Error${context ? ` in ${context}` : ''}:`, error);

    if (error?.message?.includes('not authenticated')) {
        // Redirect to login instead of error page
        if (router) {
            router.push('/login');
        } else if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        return;
    }

    if (error?.message?.includes('Insufficient permissions') ||
        error?.message?.includes('permission') ||
        error?.message?.includes('access denied')) {
        handlePermissionError(
            context || 'access this resource',
            'admin resource',
            'current',
            'admin',
            router
        );
    } else if (error?.message?.includes('not found')) {
        handleNotFoundError(context || 'resource', undefined, undefined, router);
    } else if (error?.data?.code === 'INTERNAL_SERVER_ERROR' ||
        error?.message?.includes('internal error')) {
        handleServerError(error, 'CONVEX_ERROR', router);
    } else {
        handleUnknownError(error?.message || 'A database operation failed', undefined, router);
    }
};