(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("urijs"));
	else if(typeof define === 'function' && define.amd)
		define("CloudServicesComponentsremediationsApi", ["urijs"], factory);
	else if(typeof exports === 'object')
		exports["CloudServicesComponentsremediationsApi"] = factory(require("urijs"));
	else
		root["CloudServicesComponentsremediationsApi"] = factory(root["urijs"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_urijs__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/api/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!*********************************************************************************************************************************!*\
  !*** /home/khala/Documents/git/RedHatInsights/frontend-components/node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \*********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),

/***/ "./src/api/index.js":
/*!**************************!*\
  !*** ./src/api/index.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRemediation = createRemediation;
exports.patchRemediation = patchRemediation;
exports.getRemediations = getRemediations;
exports.getRemediation = getRemediation;
exports.getResolutionsBatch = getResolutionsBatch;

var _urijs = _interopRequireDefault(__webpack_require__(/*! urijs */ "urijs"));

var API_BASE = '/api/remediations/v1';

function checkResponse(r) {
  if (!r.ok) {
    var error = new Error("Unexpected response code ".concat(r.status));
    error.statusCode = r.status;
    throw error;
  }

  return r;
}

function json(r) {
  checkResponse(r);
  return r.json();
}

var headers = Object.freeze({
  'Content-Type': 'application/json; charset=utf-8'
});

function createRemediation(data) {
  var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : API_BASE;
  var uri = new _urijs.default(API_BASE).segment('remediations').toString();
  return fetch(uri, {
    headers: headers,
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(json);
}

function patchRemediation(id, data) {
  var base = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : API_BASE;
  var uri = new _urijs.default(API_BASE).segment('remediations').segment(id).toString();
  return fetch(uri, {
    headers: headers,
    credentials: 'include',
    method: 'PATCH',
    body: JSON.stringify(data)
  }).then(checkResponse);
}

function getRemediations() {
  var basePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : API_BASE;
  var uri = new _urijs.default(API_BASE).segment('remediations').query({
    limit: 200
  }).toString();
  return fetch(uri, {
    credentials: 'include'
  }).then(json);
}

function getRemediation(id) {
  var basePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : API_BASE;
  var uri = new _urijs.default(API_BASE).segment('remediations').segment(id).toString();
  return fetch(uri, {
    credentials: 'include'
  }).then(json);
}

function getResolutionsBatch(issues) {
  var basePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : API_BASE;
  var uri = new _urijs.default(API_BASE).segment('resolutions').toString();
  return fetch(uri, {
    headers: headers,
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify({
      issues: issues
    })
  }).then(json);
}

/***/ }),

/***/ "urijs":
/*!************************!*\
  !*** external "urijs" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_urijs__;

/***/ })

/******/ });
});