import RecordsRefactored from './components/RecordsRefactored';

export default function AdminRecordsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text))] mb-2">
          Animal Records
        </h1>
        <p className="text-[rgb(var(--color-text-muted))]">
          Manage and organize animal sighting reports into groups representing unique individuals
        </p>
      </div>

      {/* Main Content */}
      <RecordsRefactored />
    </div>
  );
}