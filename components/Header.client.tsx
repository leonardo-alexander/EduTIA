"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverBackdrop,
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
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { getCurrentUser } from "@/lib/auth";
import { CategoryUI } from "@/types/category.ui";
import { logoutAction } from "@/actions/auth";

type HeaderProps = {
  user: Awaited<ReturnType<typeof getCurrentUser>>;
  categories: CategoryUI[];
};

export default function HeaderClient({ user, categories }: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchFromUrl = searchParams.get("search") ?? "";

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState(searchFromUrl);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setQuery(searchFromUrl);
  }, [searchFromUrl]);

  if (!mounted) return null;

  const categoriesUI = (categories ?? []).map((c: CategoryUI) => ({
    id: c.id,
    name: c.name,
    href: `/courses?category=${c.slug}`,
  }));

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("search", query);
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <header
      className={`top-0 z-50 bg-white border-b border-gray-300 transition-all`}
    >
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link href={"/dashboard"}>
            <img
              alt="EduTIA Logo"
              src="/logo/blue.svg"
              className="h-6 w-auto"
            />
          </Link>
        </div>

        <div className="flex lg:hidden gap-5">
          <MagnifyingGlassIcon className="size-6" aria-label="Search" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-10 items-center">
          <Popover className="relative">
            {({ close }) => (
              <>
                <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 focus:outline-none">
                  Courses
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="size-5 flex-none text-gray-400"
                  />
                </PopoverButton>

                <PopoverBackdrop className="fixed inset-0 z-30" />

                <PopoverPanel
                  transition
                  className="absolute left-1/2 z-50 mt-3 w-70 max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                >
                  <div className="p-2">
                    <Link
                      href="/courses"
                      onClick={() => close()}
                      className="group flex items-center gap-x-6 rounded-lg p-4 text-sm hover:bg-gray-50"
                    >
                      <span className="font-semibold text-gray-900">All</span>
                    </Link>

                    {categoriesUI.map((category) => (
                      <Link
                        key={category.id}
                        href={category.href}
                        onClick={() => close()}
                        className="group flex items-center gap-x-6 rounded-lg p-4 text-sm hover:bg-gray-50"
                      >
                        <span className="font-semibold text-gray-900">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </PopoverPanel>
              </>
            )}
          </Popover>

          <div className="flex items-center w-64 rounded-full p-1.5 border border-gray-200">
            <MagnifyingGlassIcon className="size-5 text-gray-900 ml-2" />
            <form onSubmit={handleSearch} className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="ml-2 w-full bg-transparent outline-none text-sm text-gray-900"
              />
            </form>
          </div>
        </PopoverGroup>

        <div className="hidden lg:flex lg:flex-2 lg:justify-end">
          <div className="flex items-center gap-x-8">
            <a
              href={"/dashboard"}
              className="text-sm font-semibold text-gray-900"
            >
              Dashboard
            </a>
            <a href="/path" className="text-sm font-semibold text-gray-900">
              Learning Paths
            </a>
            <a href="/jobs" className="text-sm font-semibold text-gray-900">
              Apply Jobs
            </a>
            <div className="min-w-10 flex items-center justify-end">
              {!user && (
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-900 whitespace-nowrap"
                >
                  Log in →
                </Link>
              )}

              {user && (
                <Menu as="div" className="relative">
                  <MenuButton className="relative flex items-center rounded-full focus:outline-none">
                    <img
                      src={user.profile?.pictureUrl || "/avatars/male.svg"}
                      className="size-8 rounded-full"
                      alt="Avatar"
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 z-40 mt-2 w-48 rounded-lg bg-white overflow-hidden focus:outline-none">
                    <MenuItem>
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 transition"
                      >
                        Profile
                      </Link>
                    </MenuItem>

                    <MenuItem>
                      <button
                        type="button"
                        onClick={async () => {
                          await logoutAction();
                          window.location.href = "/";
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 transition"
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

      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50 bg-black/30" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href={"/dashboard"} className="-m-1.5 p-1.5">
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
                    {categoriesUI.map((category) => (
                      <DisclosureButton
                        key={category.id}
                        as={Link}
                        href={category.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {category.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <a
                  href={"/dashboard"}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Dashboard
                </a>
                <a
                  href="/path"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Learning Paths
                </a>
                <a
                  href="/jobs"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Apply Jobs
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
                  type="button"
                  onClick={async () => {
                    await logoutAction();
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
