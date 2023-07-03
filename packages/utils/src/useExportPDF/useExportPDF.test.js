import useExportPDF from './useExportPDF';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { pdfGeneratorURL } from './useExportPDF';
jest.mock('@redhat-cloud-services/frontend-components-notifications/redux', () => ({
  ...jest.requireActual('@redhat-cloud-services/frontend-components-notifications/redux'),
  addNotification: jest.fn(() => ({})),
}));

window.URL.createObjectURL = jest.fn();
global.fetch = jest.fn();

describe('useExportPDF', () => {
  it('Should download PDF', async () => {
    global.fetch.mockReturnValueOnce(Promise.resolve({ blob: jest.fn() }));
    const exportPDF = useExportPDF('vulnerability');
    await exportPDF('executiveReport', 'vulnerability-test-export', { someRequestPayload: 'some value' });
    expect(fetch).toHaveBeenCalledWith(pdfGeneratorURL, {
      body: '{"service":"vulnerability","template":"executiveReport","params":{"someRequestPayload":"some value"}}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    expect(addNotification).toHaveBeenCalledWith({
      description: 'Once complete, your download will start automatically.',
      title: 'Preparing export',
      variant: 'info',
    });
    expect(addNotification).toHaveBeenCalledWith({
      variant: 'success',
      title: 'Downloading export',
    });
  });
  it('Should fail to download PDF with notification', async () => {
    global.fetch.mockReturnValueOnce(Promise.reject('error'));

    const exportPDF = useExportPDF('vulnerability');
    await exportPDF('executiveReport', 'vulnerability-test-export', { someRequestPayload: 'some value' });
    expect(addNotification).toHaveBeenCalledWith({
      description: 'Reinitiate this export to try again.',
      title: 'Couldn’t download export',
      variant: 'danger',
    });
  });
});
