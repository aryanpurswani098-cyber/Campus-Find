import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-cf-border overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="pt-2 flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded-full w-20" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    </div>
  </div>
);

export const SkeletonListItem = () => (
  <div className="flex items-center p-4 bg-white border-b border-cf-border animate-pulse">
    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
    <div className="h-8 w-8 bg-gray-200 rounded-full" />
  </div>
);

export const SkeletonStat = () => (
  <div className="bg-white p-6 rounded-xl border border-cf-border shadow-sm animate-pulse flex items-center justify-between">
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-8 bg-gray-200 rounded w-16" />
    </div>
    <div className="w-12 h-12 bg-gray-200 rounded-full" />
  </div>
);

export const SkeletonGrid = ({ count = 6, type = 'card' }: { count?: number, type?: 'card' | 'stat' | 'list' }) => (
  <div className={`grid gap-6 ${type === 'stat' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
    {Array.from({ length: count }).map((_, i) => (
      <React.Fragment key={i}>
        {type === 'card' && <SkeletonCard />}
        {type === 'stat' && <SkeletonStat />}
        {type === 'list' && <SkeletonListItem />}
      </React.Fragment>
    ))}
  </div>
);
