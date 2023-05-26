import { useState } from 'react'
import Slider from "./Slider";
import ColorPicker from "./ColorPicker";
import { LayerSettingsData } from "../interfaces";


interface LayerSettingsInterface {
  onChange: (newLayerSettings: LayerSettingsData) => void;
  layerSettings: LayerSettingsData;
}

const TabNames = ["color", "range", "position"];
type TabName = typeof TabNames[number];

function LayerSettings({ onChange, layerSettings } : LayerSettingsInterface) {
  const [selectedTab, setSelectedTab] = useState<TabName>("color");

  function handleChangeMin(value: number) {
    onChange({ ...layerSettings, min: value });
  }

  function handleChangeMax(value: number) {
    onChange({ ...layerSettings, max: value });
  }

  function handleChangeAlpha(value: number) {
    onChange({ ...layerSettings, alpha: value });
  }

  function handleChangeColor(value: string) {
    onChange({ ...layerSettings, color: value });
  }

  function handleChangePercentage(value: number) {
    onChange({ ...layerSettings, noise: value });
  }

  function handleChangeX(value: number) {
    onChange({ ...layerSettings, position2D:{ ...layerSettings.position2D, x: value } });
  }

  function handleChangeY(value: number) {
    onChange({ ...layerSettings, position2D:{ ...layerSettings.position2D, y: value }});
  }

  function renderTab() {
    switch(selectedTab) {
      case "color":
      default:
        return (
          <>
            <ColorPicker label="Color" value={layerSettings.color} onChange={(color) => handleChangeColor(color)}/>
            <Slider
              label="Alpha"
              onChange={(value) => handleChangeAlpha(value)}
              value={layerSettings.alpha}
              min={0}
              max={255}
            />
          </>
        );
      case "range":
        return(
          <>
            <Slider
            label="Min"
            onChange={(value) => handleChangeMin(value)}
            value={layerSettings.min}
            min={0}
            max={255}
          />
          <Slider
            label="Max"
            onChange={(value) => handleChangeMax(value)}
            value={layerSettings.max}
            min={0}
            max={255}
          />
          <Slider
              label="Noise"
              onChange={(value) => handleChangePercentage(value)}
              value={layerSettings.noise}
              min={0}
              max={100}
            />
          </>
        );
      case "position":
        return(
          <>
            <Slider
            label="X axis"
            onChange={(value) => handleChangeX(value)}
            value={layerSettings.position2D.x}
            min={-1}
            max={1}
            float
            step={0.001}
          />
          <Slider
            label="Y Axis"
            onChange={(value) => handleChangeY(value)}
            value={layerSettings.position2D.y}
            min={-1}
            max={1}
            float
            step={0.001}
          />
          </>
        );
    };

  }

  return (
      <div className="flex flex-col gap-4">
        <div className="tabs tabs-boxed">
          {
            TabNames.map(tabName => {
            return(
              <a
                onClick={() => setSelectedTab(tabName)}
                className={`tab tab-sm ${selectedTab === tabName ? "tab-active" :"" }`}
              >
                {tabName}
              </a>
            )
          })
          }
        </div>
        <div className="flex flex-col gap-3">
         {renderTab()}
        </div>
      </div>
  )
}

export default LayerSettings;
