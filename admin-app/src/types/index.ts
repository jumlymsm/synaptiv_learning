export interface CourseBatch {
  id: string
  programName: string
  courseCode: string
  trainerName: string
  startDate: string
  endDate: string
  listPrice: number
  discountedPrice: number
  discountStartDate: string
  discountEndDate: string
  currency: string
  maxSeats: number
  createdAt: string
  updatedAt: string
}

export type CourseBatchInput = Omit<CourseBatch, 'id' | 'createdAt' | 'updatedAt'>
