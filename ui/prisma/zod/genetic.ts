import * as z from "zod"
import { CompletePlant, RelatedPlantModel } from "./index"

export const GeneticModel = z.object({
  id: z.string(),
  name: z.string(),
  flowerDays: z.number().int(),
})

export interface CompleteGenetic extends z.infer<typeof GeneticModel> {
  plants: CompletePlant[]
}

/**
 * RelatedGeneticModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGeneticModel: z.ZodSchema<CompleteGenetic> = z.lazy(() => GeneticModel.extend({
  plants: RelatedPlantModel.array(),
}))
