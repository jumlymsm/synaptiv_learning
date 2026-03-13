export interface Course {
  id: string
  courseName: string
  vendor: string
  category: string
  duration?: string
  seatCapacity?: number
  listPrice?: number
  discountedPrice?: number
  badgeLogoUrl?: string
  shortDescription?: string
  fullDescription?: string
  learningObjectives?: string
  curriculumOverview?: string
  targetAudience?: string
  certificationDetails?: string
  trainerProfile?: string
  urlSlug?: string
  published?: boolean
  createdAt?: string
  updatedAt?: string
}

export type CourseInput = Omit<Course, 'id' | 'createdAt' | 'updatedAt'>
