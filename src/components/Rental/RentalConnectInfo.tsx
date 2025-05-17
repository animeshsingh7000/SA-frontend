export default function RentalConnectInfo({
  isGuestDashboard,
}: {
  isGuestDashboard: boolean;
}) {
  return (
    <div className={`filter-plugin-container ${isGuestDashboard ? '': 'pad-x-60'}`}>
      <div className="container">
        <div className="book-reservation-info">
          <h6>
            Once you're ready to book your reservation, please follow the links
            below:
          </h6>
          <p>
            - If the lease will be under an individual's name, please click here
            ($55 application fee):{" "}
            <a
              href="https://stayattache.com/application/personal"
              className="hightlighted-link"
            >
              Attache Reservation Application
            </a>
          </p>
          <p>
            - If the lease will be under a company name, please click here ($85
            application fee):{" "}
            <a
              href="https://stayattache.com/application/corporate"
              className="hightlighted-link"
            >
              Attache Corporate Reservation Application
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
