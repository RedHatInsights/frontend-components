import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const CRC_PDF_GENERATE_API = '/api/crc-pdf-generator/v1/generate';
const fetchPDF = (service: string, template: string, params: Record<string, unknown>) => {
  const url = new URL(CRC_PDF_GENERATE_API, window.location.origin);
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      service,
      template,
      params,
    }),
  }).then((response) => response.blob());
};

const renderPDF = (pdfBlob: Blob, fileName = 'new-report') => {
  const url = window.URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

// Hook to provide a function that request pdf-generator service to generate report blob
// and convert returned blob into pdf
const usePDFExport = (service: string) => {
  const exportPDF = async (template: string, filename: string, exportSettings: Record<string, unknown>) => {
    addNotification({
      variant: 'info',
      title: 'Preparing export',
      description: 'Once complete, your download will start automatically.',
    });
    try {
      const pdfBlob = await fetchPDF(service, template, exportSettings);
      renderPDF(pdfBlob, filename);
      addNotification({
        variant: 'success',
        title: 'Downloading export',
      });
    } catch (e) {
      addNotification({
        variant: 'danger',
        title: 'Couldn’t download export',
        description: 'Reinitiate this export to try again.',
      });
    }
  };

  return exportPDF;
};

export default usePDFExport;
