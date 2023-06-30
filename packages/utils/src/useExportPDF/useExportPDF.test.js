import useExportPDF from './useExportPDF';

jest.mock('@redhat-cloud-services/frontend-components-notifications/redux', () => ({
  ...jest.requireActual('@redhat-cloud-services/frontend-components-notifications/redux'),
  addNotification: jest.fn(() => ({})),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 }),
  })
);

describe('useExportPDF', () => {
  it('Should download PDF', async () => {
    const exportPDF = useExportPDF('vulnerability');
    await exportPDF('executiveReport', 'vulnerability-test-export', { someRequestPayload: 'some value' });

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/crc-pdf-generator/v1/generate', {
      body: '{"service":"vulnerability","template":"executiveReport","params":{"someRequestPayload":"some value"}}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });
});
