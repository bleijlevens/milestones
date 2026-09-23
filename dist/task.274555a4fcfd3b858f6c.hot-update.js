"use strict";
self["webpackHotUpdateminimal_webpack_dev_server_babel_setup"]("task",{

/***/ "./src/backend/downloadData.js":
/*!*************************************!*\
  !*** ./src/backend/downloadData.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR DOWNLOADING DATA LOCALLY
// ---------------------------------------------------------------------------------------------------------------------
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((responseLog, ID) => {
  const headers = [
    'subjID',
    'gender',
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
    responseLog.meta.gender,
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
});


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("d218cf1ebbb5f07312fc")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=task.274555a4fcfd3b858f6c.hot-update.js.map