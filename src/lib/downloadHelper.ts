export function downloadProjectZip(): void {
  const link = document.createElement('a');
  link.href = '/SI-TATAUSAHA-LENGKAP.zip';
  link.setAttribute('download', 'SI-TATAUSAHA-LENGKAP.zip');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
