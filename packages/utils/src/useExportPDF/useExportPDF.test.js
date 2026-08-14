import useExportPDF from './useExportPDF';
import { pdfGeneratorURL } from './useExportPDF';

window.URL.createObjectURL = jest.fn();
global.fetch = jest.fn();
const dispatch = jest.fn();

describe('useExportPDF', () => {
  it('Should download PDF', async () => {
    global.fetch.mockReturnValueOnce(Promise.resolve({ blob: jest.fn() }));
    const exportPDF = useExportPDF('vulnerability', dispatch);
    await exportPDF('executiveReport', 'vulnerability-test-export', { someRequestPayload: 'some value' });
    expect(fetch).toHaveBeenCalledWith(pdfGeneratorURL, {
      body: '{"service":"vulnerability","template":"executiveReport","params":{"someRequestPayload":"some value"}}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });
});
