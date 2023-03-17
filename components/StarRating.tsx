const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex w-40 justify-center items-center">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        const fillPercentage = (rating - ratingValue + 1) * 100;
        let fill = 'grey';
        if (fillPercentage > 0) {
          fill = `url('#star-gradient-${index}')`;
        }
        return (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6 mr-1"
              key={index}
            >
              <defs>
                <linearGradient id={`star-gradient-${index}`}>
                  <stop offset={`${fillPercentage}%`} stopColor="gold" />
                  <stop offset={`${fillPercentage}%`} stopColor="lightgrey" />
                </linearGradient>
              </defs>
              <path
                fill={fill}
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </>
        );
      })}
    </div>
  );
};

export default StarRating;
