/*
 * Copyright (c) Johannes Grimm 2024.
 */

import {
  Backpack,
  Coins,
  FlameKindling,
  Flower2,
  Leaf,
  RefreshCwOff,
  Scissors,
  Sprout,
  ThermometerSun,
} from 'lucide-react';

import type { PlantStage } from '@prisma/client';

export default function getPlantStageIcon(stage?: PlantStage) {
  switch (stage) {
    case 'SEEDLING':
      return <Sprout className='size-5' />;
    case 'VEGETATIVE':
      return <Leaf className='size-5' />;
    case 'FLOWERING':
      return <Flower2 className='size-5' />;
    case 'HARVEST':
      return <Scissors className='size-5' />;
    case 'DRIED':
      return <FlameKindling className='size-5' />;
    case 'CURED':
      return <ThermometerSun className='size-5' />;
    case 'PACKAGED':
      return <Backpack className='size-5' />;
    case 'SOLD':
      return <Coins className='size-5' />;
    case 'DESTROYED':
      return <RefreshCwOff className='size-5' />;
    default:
      return null;
  }
}
