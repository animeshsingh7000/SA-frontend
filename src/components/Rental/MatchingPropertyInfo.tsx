import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TABS_KEYS } from "../../constants";

export default function MatchingPropertyInfo() {
  const [showMore, setShowMore] = useState(false);
  const [searchParams] = useSearchParams();

  const toggleLessMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="matching-property-info">
      <span className="info-icon"></span>
      {searchParams.get("type") === TABS_KEYS.favorites ? (
        <p
          className="flex-fill text-truncate fav-prop-text"
          id="matchingPropertyInfoPara"
        >
          If a property is no longer on your favorite list, it means the
          property has now been rented.
        </p>
      ) : (
        <>
          <p
            className={`flex-fill ${showMore ? "" : "text-truncate"}`}
            id="matchingPropertyInfoPara"
          >
            Please note, when you see a search result in{" "}
            <span className="red-text">RED</span>, that means this item does not
            match your original inquiry term. When the available date is
            displayed in <span className="red-text">RED</span>, this may mean
            the lease start date may need to start before or after your intended
            arrival date. Please inquire with our team on how to rent this
            property. Thanks for reading all this text, you're awesome.{" "}
            {showMore && (
              <span
                className="show-less-text"
                id="showLess"
                onClick={toggleLessMore}
              >
                Show Less
              </span>
            )}
          </p>
          {!showMore && (
            <span
              className="show-more-text"
              id="showMore"
              onClick={toggleLessMore}
            >
              Show More
            </span>
          )}
        </>
      )}
    </div>
  );
}
