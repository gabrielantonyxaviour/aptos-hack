import { useEnvironmentStore } from "@/components/context";

import BrandCard from "./brand-card";

export default function InfluencersTab() {
  const { brands } = useEnvironmentStore((store) => store);

  return (
    <div className="grid grid-cols-4 gap-2 w-full py-4 pr-4">
      {brands.map((brand, idx) => (
        <BrandCard key={idx} brand={brand} idx={idx} />
      ))}
    </div>
  );
}
