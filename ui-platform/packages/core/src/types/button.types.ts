/**
 * Shared Button Types for cross-framework compatibility
 * Source of truth for all button component variations
 * Located in core package for single source of truth
 */

// Button variant types - shadcn/ui inspired
export type ButtonVariant =
  | 'default'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'secondary'
  | 'link';

// Button size types - includes icon variants
export type ButtonSize =
  | 'default'
  | 'xs'
  | 'sm'
  | 'lg'
  | 'icon'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-lg';

// Button rounded/border-radius types
export type ButtonRounded =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'full';

// Button event detail type
export interface ButtonEventDetail {
  timestamp: number;
  variant: ButtonVariant;
}

// Button base props interface (shared across all frameworks)
export interface ButtonBaseProps {
  variant: ButtonVariant;
  size: ButtonSize;
  rounded: ButtonRounded;
  disabled: boolean;
  loading: boolean;
  fullWidth: boolean;
  asChild: boolean;
  animated: boolean;
}

// Default button configuration
export const BUTTON_DEFAULTS: ButtonBaseProps = {
  variant: 'default',
  size: 'default',
  rounded: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  asChild: false,
  animated: false,
};

// CVA-style variant configuration for TailwindCSS
export const buttonVariants = {
  base: [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'whitespace-nowrap',
    'font-medium',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    '[&_svg]:pointer-events-none',
    '[&_svg]:size-4',
    '[&_svg]:shrink-0',
  ],
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-10 px-4 py-2',
      xs: 'h-7 px-2 text-xs',
      sm: 'h-9 px-3',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
      'icon-xs': 'h-7 w-7',
      'icon-sm': 'h-9 w-9',
      'icon-lg': 'h-11 w-11',
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      full: 'rounded-full',
    },
    animated: {
      'true': 'active:translate-y-[2px] active:scale-[0.98] transition-transform duration-150 ease-out',
      'false': '',
    },
    loading: {
      'true': 'relative cursor-wait',
      'false': '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    rounded: 'md',
    animated: false,
    loading: false,
  },
} as const;

// Helper type for computing button classes
export type ButtonClassVariant = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  animated?: boolean;
  loading?: boolean;
};

/**
 * CVA-style class generator utility
 * Generates class strings based on variant configuration
 */
export function computeButtonClasses(props: ButtonClassVariant): string {
  const { base, variants } = buttonVariants;

  // Get variant classes
  const variantClass = variants.variant[props.variant || 'default'];
  const sizeClass = variants.size[props.size || 'default'];
  const roundedClass = variants.rounded[props.rounded || 'md'];
  const animatedClass = variants.animated[(props.animated ? 'true' : 'false') as 'true' | 'false'];
  const loadingClass = variants.loading[(props.loading ? 'true' : 'false') as 'true' | 'false'];

  // Combine all classes
  return [
    ...base,
    variantClass,
    sizeClass,
    roundedClass,
    animatedClass,
    loadingClass,
  ]
    .filter(Boolean)
    .join(' ');
}
