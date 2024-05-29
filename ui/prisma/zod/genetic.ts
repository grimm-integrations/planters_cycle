import * as z from 'zod';

import { CompletePlant, RelatedPlantModel } from './index';

export const GeneticModel = z.object({
  id: z.string(),
  name: z.string(),
});

export interface CompleteGenetic extends z.infer<typeof GeneticModel> {
  Plant: CompletePlant[];
}

/**
 * RelatedGeneticModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGeneticModel: z.ZodSchema<CompleteGenetic> = z.lazy(() =>
  GeneticModel.extend({
    Plant: RelatedPlantModel.array(),
  })
);
