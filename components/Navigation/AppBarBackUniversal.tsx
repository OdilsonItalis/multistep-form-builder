import { useRouter } from 'next/router';
import ArrowSmallLeft from 'public/icons/ArrowSmallLeft';

function AppBarBackUniversal({ pageTitle }: { pageTitle?: string }) {
  const router = useRouter();
  return (
    <div className="flex h-12 items-center bg-white flex-shrink-0">
      <button
        className="h-10 w-10 flex items-center justify-center"
        onClick={() => router.back()}
      >
        <ArrowSmallLeft height={20} width={20} />
      </button>
      <h3 className="line-clamp-1 text-xl font-semibold">{pageTitle}</h3>
    </div>
  );
}

export default AppBarBackUniversal;
