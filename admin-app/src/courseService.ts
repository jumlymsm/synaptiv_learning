import type { Course, CourseInput } from './types'

const KEY = 'synaptiv_courses_v4'

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }

function now() { return new Date().toISOString() }

const SEED: Course[] = [
  { id: uid(), courseName: 'Certified Scrum Master (CSM)', vendor: 'Scrum Alliance', category: 'Agile', duration: '2 Days', seatCapacity: null, listPrice: null, discountedPrice: null, badgeLogoUrl: '', shortDescription: 'Become a Certified ScrumMaster® and lead high-performing Agile teams.', fullDescription: '', learningObjectives: '', curriculumOverview: '', targetAudience: '', certificationDetails: '', trainerProfile: '', urlSlug: 'certified-scrum-master-csm', published: false, createdAt: now(), updatedAt: now() },
  { id: uid(), courseName: 'SAFe Scrum Master', vendor: 'Scaled Agile, Inc.', category: 'Agile', duration: '2 Days', seatCapacity: null, listPrice: null, discountedPrice: null, badgeLogoUrl: '', shortDescription: 'Learn to lead and support Agile Release Trains in a SAFe enterprise.', fullDescription: '', learningObjectives: '', curriculumOverview: '', targetAudience: '', certificationDetails: '', trainerProfile: '', urlSlug: 'safe-scrum-master', published: false, createdAt: now(), updatedAt: now() },
  { id: uid(), courseName: 'SAFe POPM', vendor: 'Scaled Agile, Inc.', category: 'Agile', duration: '2 Days', seatCapacity: null, listPrice: null, discountedPrice: null, badgeLogoUrl: '', shortDescription: 'Master Product Owner/Product Manager skills in a scaled Agile environment.', fullDescription: '', learningObjectives: '', curriculumOverview: '', targetAudience: '', certificationDetails: '', trainerProfile: '', urlSlug: 'safe-popm', published: false, createdAt: now(), updatedAt: now() },
  { id: uid(), courseName: 'CBAP Certification Training', vendor: 'IIBA (International Institute of Business Analysis)', category: 'Business Analysis', duration: '3 Days', seatCapacity: null, listPrice: 1500, discountedPrice: 500, badgeLogoUrl: '', shortDescription: 'Master business analysis skills and prepare for the CBAP® exam.', fullDescription: '', learningObjectives: '', curriculumOverview: '', targetAudience: '', certificationDetails: '', trainerProfile: '', urlSlug: 'cbap-certification-training', published: false, createdAt: now(), updatedAt: now() },
  { id: uid(), courseName: 'PMP Certification Training', vendor: 'PMI (Project Management Institute)', category: 'Project Management', duration: '4 Days', seatCapacity: 20, listPrice: 1000, discountedPrice: 500, badgeLogoUrl: '', shortDescription: 'Prepare for the globally recognized PMP® certification exam.', fullDescription: '', learningObjectives: '', curriculumOverview: '', targetAudience: 'Project managers with 3+ years experience.', certificationDetails: '35 PDUs provided.', trainerProfile: '', urlSlug: 'pmp-certification-training', published: true, createdAt: now(), updatedAt: now() },
]

function load(): Course[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Course[]
  } catch { /* ignore */ }
  const seed = structuredClone(SEED)
  localStorage.setItem(KEY, JSON.stringify(seed))
  return seed
}

function persist(courses: Course[]) {
  localStorage.setItem(KEY, JSON.stringify(courses))
}

export function getCourses(): Course[] { return load() }

export function createCourse(input: CourseInput): Course {
  const courses = load()
  const course: Course = { ...input, id: uid(), createdAt: now(), updatedAt: now() }
  courses.unshift(course)
  persist(courses)
  return course
}

export function updateCourse(id: string, input: Partial<CourseInput>): Course {
  const courses = load()
  const i = courses.findIndex(c => c.id === id)
  if (i === -1) throw new Error('Not found')
  courses[i] = { ...courses[i], ...input, updatedAt: now() }
  persist(courses)
  return courses[i]
}

export function deleteCourse(id: string): void {
  persist(load().filter(c => c.id !== id))
}

export function togglePublish(id: string, published: boolean): Course {
  return updateCourse(id, { published })
}
