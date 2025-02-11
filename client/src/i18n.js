"use strict";

var _interopRequireDefault = require("C:/Users/cleme/Desktop/sae/sae-bibliotheque-jeux/client/node_modules/@babel/runtime/helpers/interopRequireDefault.js")["default"];
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _i18next = _interopRequireDefault(require("i18next"));
var _reactI18next = require("react-i18next");
var _en = _interopRequireDefault(require("./locales/en.json"));
var _fr = _interopRequireDefault(require("./locales/fr.json"));
var _de = _interopRequireDefault(require("./locales/de.json"));
var _es = _interopRequireDefault(require("./locales/es.json"));
// Ton fichier de traduction anglais
// Ton fichier de traduction français
// Ton fichier de traduction allemand
// Ton fichier de traduction espagnol

_i18next["default"].use(_reactI18next.initReactI18next).init({
  resources: {
    en: {
      translation: _en["default"]
    },
    fr: {
      translation: _fr["default"]
    },
    de: {
      translation: _de["default"]
    },
    es: {
      translation: _es["default"]
    }
  },
  lng: 'fr',
  // Langue par défaut
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false
  }
});
var _default = exports["default"] = _i18next["default"];