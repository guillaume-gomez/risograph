import React, { useRef , useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useFullscreen } from "rooks";
import ThreeJsLayer from "./ThreeJsLayer";
import { position2D } from "../interfaces";

interface ThreejsRenderingProps {
  layers: string[];
  positions2d: position2D[];
  width: number;
  height: number;
  backgroundColor: string;
  zOffset?: number
}

function ThreejsRendering({ layers, width, height, backgroundColor,  positions2d , zOffset = 0.1 } : ThreejsRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });

  function colorToSigned24Bit(stringColor: string) : number {
    return (parseInt(stringColor.substr(1), 16) << 8) / 256;
  }

  // before layers are cut
  if(layers.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <p>Upload an image to see the final result</p>
        <canvas style={{ background: backgroundColor, width, height }}/>
      </div>
    );
  }

  const sizeOfLayersZ = layers.length * zOffset;
  const middleSizeOfLayersZ = sizeOfLayersZ / 2;

  return (
    <div className="flex flex-col gap-5 w-full">
      <Canvas
        camera={{ position: [0, 0.0, 1], fov: 75, far: 5 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
        style={{width, height}}
      >
        <color attach="background" args={[colorToSigned24Bit(backgroundColor)]} />
        <OrbitControls makeDefault />
        <pointLight position={[10, 10, 10]} />
        <group
          position={[
            0
            ,0,
            0]}
        >
          {
            layers.map((layerBase64, index) => {
              return <ThreeJsLayer
                        key={index}
                        base64Texture={layerBase64}
                        position={[positions2d[index].x , positions2d[index].y, -middleSizeOfLayersZ + (index  * zOffset)]}
                        /*meshProps={{position:[0 ,0, -middleSizeOfLayersZ + (index  * zOffset)]}}*/
                     />
            })
          }
        </group>
      </Canvas>
      <ul className="text-xs">
        <li>Double click to switch to fullscreen</li>
        <li>Use your mouse or finger to move the camera</li>
      </ul>
    </div>
  );
}

export default ThreejsRendering;