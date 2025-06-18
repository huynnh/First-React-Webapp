# Smart Scheduler

A modern task and calendar management application built with React and Tailwind CSS.

## Features

- Task management with priorities and due dates
- Calendar view with day, week, and month views
- Event scheduling and management
- AI Assistant with voice commands
- Dark mode support
- Responsive design for all devices
- Real-time notifications

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-scheduler
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build files will be created in the `build` directory.

## Technologies Used

- React 18
- Tailwind CSS
- Font Awesome
- Day.js for date manipulation
- Marked.js for Markdown parsing
- Web Speech API for voice commands

## Project Structure

```
src/
  ├── components/
  │   ├── TaskList.js
  │   ├── Calendar.js
  │   ├── AIAssistant.js
  │   └── NotificationPanel.js
  ├── App.js
  ├── index.js
  └── index.css
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
