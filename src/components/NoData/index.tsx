import noRecourd from "../../assets/images/no-recourd-found.svg";

export default function NoData() {
  return (
    <div className="no-data-found">
      <div className="_center">
         <img src={noRecourd} alt="No Recoured" />
      </div>
    </div>
  );
}