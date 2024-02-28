'use client';
import Flow from '@/utils/Flow';
import { Compressor, Turbine } from '@/utils/Turbomachines';
import { useState } from 'react';

const PropulsionPage = () => {
  const [freeStreamMach, setFreeStreamMach] = useState(0);
  const [freeStreamTemp, setFreeStreamTemp] = useState(0);
  const [freeStreamPressure, setFreeStreamPressure] = useState(0);

  // Turbofan bypass ratio
  const [bypassRatio, setBypassRatio] = useState(0);

  // Combustion Output Temperature
  const [engineTemp, setEngineTemp] = useState(0);

  //Set up Compressor (Compression Ratio, Effieciency)
  const [compressor, setCompressor] = useState<Compressor>(
    new Compressor(null, 1.0, 1, null)
  );
  //Setup Turbine Effieciency  (Work Done Based on Compressor Change in Enthalpy)
  const [turbine, setTurbine] = useState<Turbine>(
    new Turbine(null, 1.0, 1, null)
  );

  const [outputFlow, setOutputFlow] = useState<Flow>(
    new Flow(0, 0, 0, 1.4, 8.314)
  );

  const [thrust, setThrust] = useState(0);
  const [overallEfficiency, setOverallEfficiency] = useState(0);
  const [specificFuelConsumption, setSpecificFuelConsumption] = useState(0);
  const [massFlow, setMassFlow] = useState(0); //Per Inlet Size ??

  // Imply Things like Temperature and Pressure
  // From Altitude ??
  const [altitude, setAltitude] = useState(0);

  // Now Set
};

export default PropulsionPage;
