import { patientService } from './patients';

// Mock global fetch
global.fetch = jest.fn();

describe('patientService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all patients successfully', async () => {
      const mockPatients = [{ id: '1', firstName: 'John' }];
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockPatients,
      });

      const result = await patientService.getAll();

      expect(global.fetch).toHaveBeenCalledWith('/api/patients');
      expect(result).toEqual(mockPatients);
    });

    it('should throw error if fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(patientService.getAll()).rejects.toThrow('Failed to fetch patients');
    });
  });

  describe('getById', () => {
    it('should fetch patient by id successfully', async () => {
      const mockPatient = { id: '1', firstName: 'John' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockPatient,
      });

      const result = await patientService.getById('1');

      expect(global.fetch).toHaveBeenCalledWith('/api/patients/1');
      expect(result).toEqual(mockPatient);
    });

    it('should throw error if fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(patientService.getById('1')).rejects.toThrow('Failed to fetch patient');
    });
  });

  describe('create', () => {
    it('should create a patient successfully', async () => {
      const mockInput = {
        firstName: 'John',
        lastName: 'Doe',
        title: 'Mr',
        gender: 'Male' as const,
        dateOfBirth: new Date(),
        phoneNumber: '123',
        isNew: true,
      };
      const mockResponse = { id: '1', ...mockInput };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await patientService.create(mockInput);

      expect(global.fetch).toHaveBeenCalledWith('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockInput),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error if create fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      const mockInput = {
        firstName: 'John',
        lastName: 'Doe',
        title: 'Mr',
        gender: 'Male' as const,
        dateOfBirth: new Date(),
        phoneNumber: '123',
        isNew: true,
      };

      await expect(patientService.create(mockInput)).rejects.toThrow('Failed to create patient');
    });
  });

  describe('search', () => {
    it('should search patients successfully', async () => {
      const mockPatients = [{ id: '1', firstName: 'John' }];
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockPatients,
      });

      const result = await patientService.search('John');

      expect(global.fetch).toHaveBeenCalledWith('/api/patients/search?q=John');
      expect(result).toEqual(mockPatients);
    });

    it('should throw error if search fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(patientService.search('John')).rejects.toThrow('Failed to search patients');
    });
  });
});
