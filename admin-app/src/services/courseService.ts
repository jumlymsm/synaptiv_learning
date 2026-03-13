import type { Course, CourseInput } from '../types'

const STORAGE_KEY = 'synaptiv_courses_v3'

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

const SEED: Course[] = [
  {
    id: uid(),
    courseName: 'Certified Scrum Master (CSM)',
    shortDescription: 'Become a Certified ScrumMaster® and lead high-performing Agile teams.',
    vendor: 'Scrum Alliance',
    category: 'Agile',
    duration: '2 Days',
    seatCapacity: undefined,
    listPrice: undefined,
    discountedPrice: undefined,
    urlSlug: 'certified-scrum-master-csm',
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uid(),
    courseName: 'SAFe Scrum Master',
    shortDescription: 'Learn to lead and support Agile Release Trains in a SAFe enterprise.',
    vendor: 'Scaled Agile, Inc.',
    category: 'Agile',
    duration: '2 Days',
    urlSlug: 'safe-scrum-master',
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uid(),
    courseName: 'SAFe POPM',
    shortDescription: 'Master Product Owner/Product Manager skills in a scaled Agile environment.',
    vendor: 'Scaled Agile, Inc.',
    category: 'Agile',
    duration: '2 Days',
    urlSlug: 'safe-popm',
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uid(),
    courseName: 'CBAP Certification Training',
    shortDescription: 'Master business analysis skills and prepare for the CBAP® exam.',
    vendor: 'IIBA (International Institute of Business Analysis)',
    category: 'Business Analysis',
    duration: '3 Days',
    listPrice: 1500,
    discountedPrice: 500,
    urlSlug: 'cbap-certification-training',
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uid(),
    courseName: 'PMP Certification Training',
    shortDescription: 'Prepare for the globally recognized PMP® certification exam.',
    vendor: 'PMI (Project Management Institute)',
    category: 'Project Management',
    duration: '4 Days',
    listPrice: 1000,
    discountedPrice: 500,
    urlSlug: 'pmp-certification-training',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

function loadAll(): Course[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try { return JSON.parse(raw) as Course[] } catch { /* fall through */ }
  }
  const seed = JSON.parse(JSON.stringify(SEED)) as Course[]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  return seed
}

function saveAll(courses: Course[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses))
}

export async function getCourses(): Promise<Course[]> {
  return loadAll()
}

export async function createCourse(input: CourseInput): Promise<Course> {
  const courses = loadAll()
  const now = new Date().toISOString()
  const course: Course = { id: uid(), ...input, createdAt: now, updatedAt: now }
  courses.push(course)
  saveAll(courses)
  return course
}

export async function updateCourse(id: string, input: Partial<CourseInput>): Promise<Course> {
  const courses = loadAll()
  const idx = courses.findIndex((c) => c.id === id)
  if (idx === -1) throw new Error('Course not found')
  courses[idx] = { ...courses[idx], ...input, updatedAt: new Date().toISOString() }
  saveAll(courses)
  return courses[idx]
}

export async function deleteCourse(id: string): Promise<void> {
  const courses = loadAll().filter((c) => c.id !== id)
  saveAll(courses)
}

export async function togglePublish(id: string, published: boolean): Promise<Course> {
  return updateCourse(id, { published })
}
