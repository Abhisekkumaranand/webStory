# TODO: Add Cancel Button and Loading State to EditStory

- [x] Add a new state variable `loading` (boolean) to track saving status.
- [x] In handleUpdate, set loading to true at the start and false at the end (in both try and catch blocks).
- [x] Update the "Save" button to show "Saving..." text and disable it when loading is true.
- [x] Add a "Cancel" button next to the "Save" button that navigates back to "/admin" immediately.
