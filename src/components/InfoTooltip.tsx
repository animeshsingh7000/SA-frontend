export default function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="tooltips">
      <em className="tooltip-icon">i</em>
      <div className="tooltiptext">{text}</div>
    </div>
  );
}
