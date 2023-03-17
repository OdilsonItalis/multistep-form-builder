import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import { changePublicProfileTabState } from '@/utils/features/tabStateSlice';
import { toast } from 'react-hot-toast';
import { useUser } from '@/utils/useUser';
import { changeAuthModalStatus } from '@/utils/features/modalStateSlice';
import { useRouter } from 'next/router';

const navigation = [
  { name: 'Portfolio', href: '#' },
  { name: 'Pricing', href: '#' },
  { name: 'Reviews', href: '#' }
];

export default function TopMenuNavigation() {
  const { user } = useUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();

  const currentPageIndex = useAppSelector(
    (state) => state.tabState.publicProfileTabState
  );

  console.log(currentPageIndex);

  // if user is not logged in, then show the login modal, then if he just visited this link, then redirect him to diary page
  const handleButtonBackClick = () => {
    if (!user) {
      dispatch(changeAuthModalStatus(true));
      return;
    }
    if (window && window.history.length > 1) {
      router.back();
    } else {
      // Provide an alternative action here
      // For example, redirect the user to the homepage
      router.push('/');
    }
  };

  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-4xl flex-shrink-0 items-center justify-between py-2 relative"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a onClick={handleButtonBackClick} href="#" className="p-2.5">
            <span className="sr-only">RealGaged</span>
            <img src="/realgaged-logo2.svg" alt="" className="h-6 w-6" />
          </a>
        </div>

        <div className="flex gap-x-6 mx-auto justify-center">
          {navigation.map((item, index) => (
            <a
              key={item.name}
              onClick={() => {
                console.log({
                  index,
                  currentPageIndex
                });
                dispatch(changePublicProfileTabState(index + 1));
              }}
              href={item.href}
              className={`text-sm leading-6 font-semibold ${
                currentPageIndex - 1 === index
                  ? 'text-indigo-600'
                  : 'text-gray-700'
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="flex lg:hidden items-center">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
            // onClick={() => toast.success('Hello world!')}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-8 w-auto" src="/realgaged-logo2.svg" alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="py-2">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Send invoice
                  </a>
                </div>
                <div className="py-2">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Leave a review
                  </a>
                </div>
                <div className="py-2">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
