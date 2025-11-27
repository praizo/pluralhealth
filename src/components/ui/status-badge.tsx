import { AppointmentStatus } from '@/lib/types/appointment';
import Image from 'next/image';

interface StatusBadgeProps {
  status: AppointmentStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles = {
    'Processing': 'bg-[#FFF6DB] text-[#D6AB00]',
    'Not arrived': 'bg-[#FFDBDB] text-[#FF2C2C]',
    'Awaiting vitals': 'bg-[#E9CCFF] text-[#A22CFF]',
    'Awaiting doctor': 'bg-[#D0D1FB] text-[#0B0C7D]',
    'Admitted to ward': 'bg-[#FFEFDB] text-[#FF8B00]',
    'Transferred to A&E': 'bg-[#E9CCFF] text-[#A22CFF]',
    'Seen doctor': 'bg-[#E2F8EB] text-[#27AE60]',
  };

  const icons = {
    'Processing': '/images/double-caret-right-circle.svg',
    'Not arrived': '/images/minus-circle.svg',
    'Awaiting vitals': '/images/health-purple.svg',
    'Awaiting doctor': '/images/heart-circle-blue.svg',
    'Admitted to ward': '/images/health-orange.svg',
    'Transferred to A&E': '/images/health-purple.svg',
    'Seen doctor': '/images/tick-circle.svg',
  };

  return (
    <span className={`px-3 py-2 rounded-full font-semibold   text-base leading-[100%] tracking-0 flex items-center justify-between gap-2 max-w-md ${styles[status]}`}>
      {status}
      <Image 
        src={icons[status]} 
        alt={status} 
        width={16} 
        height={16} 
        className="w-4 h-4"
      />
    </span>
  );
};
