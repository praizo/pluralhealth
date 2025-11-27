import Image from 'next/image';
import { useState } from 'react';

interface AppointmentControlsProps {
  clinics: string[];
  selectedClinic: string;
  onClinicChange: (clinic: string) => void;
  sortOrder: 'newest' | 'oldest';
  onSortChange: (order: 'newest' | 'oldest') => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
  totalCount: number;
}

export function AppointmentControls({
  clinics,
  selectedClinic,
  onClinicChange,
  sortOrder,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalCount,
}: AppointmentControlsProps) {
  const [isClinicDropdownOpen, setIsClinicDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  return (
    <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
        <p className="txt-secondary font-semibold">Appointments</p>

        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
          {/* Clinic Filter */}
          <div className="relative">
            <button
              onClick={() => setIsClinicDropdownOpen(!isClinicDropdownOpen)}
              className="flex items-center gap-2 txt-secondary cursor-pointer hover:text-gray-900"
            >
              {selectedClinic}
              <Image src="/images/right-small.svg" alt="Right small icon" width={16} height={16} className={`transition-transform ${isClinicDropdownOpen ? 'rotate-90' : ''}`} />
            </button>

            {isClinicDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsClinicDropdownOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 max-h-60 overflow-y-auto">
                  {clinics.map((clinic) => (
                    <button
                      key={clinic}
                      onClick={() => {
                        onClinicChange(clinic);
                        onPageChange(1);
                        setIsClinicDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedClinic === clinic ? 'text-[#0B0C7D] font-medium bg-blue-50' : 'text-gray-600'}`}
                    >
                      {clinic}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center gap-2 txt-secondary text-[#0B0C7D] cursor-pointer"
            >
              <Image src="/images/sort-down.svg" alt="Sort down icon" width={16} height={16} />
              Sort by: {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </button>

            {isSortDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsSortDropdownOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1">
                  <button
                    onClick={() => {
                      onSortChange('newest');
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortOrder === 'newest' ? 'text-[#0B0C7D] font-medium bg-blue-50' : 'text-gray-600'}`}
                  >
                    Newest first
                  </button>
                  <button
                    onClick={() => {
                      onSortChange('oldest');
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortOrder === 'oldest' ? 'text-[#0B0C7D] font-medium bg-blue-50' : 'text-gray-600'}`}
                  >
                    Oldest first
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between w-full md:w-auto gap-4 mt-4 md:mt-0">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>
            {totalCount === 0 ? '0' : `${startIndex + 1} - ${Math.min(endIndex, totalCount)}`} of {totalCount}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous page"
            >
              <Image src="/images/chevron-left-small.svg" alt="Previous" width={16} height={16} />
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next page"
            >
              <Image src="/images/chevron-right-small.svg" alt="Next" width={16} height={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
