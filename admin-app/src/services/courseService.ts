import type { CourseBatch, CourseBatchInput } from '../types'

const STORAGE_KEY = 'synaptiv_course_batches'
const SEED_KEY = 'synaptiv_seeded'

const seedData: CourseBatch[] = [
  {
    id: 'seed-001',
    programName: 'CBAP Certification',
    courseCode: 'CBAP-APR-2025',
    trainerName: 'Sarah Mitchell',
    startDate: '2025-04-14',
    endDate: '2025-04-18',
    listPrice: 2500,
    discountedPrice: 2100,
    discountStartDate: '2025-03-01',
    discountEndDate: '2025-04-01',
    currency: 'USD',
    maxSeats: 20,
    createdAt: new Date('2025-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-01-15T10:00:00Z').toISOString(),
  },
  {
    id: 'seed-002',
    programName: 'PMP Certification',
    courseCode: 'PMP-JUN-2025',
    trainerName: 'James Okafor',
    startDate: '2025-06-09',
    endDate: '2025-06-13',
    listPrice: 3200,
    discountedPrice: 2800,
    discountStartDate: '2025-04-15',
    discountEndDate: '2025-05-31',
    currency: 'USD',
    maxSeats: 18,
    createdAt: new Date('2025-02-01T09:00:00Z').toISOString(),
    updatedAt: new Date('2025-02-01T09:00:00Z').toISOString(),
  },
  {
    id: 'seed-003',
    programName: 'Certified Scrum Master (CSM)',
    courseCode: 'CSM-MAY-2025',
    trainerName: 'Linda Chen',
    startDate: '2025-05-19',
    endDate: '2025-05-20',
    listPrice: 1800,
    discountedPrice: 1800,
    discountStartDate: '',
    discountEndDate: '',
    currency: 'USD',
    maxSeats: 25,
    createdAt: new Date('2025-02-10T08:00:00Z').toISOString(),
    updatedAt: new Date('2025-02-10T08:00:00Z').toISOString(),
  },
]

function loadFromStorage(): CourseBatch[] {
  if (!localStorage.getItem(SEED_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData))
    localStorage.setItem(SEED_KEY, 'true')
  }
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as CourseBatch[]
  } catch {
    return []
  }
}

function saveToStorage(batches: CourseBatch[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(batches))
}

export async function getCourseBatches(): Promise<CourseBatch[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(loadFromStorage())
    }, 120)
  })
}

export async function createCourseBatch(input: CourseBatchInput): Promise<CourseBatch> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const batches = loadFromStorage()
      const now = new Date().toISOString()
      const newBatch: CourseBatch = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      }
      batches.push(newBatch)
      saveToStorage(batches)
      resolve(newBatch)
    }, 200)
  })
}

export async function updateCourseBatch(
  id: string,
  input: Partial<CourseBatchInput>,
): Promise<CourseBatch> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const batches = loadFromStorage()
      const index = batches.findIndex((b) => b.id === id)
      if (index === -1) {
        reject(new Error(`Course batch with id "${id}" not found`))
        return
      }
      const updated: CourseBatch = {
        ...batches[index],
        ...input,
        updatedAt: new Date().toISOString(),
      }
      batches[index] = updated
      saveToStorage(batches)
      resolve(updated)
    }, 200)
  })
}

export async function deleteCourseBatch(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const batches = loadFromStorage()
      const index = batches.findIndex((b) => b.id === id)
      if (index === -1) {
        reject(new Error(`Course batch with id "${id}" not found`))
        return
      }
      batches.splice(index, 1)
      saveToStorage(batches)
      resolve()
    }, 200)
  })
}
