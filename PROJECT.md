# Barotrauma Circuit Simulator

This project aims to create a web-based simulator for Barotrauma's circuit boards, built with Vue.js and Pinia.

## Tech Stack

- **Framework**: [Vue.js](https://vuejs.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Bootstrap](https://getbootstrap.com/)

## Roadmap

### Phase 1: Basic Setup & UI

*   [x] Initialize project structure (Vite, Vue.js).
*   [x] Integrate Bootstrap for styling.
*   [x] Create the main circuit board area.
*   [x] Create the component tray at the bottom.
*   [x] Create `PROJECT.md` to track progress.

### Phase 2: Components

*   [x] Create "Constant" component visual representation.
*   [x] Create "Random" component visual representation.
*   [x] Create "Add" component visual representation.

### Phase 3: Interactivity

*   [x] Implement drag-and-drop from tray to the board.
*   [x] Allow moving components on the board.
*   [x] Define component inputs and outputs (pins).
*   [x] Implement connecting components with wires.
*   [x] Allow selecting components and wires.
*   [x] Allow deleting selected components and wires.
*   [x] Allow adding waypoints to wires for better organization.

### Phase 4: Refinements & Bugfixes
*   [x] Refactor state management to use Pinia.
*   [x] Fix component "jumping" issue on add/move by implementing a ghost component preview.

### Phase 5: Simulation

*   [ ] Implement the logic for the "Constant" component.
*   [ ] Implement the logic for the "Random" component.
*   [ ] Implement the logic for the "Add" component.
*   [ ] Create a simulation loop to propagate signals. 
