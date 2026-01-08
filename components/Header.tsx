"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  FilmIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const categories = [
  {
    name: "Category 1",
    description: "Cat 1 desc",
    href: "#",
    icon: FilmIcon,
  },
];

type User = {
  userId: string;
  email: string;
  role: string;
  imageUrl?: string;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
  }, []);

  return (
    <header className="sticky top-0 w-full shadow-md bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="#">
            <img
              alt="EduTIA Logo"
              src="/logo/blue.svg"
              className="h-6 w-auto"
            />
          </a>
        </div>

        {/* Mobile Button */}
        <div className="flex lg:hidden gap-5">
          <MagnifyingGlassIcon className="size-6" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-10 items-center">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
              Category
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 flex-none text-gray-400"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="p-4">
                {categories.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="size-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <div className="flex-auto">
                      <a
                        href={item.href}
                        className="block font-semibold text-gray-900"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          {/* Search Bar */}
          <div className="flex items-center w-2xs rounded-4xl p-1.5 border">
            <MagnifyingGlassIcon className="size-5 text-gray-900" />
            {/* text box */}
          </div>
        </PopoverGroup>

        <div className="hidden lg:flex lg:flex-2 lg:justify-end">
          <div className="flex items-center gap-x-8">
            <a href="#" className="text-sm font-semibold text-gray-900">
              Learning Paths
            </a>
            <a href="#" className="text-sm font-semibold text-gray-900">
              Apply Jobs
            </a>
            <a href="#" className="text-sm font-semibold text-gray-900">
              About
            </a>
            <div className="min-w-10 flex items-center justify-end">
              {loadingUser && (
                <div className="size-8 rounded-full bg-gray-200 animate-pulse" />
              )}

              {!loadingUser && !user && (
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-900 whitespace-nowrap"
                >
                  Log in →
                </Link>
              )}

              {!loadingUser && user && (
                <Menu as="div" className="relative">
                  <MenuButton className="relative flex items-center rounded-full">
                    <img
                      src={user.imageUrl || "/avatars/male.svg"}
                      className="size-8 rounded-full"
                      alt="Avatar"
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white">
                    <MenuItem>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-black"
                      >
                        Profile
                      </Link>
                    </MenuItem>

                    <MenuItem>
                      <button
                        onClick={async () => {
                          setLoadingUser(true);
                          await fetch("/api/auth/logout", {
                            method: "POST",
                            credentials: "include",
                          });
                          window.location.href = "/";
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-black"
                      >
                        Logout
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <img
                alt="EduTIA Logo"
                src="/logo/blue.svg"
                className="h-6 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/40">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    Category
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 flex-none group-data-open:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...categories].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Learning Paths
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Apply Jobs
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  About
                </a>
              </div>
              <div className="py-6">
                <Link
                  href="/profile"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Profile
                </Link>
                <button
                  onClick={async () => {
                    setLoadingUser(true);
                    await fetch("/api/auth/logout", {
                      method: "POST",
                      credentials: "include",
                    });
                    window.location.href = "/";
                  }}
                  className="w-full text-left -mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
