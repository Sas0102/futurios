export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-black pointer-events-none">
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,115,22,0.18),transparent_60%)]
        "
      />
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(ellipse_60%_40%_at_50%_55%,rgba(249,115,22,0.08),transparent_60%)]
        "
      />
    </div>
  );
}