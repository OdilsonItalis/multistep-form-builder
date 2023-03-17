import { useRouter } from 'next/router';
import WorkoutsLogo from 'public/icons/WorkoutsLogo';
import SearchIcon from 'public/icons/SearchIcon';
import SettingsIcon from 'public/icons/SettingsIcon';
import BookmarkOutlinedIcon from 'public/icons/BookmarkOutlineIcon';
import BookmarkSolidIcon from 'public/icons/BookmarkSolidIcon';

function BottomNav() {
  const router = useRouter();

  function handleHomeButton() {
    // use shallow routing to prevent re-rendering of the page
    router.push('/', undefined, { shallow: true });
  }
  function handleSearchIcon() {
    // use shallow routing to prevent re-rendering of the page
    router.push('/discovery', undefined, { shallow: true });
  }
  function handleFavorites() {
    router.push('/saved', undefined, { shallow: true });
  }
  function handleClickSettings() {
    router.push('/settings', undefined, { shallow: true });
  }
  function handleClickWorkout() {
    router.push('/workout-tracker', undefined, { shallow: true });
  }

  const currentPageIsSearch = router.pathname === '/discovery';
  const currentPageIsDiary = router.pathname === '/';
  const currentPageIsMyFavorites = router.pathname === '/saved';
  const currentPageIsSettings = router.pathname === '/settings';
  const currentPageIsWorkout = router.pathname === '/workout-tracker';

  return (
    // <div className="flex fixed bottom-0 w-full md:hidden flex-col bg-white bg-opacity-80 text-gray-500 avoidBottom max-w-2xl">
    <div className="flex fixed bottom-0 w-full md:hidden flex-col bg-white bg-opacity-80 text-gray-500 avoidBottom">
      {/* <PersonalTrainingPromoSheet /> */}
      <div className="flex h-12 flex-shrink-0 items-center">
        <button
          onClick={handleHomeButton}
          className={`relative flex flex-1 flex-col items-center justify-center h-full ${
            currentPageIsDiary && 'text-black'
          } `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </button>
        <button
          onClick={handleClickWorkout}
          className={`relative flex flex-1 flex-col items-center justify-center h-full ${
            currentPageIsDiary && 'text-black'
          } `}
        >
          <WorkoutsLogo
            height="22px"
            width="22px"
            color={currentPageIsWorkout ? '#000000' : '#8B8B8B'}
          />
        </button>
        <button
          onClick={handleSearchIcon}
          className={`relative flex flex-1 flex-col items-center justify-center h-full ${
            currentPageIsSearch && 'text-black'
          } `}
        >
          <SearchIcon height={22} width={22} />
        </button>
        <button
          onClick={handleFavorites}
          className={`relative flex flex-1 flex-col items-center justify-center h-full ${
            currentPageIsMyFavorites && 'text-black'
          } `}
        >
          {currentPageIsMyFavorites ? (
            <BookmarkSolidIcon height={25} width={25} color={'#000000'} />
          ) : (
            <BookmarkOutlinedIcon height={25} width={25} />
          )}
        </button>
        <button
          onClick={handleClickSettings}
          className={`relative flex flex-1 flex-col items-center justify-center h-full ${
            currentPageIsSettings && 'text-black'
          } `}
        >
          <SettingsIcon height={25} width={25} />
        </button>
      </div>
    </div>
  );
}

export default BottomNav;
