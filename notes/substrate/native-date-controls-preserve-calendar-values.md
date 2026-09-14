# Native date controls preserve calendar values

The Astro date-picker batch uses native `input[type="date"]` controls. Browsers provide calendar opening, typed segments, keyboard movement, min/max validation, reset behavior, and ISO `YYYY-MM-DD` form values without requiring a timezone-bearing JavaScript `Date`.

DateRangePicker composes two named native date inputs. A small browser script adds the compound rules that HTML cannot express alone: both endpoints must be present together, start must not follow end, and a serialized unavailable date cannot occur inside the inclusive range.
