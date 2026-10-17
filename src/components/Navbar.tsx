import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import FadeIn from './FadeIn';

export const NAV_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'Experience', to: '/experience' },
  { label: 'Ventures', to: '/ventures' },
];

const linkBase =
  '-my-3 py-3 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-base lg:text-[clamp(1.15rem,1.1vw,2.6rem)]';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu after navigating (including #contact on the same page).
  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <FadeIn
      as="nav"
      immediate
      delay={0}
      y={-20}
      aria-label="Main"
      className="relative z-30 flex items-center justify-end px-6 pt-6 md:px-10 md:pt-8"
    >
      <div className="hidden w-full items-center justify-between md:flex">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${linkBase} ${isActive ? 'underline decoration-2 underline-offset-8' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
        <a href="#contact" className={linkBase}>
          Contact
        </a>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="-m-2 rounded-full p-3 text-[#D7E2EA] md:hidden"
      >
        <Menu size={26} />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#0C0C0C] px-6 pb-10 pt-6"
            >
              <div className="flex items-center justify-end">
                <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="-m-2 rounded-full p-3 text-[#D7E2EA]">
                  <X size={28} />
                </button>
              </div>
              <ul className="mt-12 flex flex-col gap-2">
                {[{ label: 'Home', to: '/' }, ...NAV_LINKS].map((link, i) => (
                  <motion.li key={link.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                    <NavLink
                      to={link.to}
                      end
                      className={({ isActive }) =>
                        `hero-heading block py-1 font-black uppercase leading-none tracking-tight ${isActive ? '' : 'opacity-60'}`
                      }
                      style={{ fontSize: 'clamp(2.2rem, 11vw, 4rem)' }}
                    >
                      {link.label}
                    </NavLink>
                  </motion.li>
                ))}
                <motion.li initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * (NAV_LINKS.length + 1) }}>
                  <a
                    href="#contact"
                    onClick={() => setOpen(false)}
                    className="hero-heading block py-1 font-black uppercase leading-none tracking-tight opacity-60"
                    style={{ fontSize: 'clamp(2.2rem, 11vw, 4rem)' }}
                  >
                    Contact
                  </a>
                </motion.li>
              </ul>
              <p className="mt-auto pt-10 text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-60">
                serhatkumas@outlook.com
              </p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </FadeIn>
  );
}
