import { describe, it, expect, beforeEach } from 'vitest'
import * as contactsService from '../contacts.service'

const TEST_USER = 'test-user-123'

beforeEach(() => {
  localStorage.clear()
})

describe('contacts.service (localStorage mode)', () => {
  describe('fetchContacts', () => {
    it('returns empty array when no data exists', async () => {
      const result = await contactsService.fetchContacts(TEST_USER)
      expect(result).toEqual([])
    })

    it('returns stored contacts', async () => {
      const contact = await contactsService.insertContact(TEST_USER, {
        name: 'Test User',
        email: 'test@example.com',
        company: null,
        phone: null,
        tags: [],
        notes: null,
      })
      const result = await contactsService.fetchContacts(TEST_USER)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Test User')
      expect(result[0].id).toBe(contact.id)
    })
  })

  describe('insertContact', () => {
    it('creates a new contact with generated id and timestamps', async () => {
      const result = await contactsService.insertContact(TEST_USER, {
        name: 'Juan Perez',
        email: 'juan@test.com',
        company: 'Acme',
        phone: '123456',
        tags: ['web'],
        notes: 'test note',
      })

      expect(result.id).toBeTruthy()
      expect(result.user_id).toBe(TEST_USER)
      expect(result.name).toBe('Juan Perez')
      expect(result.email).toBe('juan@test.com')
      expect(result.company).toBe('Acme')
      expect(result.phone).toBe('123456')
      expect(result.tags).toEqual(['web'])
      expect(result.notes).toBe('test note')
      expect(result.created_at).toBeTruthy()
    })

    it('adds contact to the beginning of the list', async () => {
      await contactsService.insertContact(TEST_USER, { name: 'First', email: 'a@test.com', company: null, phone: null, tags: [], notes: null })
      const second = await contactsService.insertContact(TEST_USER, { name: 'Second', email: 'b@test.com', company: null, phone: null, tags: [], notes: null })

      const all = await contactsService.fetchContacts(TEST_USER)
      expect(all[0].name).toBe('Second')
      expect(all[1].name).toBe('First')
    })
  })

  describe('updateContact', () => {
    it('updates an existing contact', async () => {
      const created = await contactsService.insertContact(TEST_USER, {
        name: 'Original',
        email: 'orig@test.com',
        company: null,
        phone: null,
        tags: [],
        notes: null,
      })

      const updated = await contactsService.updateContact(TEST_USER, created.id, {
        name: 'Updated',
        email: 'updated@test.com',
      })

      expect(updated.name).toBe('Updated')
      expect(updated.email).toBe('updated@test.com')
      expect(updated.id).toBe(created.id)
    })

    it('throws when contact not found', async () => {
      await expect(
        contactsService.updateContact(TEST_USER, 'nonexistent', { name: 'X' })
      ).rejects.toThrow('Contact not found')
    })
  })

  describe('deleteContact', () => {
    it('removes a contact', async () => {
      const created = await contactsService.insertContact(TEST_USER, {
        name: 'ToDelete',
        email: 'del@test.com',
        company: null,
        phone: null,
        tags: [],
        notes: null,
      })

      await contactsService.deleteContact(TEST_USER, created.id)
      const result = await contactsService.fetchContacts(TEST_USER)
      expect(result).toEqual([])
    })

    it('does not affect other users data', async () => {
      await contactsService.insertContact(TEST_USER, {
        name: 'My Contact',
        email: 'me@test.com',
        company: null,
        phone: null,
        tags: [],
        notes: null,
      })
      await contactsService.insertContact('other-user', {
        name: 'Other Contact',
        email: 'other@test.com',
        company: null,
        phone: null,
        tags: [],
        notes: null,
      })

      const mine = await contactsService.fetchContacts(TEST_USER)
      expect(mine).toHaveLength(1)
      expect(mine[0].name).toBe('My Contact')
    })
  })
})
