# MultiSelect repeats native form values

MultiSelect keeps selected values in visible removable tags while the input remains a temporary search query. Each selected ID is represented by its own hidden input with the same `name`, matching ordinary HTML repeated-key form submission.

The listbox marks selected options without hiding them. Disabled and read-only states keep values readable and remove mutation controls; native reset restores the initial selected set.
