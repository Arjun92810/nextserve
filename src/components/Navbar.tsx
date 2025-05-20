'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import ClientOnly from './ClientOnly';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';

export default function Navbar() {
  return (
    <ClientOnly>
      <NavbarContent />
    </ClientOnly>
  );
}

function NavbarContent() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out...');
      // First sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Then call the context signOut to update the UI state
      await signOut();
      
      // Get the current domain
      const domain = window.location.hostname;
      const protocol = window.location.protocol;
      
      // Redirect to the appropriate URL
      if (domain === 'nextserve.club') {
        window.location.href = `${protocol}//${domain}`;
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      // If there's an error, still try to redirect to home
      window.location.href = '/';
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#c5d86d] via-[#b4c455] to-[#93a048] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center bg-white/0 px-3 rounded-lg my-2 hover:bg-white/15 transition-colors duration-300">
              <Image
                src="/brand.png"
                alt="NextServe"
                width={120}
                height={40}
                className="object-contain"
                priority
              />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/partners"
                className={`${
                  isActive('/partners')
                    ? 'border-[#2d321c] text-[#2d321c]'
                    : 'border-transparent text-[#2d321c]/80 hover:border-[#2d321c]/60 hover:text-[#2d321c]'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-300`}
              >
                Members
              </Link>
              <Link
                href="/coach"
                className={`${
                  isActive('/coach')
                    ? 'border-[#2d321c] text-[#2d321c]'
                    : 'border-transparent text-[#2d321c]/80 hover:border-[#2d321c]/60 hover:text-[#2d321c]'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-300`}
              >
                Coach
              </Link>
              <Link
                href="/court"
                className={`${
                  isActive('/court')
                    ? 'border-[#2d321c] text-[#2d321c]'
                    : 'border-transparent text-[#2d321c]/80 hover:border-[#2d321c]/60 hover:text-[#2d321c]'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-300`}
              >
                Court
              </Link>
              <Link
                href="/chat"
                className={`${
                  isActive('/chat')
                    ? 'border-[#2d321c] text-[#2d321c]'
                    : 'border-transparent text-[#2d321c]/80 hover:border-[#2d321c]/60 hover:text-[#2d321c]'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-300`}
              >
                Community
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {loading ? (
              <div className="h-8 w-8 rounded-full bg-[#2d321c]/20 animate-pulse"></div>
            ) : user ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center text-sm font-medium text-[#2d321c] hover:text-[#1a1e11] focus:outline-none">
                  <UserCircleIcon className="h-8 w-8 text-[#2d321c]/90 mr-1" />
                  <span className="mr-1">{user.email?.split('@')[0] || 'User'}</span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg bg-gradient-to-b from-[#c5d86d] to-[#b4c455] ring-1 ring-black/5 focus:outline-none z-10">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/profile"
                          className={`${
                            active ? 'bg-[#93a048]/20' : ''
                          } block px-4 py-2 text-sm text-[#2d321c] cursor-pointer hover:text-[#1a1e11]`}
                        >
                          Your Profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/settings"
                          className={`${
                            active ? 'bg-[#93a048]/20' : ''
                          } block px-4 py-2 text-sm text-[#2d321c] cursor-pointer hover:text-[#1a1e11]`}
                        >
                          Settings
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleSignOut}
                          className={`${
                            active ? 'bg-[#93a048]/20' : ''
                          } block w-full text-left px-4 py-2 text-sm text-[#2d321c] cursor-pointer hover:text-[#1a1e11]`}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[#2d321c]/90 hover:text-[#2d321c] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-[#93a048] text-white hover:bg-[#7a843c] px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#2d321c]/80 hover:text-[#2d321c] hover:bg-[#93a048]/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2d321c]"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-gradient-to-b from-[#c5d86d] to-[#b4c455]">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/partners"
              className={`${
                isActive('/partners')
                  ? 'bg-[#93a048]/20 border-[#2d321c] text-[#2d321c]'
                  : 'border-transparent text-[#2d321c]/80 hover:bg-[#93a048]/20 hover:border-[#2d321c]/60 hover:text-[#2d321c]'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-300`}
            >
              Partner
            </Link>
            <Link
              href="/coach"
              className={`${
                isActive('/coach')
                  ? 'bg-[#93a048]/20 border-[#2d321c] text-[#2d321c]'
                  : 'border-transparent text-[#2d321c]/80 hover:bg-[#93a048]/20 hover:border-[#2d321c]/60 hover:text-[#2d321c]'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-300`}
            >
              Coach
            </Link>
            <Link
              href="/court"
              className={`${
                isActive('/court')
                  ? 'bg-[#93a048]/20 border-[#2d321c] text-[#2d321c]'
                  : 'border-transparent text-[#2d321c]/80 hover:bg-[#93a048]/20 hover:border-[#2d321c]/60 hover:text-[#2d321c]'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-300`}
            >
              Court
            </Link>
            <Link
              href="/chat"
              className={`${
                isActive('/chat')
                  ? 'bg-[#93a048]/20 border-[#2d321c] text-[#2d321c]'
                  : 'border-transparent text-[#2d321c]/80 hover:bg-[#93a048]/20 hover:border-[#2d321c]/60 hover:text-[#2d321c]'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-300`}
            >
              Chat
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-[#93a048]/20">
            {user ? (
              <div className="space-y-1">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-base font-medium text-[#2d321c]/80 hover:text-[#2d321c] hover:bg-[#93a048]/20"
                >
                  Your Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-base font-medium text-[#2d321c]/80 hover:text-[#2d321c] hover:bg-[#93a048]/20"
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-[#2d321c]/80 hover:text-[#2d321c] hover:bg-[#93a048]/20"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-base font-medium text-[#2d321c]/80 hover:text-[#2d321c] hover:bg-[#93a048]/20"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 text-base font-medium text-[#2d321c]/80 hover:text-[#2d321c] hover:bg-[#93a048]/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
