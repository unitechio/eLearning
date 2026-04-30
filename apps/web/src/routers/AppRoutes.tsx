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
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-transparent">
          <div className="h-full w-1/3 animate-pulse rounded-r-full bg-primary/70"></div>
        </div>
      }
    >
      {element}
    </Suspense>
  );
}
