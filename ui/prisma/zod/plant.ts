import * as z from "zod"
import { CompleteGenetic, RelatedGeneticModel, CompletePlantHistory, RelatedPlantHistoryModel } from "./index"

export const PlantModel = z.object({
  id: z.string(),
  name: z.string(),
  geneticId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePlant extends z.infer<typeof PlantModel> {
  genetic: CompleteGenetic
  PlantHistory: CompletePlantHistory[]
}

/**
 * RelatedPlantModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPlantModel: z.ZodSchema<CompletePlant> = z.lazy(() => PlantModel.extend({
  genetic: RelatedGeneticModel,
  PlantHistory: RelatedPlantHistoryModel.array(),
}))
