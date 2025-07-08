# 🎮 Barotrauma Circuits

A visual circuit design and simulation tool inspired by Barotrauma's electrical system, built with Vue.js and modern web technologies.

## 📖 Overview

Barotrauma Circuits is an interactive web application that allows users to design, build, and test electrical circuits using a drag-and-drop interface. The application features a comprehensive library of components including mathematical operations, logical gates, signal processing, and specialized tools.

## ✨ Features

### 🧩 **Component Library**
- **Mathematical Components**: Addition, subtraction, multiplication, division, modulo, exponentiation, factorial
- **Trigonometric Functions**: Sin, Cos, Tan, Asin, Acos, Atan
- **Mathematical Operations**: Abs, Ceil, Floor, Round, Square Root
- **Logical Components**: AND, OR, XOR, NOT, Equals, Greater Than
- **Signal Processing**: Delay, Memory, Oscillator, RegEx, Signal Check
- **Specialized Components**: Color, Concatenation, Relay, WiFi
- **Selector Components**: Input Selector (10 inputs), Output Selector (10 outputs)
- **Tool Components**: Constant, Display, Light, Random

### 🎯 **Core Functionality**
- **Visual Circuit Design**: Drag-and-drop component placement
- **Real-time Simulation**: Live signal propagation through circuits
- **Interactive Wiring**: Click-to-connect wire system with visual feedback
- **Component Configuration**: In-panel settings for component parameters
- **Responsive Design**: Works on desktop and tablet devices
- **Undo/Redo**: Circuit modification history
- **Save/Load**: Circuit persistence and sharing

### 🛠 **Developer Features**
- **Comprehensive Testing**: Unit tests and end-to-end Cypress tests
- **Modular Architecture**: Component-based Vue.js structure
- **Type Safety**: TypeScript support for better development experience
- **Hot Reload**: Fast development with Vite
- **Code Coverage**: Detailed test coverage reporting

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/barotrauma-circuits.git
   cd barotrauma-circuits
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to access the application

## 🎮 Usage

### Basic Circuit Design

1. **Add Components**
   - Scroll through the component tray at the bottom
   - Click on a component to select it
   - Click on the circuit board to place it

2. **Connect Components**
   - Click on a component's input/output pin
   - Click on another component's corresponding pin to create a wire
   - Wires automatically route around components

3. **Configure Components**
   - Click on a component to open its configuration panel
   - Adjust settings like values, frequencies, or output types
   - Changes apply immediately to the circuit

4. **Test Your Circuit**
   - Use Constant components to provide input signals
   - Use Display components to view output values
   - Use Light components for visual feedback

### Advanced Features

- **Component Selection**: Click and drag to select multiple components
- **Wire Management**: Ctrl+click on wires to add waypoints
- **Circuit Navigation**: Middle mouse to pan, scroll to zoom
- **Component Deletion**: Select components and press Delete

## 🧪 Testing

### Running Tests

```bash
# Run unit tests
npm run test

# Run unit tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Run specific e2e test
npm run test:e2e -- --spec cypress/e2e/component_name_interaction.cy.js
```

### Test Structure

- **Unit Tests**: Located in `tests/unit/` - Test individual component logic
- **E2E Tests**: Located in `cypress/e2e/` - Test full user interactions
- **Test Coverage**: Aim for 100% coverage on core components

### Testing Progress

See [E2E_TESTING_PROGRESS.md](./E2E_TESTING_PROGRESS.md) for detailed testing status and progress tracking.

## 🏗 Project Structure

```
barotrauma-circuits/
├── src/
│   ├── components/
│   │   ├── circuit/           # Circuit components
│   │   │   ├── tools/         # Tool components (Constant, Display, etc.)
│   │   │   └── *.vue          # Regular circuit components
│   │   ├── ui/                # UI components
│   │   └── *.vue              # Main app components
│   ├── stores/                # Pinia stores
│   ├── utils/                 # Utility functions
│   └── main.js                # App entry point
├── tests/
│   └── unit/                  # Unit tests
├── cypress/
│   └── e2e/                   # End-to-end tests
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run unit tests
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run e2e tests
npm run test:e2e:open    # Open Cypress UI

# Linting
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues

# Type checking
npm run type-check       # Run TypeScript type checking
```

### Adding New Components

1. **Create Component File**
   ```bash
   # Create new component in src/components/circuit/
   touch src/components/circuit/NewComponent.vue
   ```

2. **Follow Component Template**
   ```vue
   <template>
     <!-- Tray Version (Graphical) -->
     <div v-if="mode === 'tray'" class="component graphical" data-component-type="newcomponent">
       <ComponentPins class="pins-in" :count="1" />
       <div class="icon-container">
         <div class="component-icon-sprite icon-newcomponent" />
         <div class="component-name">New Component</div>
       </div>
       <ComponentPins class="pins-out" :count="1" />
     </div>

     <!-- Board Version (Text-based) -->
     <div v-else class="component text-based" data-component-type="newcomponent" :id="props.id">
       <div class="component-header">New Component</div>
       <div class="component-body">
         <div class="component-pin in" data-pin-name="SIGNAL_IN">
           <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_IN', $event)"></div>
           <div class="pin-circle"></div>
           <span>SIGNAL_IN</span>
         </div>
         <div class="component-pin out" data-pin-name="SIGNAL_OUT">
           <span>SIGNAL_OUT</span>
           <div class="new-wire-zone" @mousedown.stop @click.stop="handleWirePinClick(circuit, props.id, 'SIGNAL_OUT', $event)"></div>
           <div class="pin-circle"></div>
         </div>
       </div>
     </div>
   </template>

   <script setup>
   import { useCircuitStore } from '../../stores/circuit'
   import ComponentPins from '../ComponentPins.vue'
   import { handleWirePinClick } from '../../utils/wiringHandlers'

   const props = defineProps({
     id: String,
     mode: {
       type: String,
       default: 'board'
     }
   })

   const circuit = useCircuitStore()
   </script>
   ```

3. **Add to Component Tray**
   - Import in `src/components/ComponentTray.vue`
   - Add to `trayComponents` array

4. **Create Processor**
   - Add processor logic in `src/processors/`
   - Implement signal handling

5. **Add Tests**
   - Create unit tests in `tests/unit/`
   - Create e2e tests in `cypress/e2e/`

### Code Style

- **Indentation**: 2 spaces
- **Semicolons**: Disabled
- **Quotes**: Single quotes
- **Component Naming**: PascalCase
- **File Naming**: PascalCase for components, camelCase for utilities

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run the test suite**
   ```bash
   npm run test
   npm run test:e2e
   ```
6. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
7. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Development Guidelines

- **Test Coverage**: Maintain high test coverage (aim for 100% on core components)
- **Documentation**: Update README and add inline comments for complex logic
- **Performance**: Consider performance implications of new features
- **Accessibility**: Ensure components are accessible and keyboard navigable

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Barotrauma**: Inspiration for the electrical system design
- **Vue.js**: Frontend framework
- **Vite**: Build tool and development server
- **Cypress**: End-to-end testing framework
- **Pinia**: State management

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/barotrauma-circuits/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/barotrauma-circuits/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/barotrauma-circuits/wiki)

---

**Happy Circuit Building!** 🎮⚡ 
