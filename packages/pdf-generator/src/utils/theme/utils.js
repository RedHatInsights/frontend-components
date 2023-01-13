import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import { DarkBlueColorTheme } from './themes/dark/blue-color-theme';
import { DarkCyanColorTheme } from './themes/dark/cyan-color-theme';
import { DarkGoldColorTheme } from './themes/dark/gold-color-theme';
import { DarkGrayColorTheme } from './themes/dark/gray-color-theme';
import { DarkGreenColorTheme } from './themes/dark/green-color-theme';
import { DarkMultiColorOrderedTheme } from './themes/dark/multi-color-ordered-theme';
import { DarkMultiColorUnorderedTheme } from './themes/dark/multi-color-unordered-theme';
import { DarkOrangeColorTheme } from './themes/dark/orange-color-theme';
import { DarkPurpleColorTheme } from './themes/dark/purple-color-theme';
import { LightBlueColorTheme } from './themes/light/blue-color-theme';
import { LightCyanColorTheme } from './themes/light/cyan-color-theme';
import { LightGoldColorTheme } from './themes/light/gold-color-theme';
import { LightGrayColorTheme } from './themes/light/gray-color-theme';
import { LightGreenColorTheme } from './themes/light/green-color-theme';
import { LightMultiColorOrderedTheme } from './themes/light/multi-color-ordered-theme';
import { LightMultiColorUnorderedTheme } from './themes/light/multi-color-unordered-theme';
import { LightOrangeColorTheme } from './themes/light/orange-color-theme';
import { LightPurpleColorTheme } from './themes/light/purple-color-theme';
import {
  ChartAxisTheme,
  ChartBaseTheme,
  ChartBulletComparativeErrorMeasureTheme,
  ChartBulletComparativeMeasureTheme,
  ChartBulletComparativeWarningMeasureTheme,
  ChartBulletGroupTitleTheme,
  ChartBulletPrimaryDotMeasureTheme,
  ChartBulletPrimaryNegativeMeasureTheme,
  ChartBulletPrimarySegmentedMeasureTheme,
  ChartBulletQualitativeRangeTheme,
  ChartBulletTheme,
  ChartDonutTheme,
  ChartDonutThresholdDynamicTheme,
  ChartDonutThresholdStaticTheme,
  ChartDonutUtilizationDynamicTheme,
  ChartDonutUtilizationStaticTheme,
  ChartThemeColor,
  ChartThemeVariant,
  ChartThresholdTheme,
} from './chartTheme';

// Apply custom properties to base and color themes
export const getCustomTheme = (themeColor, themeVariant, customTheme) => merge(getTheme(themeColor, themeVariant), customTheme);

// Returns axis theme
export const getAxisTheme = (themeColor, themeVariant) => getCustomTheme(themeColor, themeVariant, ChartAxisTheme);

// Returns bullet chart theme
export const getBulletTheme = (themeColor, themeVariant) => getCustomTheme(themeColor, themeVariant, ChartBulletTheme);

// Returns comparative error measure theme for bullet chart
export const getBulletComparativeErrorMeasureTheme = (themeColor, themeVariant) =>
  getCustomTheme(themeColor, themeVariant, ChartBulletComparativeErrorMeasureTheme);

// Returns comparative measure theme for bullet chart
export const getBulletComparativeMeasureTheme = (themeColor, themeVariant) =>
  getCustomTheme(themeColor, themeVariant, ChartBulletComparativeMeasureTheme);

// Returns comparative warning measure theme for bullet chart
export const getBulletComparativeWarningMeasureTheme = (themeColor, themeVariant) =>
  getCustomTheme(themeColor, themeVariant, ChartBulletComparativeWarningMeasureTheme);

// Returns group title theme for bullet chart
export const getBulletGroupTitleTheme = (themeColor, themeVariant) => getCustomTheme(themeColor, themeVariant, ChartBulletGroupTitleTheme);

// Returns primary dot measure theme for bullet chart
export const getBulletPrimaryDotMeasureTheme = (themeColor, themeVariant) =>
  getCustomTheme(themeColor, themeVariant, ChartBulletPrimaryDotMeasureTheme);

// Returns primary negative measure theme for bullet chart
export const getBulletPrimaryNegativeMeasureTheme = (themeColor, themeVariant) =>
  getCustomTheme(themeColor, themeVariant, ChartBulletPrimaryNegativeMeasureTheme);

// Returns primary segmented measure theme for bullet chart
export const getBulletPrimarySegmentedMeasureTheme = (themeColor, themeVariant) =>
  getCustomTheme(themeColor, themeVariant, ChartBulletPrimarySegmentedMeasureTheme);

// Returns qualitative range theme for bullet chart
export const getBulletQualitativeRangeTheme = (themeColor, themeVariant) =>
  getCustomTheme(themeColor, themeVariant, ChartBulletQualitativeRangeTheme);

// Returns donut theme
export const getDonutTheme = (themeColor, themeVariant) => getCustomTheme(themeColor, themeVariant, ChartDonutTheme);

// Returns dynamic donut threshold theme
export const getDonutThresholdDynamicTheme = (themeColor, themeVariant) => {
  const theme = getCustomTheme(themeColor, themeVariant, ChartDonutThresholdDynamicTheme);

  // Merge just the first color of dynamic (blue, green, etc.) with static (grey) for expected colorScale
  theme.legend.colorScale = [theme.pie.colorScale[0], ...ChartDonutThresholdDynamicTheme.legend.colorScale];

  // Merge the threshold colors in case users want to show the unused data
  theme.pie.colorScale = [theme.pie.colorScale[0], ...ChartDonutThresholdStaticTheme.pie.colorScale];
  return theme;
};

// Returns static donut threshold theme
export const getDonutThresholdStaticTheme = (themeColor, themeVariant, invert) => {
  const staticTheme = cloneDeep(ChartDonutThresholdStaticTheme);
  if (invert) {
    staticTheme.pie.colorScale = staticTheme.pie.colorScale.reverse();
  }
  return getCustomTheme(themeColor, themeVariant, staticTheme);
};

// Returns donut utilization theme
export const getDonutUtilizationTheme = (themeColor, themeVariant) => {
  const theme = getCustomTheme(themeColor, themeVariant, ChartDonutUtilizationDynamicTheme);

  // Merge just the first color of dynamic (blue, green, etc.) with static (grey) for expected colorScale
  theme.pie.colorScale = [theme.pie.colorScale[0], ...ChartDonutUtilizationStaticTheme.pie.colorScale];
  theme.legend.colorScale = [theme.legend.colorScale[0], ...ChartDonutUtilizationStaticTheme.legend.colorScale];
  return theme;
};

// Returns dark theme colors
export const getDarkThemeColors = (themeColor) => {
  switch (themeColor) {
    case ChartThemeColor.blue:
      return DarkBlueColorTheme;
    case ChartThemeColor.cyan:
      return DarkCyanColorTheme;
    case ChartThemeColor.gold:
      return DarkGoldColorTheme;
    case ChartThemeColor.gray:
      return DarkGrayColorTheme;
    case ChartThemeColor.green:
      return DarkGreenColorTheme;
    case ChartThemeColor.multi:
    case ChartThemeColor.multiOrdered:
      return DarkMultiColorOrderedTheme;
    case ChartThemeColor.multiUnordered:
      return DarkMultiColorUnorderedTheme;
    case ChartThemeColor.orange:
      return DarkOrangeColorTheme;
    case ChartThemeColor.purple:
      return DarkPurpleColorTheme;
    default:
      return DarkBlueColorTheme;
  }
};

// Returns light theme colors
export const getLightThemeColors = (themeColor) => {
  switch (themeColor) {
    case ChartThemeColor.blue:
      return LightBlueColorTheme;
    case ChartThemeColor.cyan:
      return LightCyanColorTheme;
    case ChartThemeColor.gold:
      return LightGoldColorTheme;
    case ChartThemeColor.gray:
      return LightGrayColorTheme;
    case ChartThemeColor.green:
      return LightGreenColorTheme;
    case ChartThemeColor.multi:
    case ChartThemeColor.multiOrdered:
      return LightMultiColorOrderedTheme;
    case ChartThemeColor.multiUnordered:
      return LightMultiColorUnorderedTheme;
    case ChartThemeColor.orange:
      return LightOrangeColorTheme;
    case ChartThemeColor.purple:
      return LightPurpleColorTheme;
    default:
      return LightBlueColorTheme;
  }
};

// Applies theme color and variant to base theme
export const getTheme = (themeColor, themeVariant) => {
  // Deep clone
  const baseTheme = {
    ...JSON.parse(JSON.stringify(ChartBaseTheme)),
  };
  switch (themeVariant) {
    case ChartThemeVariant.dark:
      return merge(baseTheme, getDarkThemeColors(themeColor));
    case ChartThemeVariant.light:
      return merge(baseTheme, getLightThemeColors(themeColor));
    default:
      return merge(baseTheme, getLightThemeColors(themeColor));
  }
};

// Returns threshold theme
export const getThresholdTheme = (themeColor, themeVariant) => getCustomTheme(themeColor, themeVariant, ChartThresholdTheme);
