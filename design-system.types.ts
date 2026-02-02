// Design System Type Definitions

export type ColorToken = 
  | 'neutral-0' | 'neutral-50' | 'neutral-100' | 'neutral-200' | 'neutral-300'
  | 'neutral-400' | 'neutral-500' | 'neutral-600' | 'neutral-700' | 'neutral-800'
  | 'neutral-900' | 'neutral-950'
  | 'brand-50' | 'brand-100' | 'brand-200' | 'brand-300' | 'brand-400'
  | 'brand-500' | 'brand-600' | 'brand-700' | 'brand-800' | 'brand-900'
  | 'gray-50' | 'gray-100' | 'gray-200' | 'gray-300' | 'gray-400'
  | 'gray-500' | 'gray-600' | 'gray-700' | 'gray-800' | 'gray-900'
  | 'error-50' | 'error-100' | 'error-200' | 'error-300' | 'error-400'
  | 'error-500' | 'error-600' | 'error-700' | 'error-800' | 'error-900'
  | 'warning-50' | 'warning-100' | 'warning-200' | 'warning-300' | 'warning-400'
  | 'warning-500' | 'warning-600' | 'warning-700' | 'warning-800' | 'warning-900'
  | 'success-50' | 'success-100' | 'success-200' | 'success-300' | 'success-400'
  | 'success-500' | 'success-600' | 'success-700' | 'success-800' | 'success-900';

export type SemanticColor = 
  | 'background' | 'foreground' | 'card' | 'card-foreground'
  | 'primary' | 'primary-foreground' | 'secondary' | 'secondary-foreground'
  | 'muted' | 'muted-foreground' | 'accent' | 'accent-foreground'
  | 'destructive' | 'destructive-foreground' | 'border' | 'input' | 'ring';

export type BorderRadius = 
  | 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

export type Spacing = 
  | '0' | '0.5' | '1' | '1.5' | '2' | '2.5' | '3' | '4' | '5' | '6'
  | '8' | '10' | '12' | '16' | '20' | '24';

export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

export type LineHeight = 'tight' | 'normal' | 'relaxed' | 'loose' | 'extra-loose';

export type Shadow = 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl';

export type TypographyVariant = 
  | 'body' | 'body-bold' | 'label' | 'subheader' | 'section-header' | 'header';

// Design System Constants
export const DESIGN_SYSTEM = {
  colors: {
    primitives: {
      neutral: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      brand: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      gray: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      error: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      warning: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      success: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
  spacing: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
  radius: ['none', 'sm', 'default', 'md', 'lg', 'xl', '2xl', '3xl', 'full'],
  shadows: ['sm', 'default', 'md', 'lg', 'xl', '2xl'],
} as const;