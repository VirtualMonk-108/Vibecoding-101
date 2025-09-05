import { NextApiRequest, NextApiResponse } from 'next'

interface LoadSheddingResponse {
  events: Array<{
    start: string
    end: string
    stage: number
    area: string
    note?: string
  }>
  current_stage: number
  next_stage?: {
    stage: number
    start_time: string
  }
  info: {
    area: string
    last_updated: string
    source: 'EskomSePush Mock API'
  }
}

// Mock load shedding areas and their typical schedules
const loadSheddingAreas = {
  'cape-town-cbd': {
    name: 'Cape Town CBD',
    schedules: {
      1: [{ start: '06:00', end: '08:30' }, { start: '18:00', end: '20:30' }],
      2: [{ start: '04:00', end: '06:30' }, { start: '12:00', end: '14:30' }, { start: '20:00', end: '22:30' }],
      3: [{ start: '02:00', end: '04:30' }, { start: '10:00', end: '12:30' }, { start: '18:00', end: '20:30' }],
      4: [{ start: '00:00', end: '02:30' }, { start: '08:00', end: '10:30' }, { start: '16:00', end: '18:30' }],
      5: [{ start: '22:00', end: '00:30' }, { start: '06:00', end: '08:30' }, { start: '14:00', end: '16:30' }],
      6: [{ start: '20:00', end: '22:30' }, { start: '04:00', end: '06:30' }, { start: '12:00', end: '14:30' }]
    }
  },
  'johannesburg-cbd': {
    name: 'Johannesburg CBD',
    schedules: {
      1: [{ start: '08:00', end: '10:30' }, { start: '20:00', end: '22:30' }],
      2: [{ start: '06:00', end: '08:30' }, { start: '14:00', end: '16:30' }, { start: '22:00', end: '00:30' }],
      3: [{ start: '04:00', end: '06:30' }, { start: '12:00', end: '14:30' }, { start: '20:00', end: '22:30' }],
      4: [{ start: '02:00', end: '04:30' }, { start: '10:00', end: '12:30' }, { start: '18:00', end: '20:30' }],
      5: [{ start: '00:00', end: '02:30' }, { start: '08:00', end: '10:30' }, { start: '16:00', end: '18:30' }],
      6: [{ start: '22:00', end: '00:30' }, { start: '06:00', end: '08:30' }, { start: '14:00', end: '16:30' }]
    }
  },
  'durban-central': {
    name: 'Durban Central',
    schedules: {
      1: [{ start: '07:00', end: '09:30' }, { start: '19:00', end: '21:30' }],
      2: [{ start: '05:00', end: '07:30' }, { start: '13:00', end: '15:30' }, { start: '21:00', end: '23:30' }],
      3: [{ start: '03:00', end: '05:30' }, { start: '11:00', end: '13:30' }, { start: '19:00', end: '21:30' }],
      4: [{ start: '01:00', end: '03:30' }, { start: '09:00', end: '11:30' }, { start: '17:00', end: '19:30' }],
      5: [{ start: '23:00', end: '01:30' }, { start: '07:00', end: '09:30' }, { start: '15:00', end: '17:30' }],
      6: [{ start: '21:00', end: '23:30' }, { start: '05:00', end: '07:30' }, { start: '13:00', end: '15:30' }]
    }
  },
  'pretoria-central': {
    name: 'Pretoria Central',
    schedules: {
      1: [{ start: '09:00', end: '11:30' }, { start: '21:00', end: '23:30' }],
      2: [{ start: '07:00', end: '09:30' }, { start: '15:00', end: '17:30' }, { start: '23:00', end: '01:30' }],
      3: [{ start: '05:00', end: '07:30' }, { start: '13:00', end: '15:30' }, { start: '21:00', end: '23:30' }],
      4: [{ start: '03:00', end: '05:30' }, { start: '11:00', end: '13:30' }, { start: '19:00', end: '21:30' }],
      5: [{ start: '01:00', end: '03:30' }, { start: '09:00', end: '11:30' }, { start: '17:00', end: '19:30' }],
      6: [{ start: '23:00', end: '01:30' }, { start: '07:00', end: '09:30' }, { start: '15:00', end: '17:30' }]
    }
  }
}

function generateLoadSheddingSchedule(area: string, currentStage: number): LoadSheddingResponse {
  const areaData = loadSheddingAreas[area as keyof typeof loadSheddingAreas] || loadSheddingAreas['cape-town-cbd']
  const events = []

  if (currentStage > 0 && currentStage <= 6) {
    const schedule = areaData.schedules[currentStage as keyof typeof areaData.schedules]
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Generate events for today and tomorrow
    for (const slot of schedule) {
      // Today's events
      const todayStart = new Date(today)
      const [startHour, startMin] = slot.start.split(':').map(Number)
      todayStart.setHours(startHour, startMin, 0, 0)
      
      const todayEnd = new Date(today)
      const [endHour, endMin] = slot.end.split(':').map(Number)
      todayEnd.setHours(endHour, endMin, 0, 0)
      
      // Handle overnight slots
      if (endHour < startHour) {
        todayEnd.setDate(todayEnd.getDate() + 1)
      }

      if (todayStart > new Date()) { // Only future events
        events.push({
          start: todayStart.toISOString(),
          end: todayEnd.toISOString(),
          stage: currentStage,
          area: areaData.name,
          note: currentStage >= 4 ? 'High impact stage - prepare backup power' : undefined
        })
      }

      // Tomorrow's events
      const tomorrowStart = new Date(tomorrow)
      tomorrowStart.setHours(startHour, startMin, 0, 0)
      
      const tomorrowEnd = new Date(tomorrow)
      tomorrowEnd.setHours(endHour, endMin, 0, 0)
      
      if (endHour < startHour) {
        tomorrowEnd.setDate(tomorrowEnd.getDate() + 1)
      }

      events.push({
        start: tomorrowStart.toISOString(),
        end: tomorrowEnd.toISOString(),
        stage: currentStage,
        area: areaData.name
      })
    }
  }

  // Determine next stage change (simulate dynamic changes)
  let nextStage = undefined
  if (Math.random() > 0.7) { // 30% chance of stage change
    const possibleStages = [0, 1, 2, 3, 4]
    const filteredStages = possibleStages.filter(s => s !== currentStage)
    const newStage = filteredStages[Math.floor(Math.random() * filteredStages.length)]
    
    const nextChangeTime = new Date()
    nextChangeTime.setHours(nextChangeTime.getHours() + Math.floor(Math.random() * 8) + 2) // 2-10 hours from now
    
    nextStage = {
      stage: newStage,
      start_time: nextChangeTime.toISOString()
    }
  }

  return {
    events: events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
    current_stage: currentStage,
    next_stage: nextStage,
    info: {
      area: areaData.name,
      last_updated: new Date().toISOString(),
      source: 'EskomSePush Mock API'
    }
  }
}

// Simple load shedding stage simulation
let globalStage = 0
let lastStageChange = Date.now()

function getCurrentStage(): number {
  const now = Date.now()
  const hoursSinceLastChange = (now - lastStageChange) / (1000 * 60 * 60)

  // Change stage every 2-8 hours randomly
  if (hoursSinceLastChange > 2 + Math.random() * 6) {
    const stages = [0, 0, 0, 1, 1, 2, 2, 3, 4] // Weighted towards lower stages
    globalStage = stages[Math.floor(Math.random() * stages.length)]
    lastStageChange = now
  }

  return globalStage
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let { area } = req.query

  // Default to Cape Town CBD if no area specified
  if (!area) {
    area = 'cape-town-cbd'
  }

  // Validate area
  const validAreas = Object.keys(loadSheddingAreas)
  if (!validAreas.includes(area as string)) {
    return res.status(400).json({ 
      error: `Invalid area. Valid areas: ${validAreas.join(', ')}` 
    })
  }

  const currentStage = getCurrentStage()
  const schedule = generateLoadSheddingSchedule(area as string, currentStage)

  // Add some delay to simulate API call
  setTimeout(() => {
    res.status(200).json(schedule)
  }, 200 + Math.random() * 300)
}