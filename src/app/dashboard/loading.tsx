export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-4 w-24 bg-border-subtle rounded-sm" />
        <div className="h-4 w-px bg-border-default"></div>
        <div className="h-4 w-32 bg-border-subtle rounded-sm" />
      </div>

      <header className="space-y-3">
        <div className="h-8 w-64 bg-border-subtle rounded-sm" />
        <div className="h-4 w-96 bg-border-subtle rounded-sm" />
      </header>

      {/* Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Large Main Card */}
        <div className="xl:col-span-2 h-[400px] bg-surface-panel border border-border-subtle rounded-sm" />
        
        {/* Side Stack */}
        <div className="flex flex-col gap-6">
            <div className="h-[180px] bg-surface-panel border border-border-subtle rounded-sm" />
            <div className="h-[180px] bg-surface-panel border border-border-subtle rounded-sm" />
        </div>
      </div>
      
      {/* Footer / Extra Row */}
      <div className="grid gap-6 md:grid-cols-4">
         <div className="h-24 bg-surface-panel border border-border-subtle rounded-sm" />
         <div className="h-24 bg-surface-panel border border-border-subtle rounded-sm" />
         <div className="h-24 bg-surface-panel border border-border-subtle rounded-sm" />
         <div className="h-24 bg-surface-panel border border-border-subtle rounded-sm" />
      </div>
    </div>
  );
}
