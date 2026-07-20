import { describe, it, expect, beforeEach } from 'vitest'
import * as activityService from '../activity.service'

const TEST_USER = 'test-user-activity'

beforeEach(() => {
  localStorage.clear()
})

describe('activity.service (localStorage mode)', () => {
  describe('addActivity', () => {
    it('creates a new activity entry', async () => {
      const result = await activityService.addActivity(TEST_USER, 'Test action')

      expect(result.id).toBeTruthy()
      expect(result.user_id).toBe(TEST_USER)
      expect(result.text).toBe('Test action')
      expect(result.created_at).toBeTruthy()
    })

    it('prepends new entries (newest first)', async () => {
      await activityService.addActivity(TEST_USER, 'First')
      await activityService.addActivity(TEST_USER, 'Second')

      const all = await activityService.fetchActivity(TEST_USER)
      expect(all).toHaveLength(2)
      expect(all[0]?.text).toBe('Second')
      expect(all[1]?.text).toBe('First')
    })

    it('caps at 20 entries', async () => {
      for (let i = 0; i < 25; i++) {
        await activityService.addActivity(TEST_USER, `Action ${i}`)
      }

      const all = await activityService.fetchActivity(TEST_USER)
      expect(all).toHaveLength(20)
      expect(all[0]?.text).toBe('Action 24')
      expect(all[19]?.text).toBe('Action 5')
    })
  })

  describe('fetchActivity', () => {
    it('returns empty array when no data exists', async () => {
      const result = await activityService.fetchActivity(TEST_USER)
      expect(result).toEqual([])
    })

    it('returns all entries for the user', async () => {
      await activityService.addActivity(TEST_USER, 'Action A')
      await activityService.addActivity(TEST_USER, 'Action B')

      const result = await activityService.fetchActivity(TEST_USER)
      expect(result).toHaveLength(2)
    })
  })
})
