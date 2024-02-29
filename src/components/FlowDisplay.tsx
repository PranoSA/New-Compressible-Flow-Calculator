'use client';

import Flow from '@/utils/Flow';

type FlowEnergyChartsProps = {
  flow: Flow;
  filter_traits: string[];
};

export default function FlowDisplayChart(props: FlowEnergyChartsProps) {
  const { flow } = props;
  const filter_traits = props.filter_traits;

  const transformSameValue = (value: number) => {
    //Limit to 3 decimals or NaN
    return isNaN(value) ? 'NaN' : value.toPrecision(4);
  };

  return (
    <div className="w-full flex flex-wrap">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          ...Object.getOwnPropertyNames(flow),
          ...Object.getOwnPropertyNames(Object.getPrototypeOf(flow)),
        ].map(
          (key) =>
            !filter_traits.includes(key) && (
              <div
                key={key}
                className="border p-4 flex flex-col items-center justify-center"
              >
                <label className="font-bold">{key}</label>
                <div>
                  {
                    //@ts-ignore
                    transformSameValue(flow[key])
                  }
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
