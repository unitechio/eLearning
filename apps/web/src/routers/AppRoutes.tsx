import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './routeConfig';

/**
 * AppRoutes component using useRoutes hook for route management.
 * Wraps everything in Suspense for lazy loading support.
 */
export function AppRoutes() {
  const element = useRoutes(routes);

  return (
    <Suspense 
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-slate-50 text-primary font-bold">
          Lumina Academy...
        </div>
      }
    >
      {element}
    </Suspense>
  );
}
