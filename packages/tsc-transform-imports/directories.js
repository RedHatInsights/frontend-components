"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICONS_DIRECTORIES = exports.CORE_DIRECTORIES = void 0;
exports.findFirstGlob = findFirstGlob;
var path_1 = __importDefault(require("path"));
var glob = __importStar(require("glob"));
var MODULES_ROOT = process.env.MODULES_ROOT;
var PACKAGES_ROOT = path_1.default.resolve(process.cwd(), 'packages');
exports.CORE_DIRECTORIES = [
    glob.sync("".concat(process.cwd(), "/node_modules/@patternfly/react-core")),
    glob.sync("".concat(PACKAGES_ROOT, "/*/node_modules/@patternfly/react-core")),
].flat();
exports.ICONS_DIRECTORIES = [
    glob.sync("".concat(process.cwd(), "/node_modules/@patternfly/react-icons")),
    glob.sync("".concat(PACKAGES_ROOT, "/*/node_modules/@patternfly/react-icons")),
].flat();
if (MODULES_ROOT) {
    MODULES_ROOT.split(',').forEach(function (root) {
        exports.CORE_DIRECTORIES.push.apply(exports.CORE_DIRECTORIES, glob.sync("".concat(path_1.default.resolve(__dirname, root), "/node_modules/@patternfly/react-core").replace(/\/\//, '/')));
        exports.ICONS_DIRECTORIES.push.apply(exports.ICONS_DIRECTORIES, glob.sync("".concat(path_1.default.resolve(__dirname, root), "/node_modules/@patternfly/react-icons").replace(/\/\//, '/')));
    });
}
function findFirstGlob(roots, suffix, filter) {
    var adjustedSuffix = suffix.startsWith('/') ? suffix.substring(1) : suffix;
    return roots.flatMap(function (root) {
        var found = glob.sync("".concat(root, "/").concat(adjustedSuffix));
        return filter !== undefined ? found.filter(filter) : found;
    })[0];
}
//# sourceMappingURL=directories.js.map