import { appointmentService } from './appointments';

// Mock global fetch
global.fetch = jest.fn();

describe('appointmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all appointments successfully', async () => {
      const mockAppointments = [{ id: '1', title: 'Checkup' }];
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockAppointments,
      });

      const result = await appointmentService.getAll();

      expect(global.fetch).toHaveBeenCalledWith('/api/appointments');
      expect(result).toEqual(mockAppointments);
    });

    it('should throw error if fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(appointmentService.getAll()).rejects.toThrow('Failed to fetch appointments');
    });
  });

  describe('create', () => {
    it('should create an appointment successfully', async () => {
      const mockInput = {
        patientId: 'p1',
        clinic: 'General',
        title: 'Checkup',
        appointmentType: 'Consult' as const,
        scheduledTime: new Date(),
        doesNotRepeat: false,
      };
      const mockResponse = { id: '1', ...mockInput };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await appointmentService.create(mockInput);

      expect(global.fetch).toHaveBeenCalledWith('/api/appointments', {
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
        patientId: 'p1',
        clinic: 'General',
        title: 'Checkup',
        appointmentType: 'Consult' as const,
        scheduledTime: new Date(),
        doesNotRepeat: false,
      };

      await expect(appointmentService.create(mockInput)).rejects.toThrow('Failed to create appointment');
    });
  });
});
