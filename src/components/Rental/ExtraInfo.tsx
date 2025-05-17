export default function ExtraInfo({
  isGuestDashboard,
}: {
  isGuestDashboard?: boolean;
}) {
  return (
    <div className="matching-property-card-extra-info">
      <div className="extra-info">
        <p className="extra-info-txt">
          {
            !isGuestDashboard
            ?
              `You've reached the end of the search results! If you do not see any
              results above, this is because at this time we do not have
              availability matching your criteria. We most likely have something
              available that will bring joy, but you may need to modify your search
              parameters. Maybe just adjusting the filters above, or press the 'edit
              inquiry' button on the right.`
            :
              `You've reached the end of the search results! If you do not see any results above, 
              this is because at this time we do not have availability matching your criteria. 
              We most likely have something available that will bring joy, but you may need to modify 
              your search parameters. Maybe just adjusting the filters above could help. 
              Feel free to call or email us!`
          }
          {" "}
        </p>
        <p className="extra-info-txt-mail">
          You can {!isGuestDashboard ? 'also' : ''} speak with an Attache team member by calling us at{" "}
          <a href="javascript:void(0)" className="phone-txt-color">
            800-916-4903 ext. 1
          </a>{" "}
          or by emailing{" "}
          <a href="mailto:reservations@stayattache.com">
            reservations@stayattache.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
