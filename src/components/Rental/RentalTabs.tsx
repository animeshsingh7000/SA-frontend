import { useSearchParams } from "react-router-dom";
import { TABS_KEYS } from "../../constants";

export default function RentalTabs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = (type: string) => {
    searchParams.set('type', type);
    setSearchParams(searchParams);
  }
  return (
    <ul className="rental-portal-tabs">
      <li className="rental-portal-li" onClick={() => updateSearchParams(TABS_KEYS.allResults)}>
        <a className={`${!searchParams.get('type') && 'active'}`}>All Results</a>
      </li>
      <li className="rental-portal-li" onClick={() => updateSearchParams(TABS_KEYS.favorites)}>
        <a className={`${searchParams.get('type') === TABS_KEYS.favorites && 'active'}`}>Favorites</a>
      </li>
      <li className="rental-portal-li" onClick={() => updateSearchParams(TABS_KEYS.dislike)}>
        <a className={`${searchParams.get('type') === TABS_KEYS.dislike && 'active'}`}>Not Interested</a>
      </li>
    </ul>
  );
}
