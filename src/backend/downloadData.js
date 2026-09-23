// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR DOWNLOADING DATA LOCALLY
// ---------------------------------------------------------------------------------------------------------------------
export default (responseLog, ID) => {
  const headers = [
    'subj_id',
    'child_gender',
    'child_name',
    'item_id',
    'label',
    'score',
    'domain',
    'timestamp',
    'trial',
  ];

  const escapeCSV = (value) => {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value).replaceAll('"', '""');

    return `"${stringValue}"`;
  };

  const rows = responseLog.data.map((trial) => [
    responseLog.meta.subjID,
    responseLog.meta.childGender,
    responseLog.meta.childName,
    trial.item_id,
    trial.label,
    trial.score,
    trial.domain,
    trial.timestamp,
    trial.trial,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  const toSave = new Blob(
    ['\uFEFF' + csv],
    { type: 'text/csv;charset=utf-8;' },
  );

  const day = new Date().toISOString().substr(0, 10);
  const time = new Date().toISOString().substr(11, 8);

  const hiddenElement = document.createElement('a');
  hiddenElement.href = window.URL.createObjectURL(toSave);
  hiddenElement.download = `milestones-${ID}-${day}-${time}.csv`;
  hiddenElement.click();
};
