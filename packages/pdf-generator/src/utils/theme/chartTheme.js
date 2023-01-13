import { AxisTheme } from './themes/axis-theme';
import { BaseTheme } from './themes/base-theme';
import {
  BulletComparativeErrorMeasureTheme,
  BulletComparativeMeasureTheme,
  BulletComparativeWarningMeasureTheme,
  BulletGroupTitleTheme,
  BulletPrimaryDotMeasureTheme,
  BulletPrimaryNegativeMeasureTheme,
  BulletPrimarySegmentedMeasureTheme,
  BulletQualitativeRangeTheme,
  BulletTheme,
} from './themes/bullet-theme';
import { DonutTheme } from './themes/donut-theme';
import { ThresholdTheme } from './themes/threshold-theme';
import { DonutThresholdDynamicTheme, DonutThresholdStaticTheme } from './themes/donut-threshold-theme';
import { DonutUtilizationDynamicTheme, DonutUtilizationStaticTheme } from './themes/donut-utilization-theme';

/**
 * The color family to be applied to a theme. For example, 'blue' represents an ordered list of colors
 * (i.e., a color scale) composed from the blue color family defined by PatternFly core.
 *
 * For example, the 'blue' color scale looks like:
 *
 * chart_color_blue_100
 * chart_color_blue_200
 * chart_color_blue_300
 * chart_color_blue_400
 * chart_color_blue_500
 *
 * In this case, the chart_color_blue_100 value would be applied to the first data point in a chart.
 * The chart_color_blue_200 value would be applied to the second data point in a chart. And so on...
 *
 * If legend data is provided to a chart, those colors would be synced with the legend as well.
 *
 * The 'multiOrdered' color family is intended for ordered charts; donut, pie, bar, & stack
 * The 'multiUnordered' color family is intended for unordered charts; area & line
 * The 'multi' defaults to the 'multiOrdered' color family
 *
 * Note: These values are not intended to be applied directly as a component's fill style. For example, "multi" would
 * not be a valid fill color. Please use chart variables from PatternFly core (e.g., via the react-charts package)
 */
export const ChartThemeColor = {
  blue: 'blue',
  cyan: 'cyan',
  default: 'blue',
  gold: 'gold',
  gray: 'gray',
  green: 'green',
  multi: 'multi',
  multiOrdered: 'multi-ordered',
  multiUnordered: 'multi-unordered',
  orange: 'orange',
  purple: 'purple',
};

/**
 * The variant to be applied to a theme.
 *
 * Note: Only the light variant is currently supported
 */
export const ChartThemeVariant = {
  dark: 'dark',
  default: 'light',
  light: 'light',
};

export const ChartAxisTheme = AxisTheme;
export const ChartBaseTheme = BaseTheme;
export const ChartBulletComparativeErrorMeasureTheme = BulletComparativeErrorMeasureTheme;
export const ChartBulletComparativeMeasureTheme = BulletComparativeMeasureTheme;
export const ChartBulletComparativeWarningMeasureTheme = BulletComparativeWarningMeasureTheme;
export const ChartBulletGroupTitleTheme = BulletGroupTitleTheme;
export const ChartBulletPrimaryDotMeasureTheme = BulletPrimaryDotMeasureTheme;
export const ChartBulletPrimaryNegativeMeasureTheme = BulletPrimaryNegativeMeasureTheme;
export const ChartBulletPrimarySegmentedMeasureTheme = BulletPrimarySegmentedMeasureTheme;
export const ChartBulletTheme = BulletTheme;
export const ChartBulletQualitativeRangeTheme = BulletQualitativeRangeTheme;
export const ChartDonutUtilizationDynamicTheme = DonutUtilizationDynamicTheme;
export const ChartDonutUtilizationStaticTheme = DonutUtilizationStaticTheme;
export const ChartDonutTheme = DonutTheme;
export const ChartDonutThresholdDynamicTheme = DonutThresholdDynamicTheme;
export const ChartDonutThresholdStaticTheme = DonutThresholdStaticTheme;
export const ChartThresholdTheme = ThresholdTheme;
