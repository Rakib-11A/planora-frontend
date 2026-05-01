# Apex Card System

A robust, responsive card system with guaranteed uniform height and pixel-perfect layout stability.

## Components

### 1. `ApexCard` (in `card.tsx`)
The main card component with uniform height enforcement.

### 2. `CardSkeleton` (in `card-skeleton.tsx`)
Skeleton loader that mimics the exact anatomy of `ApexCard`.

### 3. `ListingGrid` (in `listing-grid.tsx`)
Responsive grid wrapper with built-in loading and empty states.

---

## Architecture: How We Solve the "Same Height" Problem

The key to uniform card heights is a **three-layer strategy**:

### Layer 1: CSS Grid (Parent)
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```
- Grid cells have **equal height** by default
- Each cell expands to match the tallest cell in the row

### Layer 2: Flex-col + h-full (Card Container)
```tsx
<div className="flex h-full flex-col">
```
- Card fills the entire grid cell vertically
- `flex-col` allows internal sections to stack

### Layer 3: Line Clamping (Content)
```tsx
<h3 className="line-clamp-2">Title</h3>
<p className="line-clamp-3">Description</p>
```
- Prevents long text from pushing content down
- Title: max 2 lines
- Description: max 3 lines

### Layer 4: mt-auto (CTA Button)
```tsx
<div className="mt-auto">
  <Button>View Details</Button>
</div>
```
- Pushes the CTA to the bottom of the card
- Ensures all buttons align across the row

---

## Visual Test

**Question:** "If I add a title with 10 words to one card and 2 words to another, will the cards still be the same height?"

**Answer:** **Yes.** Here's why:

1. Grid cells are equal height (CSS Grid behavior)
2. Cards fill grid cells completely (`h-full`)
3. Title clamps to 2 lines regardless of word count
4. Description clamps to 3 lines regardless of length
5. CTA button uses `mt-auto` to stay at bottom

The card height is determined by the **grid row height**, not the content length.

---

## Usage Example

### Basic Usage

```tsx
import { ListingGrid, ApexCard } from '@/components/ui';

function EventsPage({ events, isLoading }: { events: Event[]; isLoading: boolean }) {
  return (
    <ListingGrid<Event>
      items={events}
      isLoading={isLoading}
      renderItem={(event) => (
        <ApexCard event={event} priority={events.indexOf(event) < 4} />
      )}
      getKey={(event) => event.id}
      emptyMessage="No events found"
      emptyCTALabel="Browse all events"
      emptyCTAHref="/events"
      skeletonCount={8}
    />
  );
}
```

### With Header

```tsx
import { ListingGrid, ListingGridHeader, ApexCard } from '@/components/ui';

function EventsSection({ events }: { events: Event[] }) {
  return (
    <section>
      <ListingGridHeader
        title="Upcoming Events"
        subtitle="Discover and join events in your community"
        action={
          <Button variant="outline" asChild>
            <Link href="/events">View All</Link>
          </Button>
        }
      />
      <ListingGrid
        items={events}
        renderItem={(event) => <ApexCard event={event} />}
        getKey={(event) => event.id}
      />
    </section>
  );
}
```

### Manual Grid (More Control)

```tsx
import { ApexCard, CardSkeleton } from '@/components/ui';

function CustomGrid({ events, isLoading }: { events: Event[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {events.map((event, index) => (
        <ApexCard
          key={event.id}
          event={event}
          priority={index < 4} // Prioritize first 4 images
        />
      ))}
    </div>
  );
}
```

---

## Responsive Breakpoints

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Mobile (<640px) | 1 | 16px (gap-4) |
| Tablet (640-1024px) | 2 | 16px (gap-4) |
| Desktop (≥1024px) | 4 | 24px (gap-6) |

---

## Image Handling

The card uses `next/image` with a fallback strategy:

```tsx
<Image
  src={`/images/events/${event.id}.jpg`}
  alt={event.title}
  fill
  className="object-cover"
  onError={(e) => {
    // Hide broken image
    e.currentTarget.style.display = 'none';
    // Add gradient background to parent
    const parent = e.currentTarget.parentElement;
    if (parent) {
      parent.classList.add('bg-gradient-to-br', 'from-primary/20', 'via-primary/10', 'to-surface-subtle');
    }
  }}
/>
```

If the image fails to load:
1. The `<Image>` element is hidden
2. A subtle gradient background is applied
3. The card still looks polished

---

## Line Clamping

Tailwind's `line-clamp` utility uses CSS `-webkit-line-clamp`:

```css
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

This ensures text is truncated with an ellipsis (`...`) after the specified number of lines.

---

## Skeleton Loader Strategy

### Why Skeletons?

1. **Prevents Layout Shift (CLS)**: Skeletons occupy the exact same space as real cards
2. **Better UX**: Users see the layout structure while data loads
3. **Perceived Performance**: Feels faster than a blank spinner

### How Many Skeletons?

Render **8-12 skeleton cards** while loading:

```tsx
<CardSkeletonGrid count={8} />
```

This matches the typical initial page size and prevents layout shift when real data arrives.

---

## Accessibility

- Cards use `<Link>` with `aria-label` for screen readers
- Skeleton grid has `aria-busy="true"` and `role="status"`
- Empty state has `aria-live="polite"`
- Focus rings follow Apex spec (2px outline, offset)

---

## Performance

1. **Image Priority**: Use `priority` prop on first 4 cards for LCP optimization
2. **Responsive Sizes**: `sizes` prop tells Next.js how to serve images
3. **Skeleton Reuse**: Skeletons are lightweight and don't cause reflows

```tsx
<ApexCard event={event} priority={index < 4} />
```

---

## Design System Compliance

| Spec Section | Token | Usage |
|--------------|-------|-------|
| §2A | `--color-surface` | Card background |
| §2A | `--color-border` | Card border |
| §3 | `.text-h4` | Card title |
| §3 | `.text-body-r` | Card description |
| §3 | `.text-caption` | Meta information |
| §5A | `rounded-md` (8px) | Card radius |
| §5A | `shadow-low` | Card shadow |
| §6 | `animate-pulse` | Skeleton animation |

---

## Troubleshooting

### Cards Have Different Heights

**Check:**
1. Parent uses `grid` with defined columns
2. Card has `flex h-full flex-col`
3. CTA button has `mt-auto`

### Text Overflow Breaking Layout

**Check:**
1. Title has `line-clamp-2`
2. Description has `line-clamp-3`
3. Location/organizer have `truncate`

### Skeleton Doesn't Match Card Height

**Check:**
1. Skeleton has same structure as card
2. Image placeholder has `h-48` (same as card)
3. All sections mirror the real card anatomy

---

## Future Enhancements

- [ ] Add `variant` prop for different card styles (compact, featured)
- [ ] Add `quickActions` prop for inline actions
- [ ] Add `badge` prop for corner ribbons
- [ ] Add `videoPreview` support for hover playback
