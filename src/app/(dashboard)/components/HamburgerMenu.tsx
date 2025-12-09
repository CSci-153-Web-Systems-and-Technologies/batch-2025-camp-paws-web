'use client';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function HamburgerMenu({ isOpen, onClick }: HamburgerMenuProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden relative p-2 rounded-md text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-background))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-colors"
      aria-label="Toggle navigation menu"
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <span
          className={`block h-0.5 w-6 bg-current transform transition-transform duration-300 ${
            isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-current transform transition-opacity duration-300 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-current transform transition-transform duration-300 ${
            isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
          }`}
        />
      </div>
    </button>
  );
}