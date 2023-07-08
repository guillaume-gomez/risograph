import React, { useRef , useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  CameraControls,
  Stats,
  AsciiRenderer,
  ContactShadows,
  Grid,
  Stage,
  Lightformer,
  Environment,
  Float,
} from '@react-three/drei';
import { useFullscreen } from "rooks";
import ThreeJsLayer from "./ThreeJsLayer";
import { position2D, LayersBase64Data } from "../interfaces";
import Ground from "./Ground";
import Striplight from "./Striplight";


interface ThreejsRenderingProps {
  layers: LayersBase64Data[];
  positions2d: position2D[];
  width: number;
  height: number;
  backgroundColor: string;
  opacityLayer?: number;
  zOffset?: number
  zCamera: number;
 }

function ThreejsRendering({ layers, width, height, backgroundColor,  positions2d , zCamera, zOffset = 0.1, opacityLayer = 0.9 } : ThreejsRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraControlRef = useRef<CameraControls|null>(null);
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });
  const [fakeSelectedLayer, setFakeSelectedLayer] = useState<number>(-1);

  useEffect(() => {
    if(cameraControlRef && cameraControlRef.current) {
      cameraControlRef.current.dollyTo(+(1.1) + (layers.length * (zOffset / 2)) , true);
    }
  }, [layers.length, zOffset])

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

  const sizeOfLayersZMiddle = layers.length * zOffset / 2;


  return (
    <div className="flex flex-col gap-5 w-full">
      <Canvas
        camera={{ position: [0, 0.0, 1.1], fov: 75, far: 10 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
        style={{width, height}}
      >


        { 
          import.meta.env.MODE === "development" ? 
          <>
          <Stats showPanel={0} /> 
          <Grid sectionColor={0x987654} cellSize={1} args={[10, 10]} />
          </> : <></>
        }
      <CameraControls
          ref={cameraControlRef}
          minPolarAngle={-Math.PI / 1.8}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 1.8}
          maxAzimuthAngle={Math.PI / 1.8}
          minDistance={0.8}
          maxDistance={10}
      />
            <Ground />
            <group
              position={[
                0
                ,0.1,
                0]}
            >
              {
                layers.length === positions2d.length &&
                positions2d.map((position2d, index) => {
                  return <ThreeJsLayer
                            key={index}
                            base64Texture={layers[index].layerBase64}
                            opacity={opacityLayer}
                            position={[position2d.x , position2d.y, -sizeOfLayersZMiddle + (index  * zOffset)]}
                            isSelected={index === fakeSelectedLayer}
                         />
                })
              }
            </group>
          <pointLight position={[10, 10, 5]} />
          <ambientLight intensity={0.4} />
         <Environment background resolution={64}>

          <color attach="background" args={[colorToSigned24Bit(backgroundColor)]} />

          <Striplight position={[10, 2, 0]} scale={[1, 3, 10]} />
          <Striplight position={[-10, 2, 0]} scale={[1, 3, 10]} />
          <Striplight position={[0, 10, 0]} scale={[10, 10, 10]} />
          <Striplight position={[0, 2, -10]} scale={[10, 3, 1]} />
        </Environment>
        { /* <AsciiRenderer fgColor="white" bgColor="black" /> */}
      </Canvas>
      <ul className="text-xs">
        <li>Double click to switch to fullscreen</li>
        <li>Use your mouse or finger to move the camera</li>
      </ul>
    </div>
  );
}

export default ThreejsRendering;