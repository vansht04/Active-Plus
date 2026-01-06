# Active+
Active+
Overview
A fitness application that allows users to track their workouts by managing exercises. The application provides full functionality to all users without requiring any authentication, operating entirely with local storage for data persistence.

User Profile Setup
Users can set a temporary name that is stored locally for personalization throughout the application
Name entry is optional and users can proceed to use the application without setting a name
Users with no name set can access all features of the application
User Profile Management
Users can update and change their name in their profile after it has been initially set
Users can upload and change their profile picture through the profile interface
Profile pictures are stored locally in the browser
Profile editing interface allows users to modify their stored name and profile picture
Name changes are immediately reflected throughout the application interface
Theme toggle control is located within the user profile section for changing between light and dark themes
Users can access their theme preference settings directly from their profile interface
Theme preference changes made in the profile are immediately applied and saved locally
Dark Mode Theme Support
Dark mode is the default theme for all users throughout the entire application
Users can toggle between light and dark themes using the theme toggle control located in their profile section
Theme preference is stored locally in the browser
Theme preference persists across browser sessions on the same device
New users start with dark mode as their default theme unless they change it to light mode
All interface elements adapt to the selected theme including navigation, forms, modals, and content areas
When switching to light mode, the theme preference is immediately saved locally
Theme changes are persistent and correctly applied after page reload
Light mode theme is properly applied to all interface elements when selected, ensuring complete visual consistency across the entire application
Default Exercise Library
When a user first uses the application, a default set of exercises is automatically added to their personal exercise library
Default exercises include: Push-ups (Strength), Squats (Strength), Plank (Strength), Jumping Jacks (Cardio), and Lunges (Strength)
These exercises are added to the user's personal collection during the initial application setup
Default exercises become part of the user's personal exercise library and can be modified or deleted like any other personal exercise
Default exercises are stored locally
Core Features
Exercise Management
Add new exercises with basic details (name, type, description) to personal collection
Exercise creation functionality provides dynamic feedback when exercises are successfully added
Exercise types include "Strength" and "Cardio"
Remove existing exercises from personal collection
View list of personal exercises
New users start with default exercise collection
All exercise data is stored locally
Workout Tracking
Create new workout sessions using personal exercises
Add exercises from personal library to workout sessions during initial creation
Add additional exercises to existing workouts over time, allowing workouts to be built progressively
When new exercises are added to an existing workout, they are immediately stored locally
Updated workouts correctly include all previously added exercises plus any newly added exercises
For each exercise added to a workout, record performance data based on exercise type:
Strength exercises: Record target number of reps and target number of sets planned, plus actual number of sets completed during workout execution
Cardio exercises: Record duration in minutes performed
Each exercise within a workout can be edited for reps, sets, and completion status
Exercise completion status options include "in progress," "finished," and "finished without completing all"
Individual exercises can be marked with different completion statuses using dropdown or selection controls
Individual exercise completion status is stored locally
All workout and exercise performance data including actual sets completed is stored locally
View personal workouts with performance data for each exercise
Delete individual workouts from personal workout collection
Edit both premade and custom workouts with full editing capabilities
Strength Exercise Performance Tracking
For strength exercises, users can directly enter and update the actual number of sets completed using an input field displayed inline within the workout interface
The actual sets completed input field is always visible for each strength exercise without requiring any edit button clicks
Users can type directly into the actual sets completed field and the value is automatically saved locally
Each strength exercise in a workout has its own independent actual sets completed input field that can be updated separately from other exercises
Real-time saving ensures that actual sets completed data is immediately stored locally without requiring manual save actions
Actual sets completed data persists across sessions in local storage
Workouts display both target sets and actual sets completed for strength exercises
Workout Editing
Each exercise within a workout can be edited for reps, sets, and completion status
Exercise editing interface allows modification of target reps and target sets for strength exercises
Exercise editing interface allows modification of duration for cardio exercises
Completion status can be changed between "in progress," "finished," and "finished without completing all"
Both premade and custom workouts can be fully edited
Exercise modifications within workouts are immediately saved and persisted locally
Workout Copying
Copy existing workouts to create new workout sessions
When copying any workout, all exercises from the original workout are included in the new workout, regardless of their completion status in the original workout
Copied workouts are created as new workout sessions with all exercises marked as incomplete
Performance data from the original workout is copied to the new workout including reps and target sets for strength exercises and duration for cardio exercises
Actual sets completed values are reset to empty/zero in the copied workout
Users can copy any of their own workouts from their workout collection
The copy function creates a completely new workout session that can be modified independently
Real-time Workout Status Updates
When an exercise is marked as complete or incomplete within a workout view, the interface automatically refreshes to display the updated completion status
The workout view immediately shows the current completion status of each individual exercise after any status change
The overall workout completion status is automatically updated and displayed in real-time when exercise completion states change
No manual page refresh is required to see updated completion statuses
Exercise Completion Button States
When a completion status change button for an exercise is clicked, a loading spinner is displayed on that specific button
While the completion action is processing, all other completion buttons for exercises within the same workout are disabled
The disabled state prevents users from clicking other completion buttons until the current action finishes
Once the completion action finishes successfully or with an error, all buttons return to their normal enabled state
The spinner is removed from the clicked button after the action completes
This prevents multiple simultaneous completion requests and provides clear visual feedback during processing
Homepage
Homepage serves as the main landing page that explains how to use the Active+ application
Homepage content includes step-by-step instructions for:
Creating and managing workouts
Adding and editing exercises in personal library
Tracking workout progress and performance data
Managing profile settings including profile picture upload
Understanding exercise types (Strength vs Cardio) and their tracking methods
Homepage integrates the Active+ logo and maintains consistent branding throughout
Homepage follows the same flat design principles and theme support as the rest of the application
Homepage displays in the user's selected theme (dark mode by default)
Homepage includes the copyright footer "© 2026 - Vansh." consistent with the application's branding
Homepage content is written in English and provides clear, user-friendly guidance
Local Data Storage
User Profile: Store user name, profile picture, and dark mode theme preferences locally with dark mode as default
Personal Exercises: Store user-specific exercise information with exercise type (Strength or Cardio) locally
Workouts: Store workout sessions with associated exercises, completion timestamps, comprehensive performance data (reps and sets for strength exercises, duration in minutes for cardio exercises), actual sets completed for strength exercises, and overall workout completion status locally
Exercise Performance Records: Store detailed performance data for each exercise within workouts, including reps, target sets, actual sets completed for strength exercises with independent storage per exercise, duration values linked to specific exercises and workout sessions, and individual completion status for each exercise with support for "in progress," "finished," and "finished without completing all" statuses locally
Default Exercises: Initialize template exercises in local storage for new users with appropriate exercise types
Profile Pictures: Store user profile pictures locally with proper file handling and retrieval
User Interface
Main fitness tracking interface accessible to all users without any authentication requirements
Profile editing interface allowing users to update their name, upload/change profile picture, and change their theme preference using the theme toggle control
Profile picture upload interface with file selection and preview capabilities
Theme toggle control is integrated within the user profile section for easy access to theme settings
All interface elements adapt to selected theme including backgrounds, text colors, borders, and interactive elements
Dark mode is applied by default to all interface elements including homepage and main application
Light mode is correctly applied throughout the entire application when selected, with proper styling for all interface elements
Theme changes are immediately reflected across all application components and persist after page reload
Light theme is fully implemented and properly applied to all interface components when selected
Exercise library page showing personal exercises with their types
Exercise creation form with dynamic UI feedback for successful exercise creation including immediate list updates
Workout creation interface for building personal workout sessions with access to personal exercises
Workout editing interface allowing users to add additional exercises to existing workouts over time with proper persistence
Exercise editing interface within workouts allowing modification of reps, sets, duration, and completion status
Completion status selection with options for "in progress," "finished," and "finished without completing all"
Performance data entry forms that adapt based on exercise type:
Strength exercises: Input fields for number of reps, number of target sets, and a directly editable input field for actual sets completed that is always visible and saves values in real time without requiring edit buttons
Cardio exercises: Input field for duration in minutes
Individual completion status controls for each exercise within workout sessions
Exercise completion status controls show loading spinners when clicked and disable all other completion controls in the same workout during processing
Workout view automatically refreshes and updates completion status display immediately when exercises are marked with different completion statuses
Real-time display of individual exercise completion status and overall workout completion status without requiring manual refresh
Workouts view showing user's workout sessions with performance data displayed appropriately:
Strength exercises show "X reps, Y target sets, Z actual sets completed" format with correct actual sets completed value for each individual exercise
Cardio exercises show "X minutes" format
Individual exercise completion status displayed for each exercise
Overall workout completion status displayed for each workout
"Create Workout" button prominently displayed on the Workouts page for easy access to starting a new workout
Copy workout functionality available in Workouts view with "copy workout" button for each workout
Delete functionality for individual workouts in Workouts view with styled delete buttons that display both an icon and the word "Delete" to make the action clear to users
Delete buttons for exercises are styled buttons that display both an icon and the word "Delete" to clearly indicate the destructive action
All delete buttons throughout the application are styled as proper buttons with consistent visual design, making them visually clear and easy to interact with
Delete buttons maintain consistent styling across all sections of the application including exercises, workouts, and any other deletable items
Simple forms for adding new personal exercises and workouts with exercise type selection
Personalized interface elements using stored user names that update when name is changed
Browser tab title displays "Active+" across all pages
Favicon uses the Active+ logo for consistent branding
Navigation System
Left sidebar navigation positioned on the left side of the screen for the main application interface on desktop devices
Sidebar contains navigation links to all major sections: Home, exercises, workouts, and profile
Home navigation button routes users to the homepage with application usage instructions
Navigation remains accessible throughout the application
Sidebar design follows the minimalistic flat design approach with simple navigation items
Navigation is displayed for all users
Copyright footer displays "© 2026 - Vansh." and is positioned within the left sidebar at the bottom of the sidebar area
Footer remains visible within the sidebar layout and maintains consistent styling with the sidebar design
When hovering over navigation items in the sidebar, the highlight uses a light background color in both dark and light modes
Hover highlight ensures text remains legible and accessible with proper contrast in both theme modes
Active+ logo with text is displayed consistently in the navigation bar for both desktop and mobile
Mobile Responsive Navigation
On mobile devices, the left sidebar navigation transforms into a collapsible mobile-friendly navigation system
Mobile navigation uses a hamburger menu button that toggles the navigation menu visibility
When opened on mobile, the navigation menu slides in from the side and overlays the main content
The mobile navigation menu is positioned above any overlay elements to ensure navigation items remain fully interactive and tappable
Navigation menu items are sized appropriately for touch interaction on mobile devices
The navigation menu automatically closes when a navigation item is selected on mobile
Home navigation button is accessible in mobile navigation and routes to the homepage
Copyright footer displaying "© 2026 - Vansh." remains accessible within the mobile navigation menu
Mobile navigation maintains the same flat design principles and theme support as the desktop sidebar
When the mobile sidebar is open, users can tap navigation options without any overlay interference blocking interaction with menu items
Active+ logo with text is displayed consistently in the mobile navigation bar
Modal Dialog System
All notifications, confirmations, and alerts are displayed using in-browser modal dialogs instead of browser alert windows
Modal dialogs provide a modern and seamless user experience that stays within the application interface
Confirmation dialogs for destructive actions like deleting exercises or workouts use modal dialogs with clear action buttons
Success and error notifications are displayed in modal dialogs with appropriate styling and messaging
Modal dialogs can be dismissed by clicking outside the modal area or using a close button
Modal dialogs maintain focus and accessibility standards for keyboard navigation
Modal dialogs adapt to the selected theme with appropriate colors and styling
Mobile Responsive Modal Dialogs
Modal dialogs are fully responsive and adapt to mobile screen sizes
On mobile devices, modals resize to fit the screen width with appropriate margins
Modal content is scrollable on mobile when content exceeds screen height
Modal buttons are sized appropriately for touch interaction on mobile devices
Close buttons and interactive elements in modals are easily accessible on touch screens
Modal dialogs maintain proper spacing and readability on small screens
Design System
Minimalistic design approach with flat colors and simple layouts throughout the application
No drop shadows or subtle gradients on any components, backgrounds, or buttons
Clean, modern appearance using solid colors and simple geometric shapes
Consistent flat design language applied to all interface elements including cards, buttons, forms, navigation, sidebar, and homepage
Simple color palette with clear contrast for readability and accessibility in both light and dark themes
Dark theme is the default theme and uses appropriate dark backgrounds with light text maintaining the same flat design principles
Light theme uses light backgrounds with dark text following the established flat design approach
Streamlined visual hierarchy using typography, spacing, and flat color blocks rather than visual effects
Left sidebar navigation maintains the same flat design principles with simple, clean styling in both themes
Footer within the sidebar follows the same flat design principles and integrates seamlessly with the sidebar styling in both themes
Theme transitions are smooth and all interface elements properly adapt to the selected theme
Homepage follows the same flat design principles in dark mode by default
Workout components in dark mode use background colors that match or closely resemble the sidebar's background color to ensure visual consistency and a unified appearance throughout the application
Modern visual clarity maintained throughout all interface elements
Active+ branding and logo assets properly integrated and displayed throughout the application including the homepage
Mobile Responsive Design System
All interface elements are fully responsive and adapt to different screen sizes
Typography scales appropriately for mobile devices while maintaining readability
Buttons and interactive elements are sized for touch interaction with adequate touch targets
Form inputs and controls are optimized for mobile input methods
Spacing and padding adjust appropriately for smaller screens
Content layouts stack vertically on mobile devices when horizontal space is limited
Cards and containers resize fluidly to fit mobile screen widths
The flat design principles are maintained across all screen sizes
Homepage content is fully responsive and displays properly on mobile devices
Workout Card Hover Effects
Workout cards have very subtle hover effects with minimal background color changes in both dark and light modes
Hover highlight is extremely subtle to preserve the visual hierarchy and ensure exercises within the workout remain clearly distinguishable
The subtle hover effect provides gentle user feedback without overwhelming the workout content or interfering with exercise readability
Hover effects maintain the flat design principles with no shadows or gradients, using only very light background color adjustments
The subtle nature of the hover effect ensures that individual exercises and their completion status remain the primary visual focus within workout cards
Mobile Responsive Workout Cards
Workout cards are fully responsive and adapt to mobile screen widths
On mobile devices, workout cards stack vertically and utilize the full screen width
Exercise information within workout cards is displayed in a mobile-friendly layout
Performance data and completion controls are appropriately sized for touch interaction
Actual sets completed input fields are optimized for mobile keyboard input
Card content maintains proper spacing and readability on small screens
Hover effects are replaced with appropriate touch feedback on mobile devices
Mobile Responsive Forms
All forms throughout the application are optimized for mobile devices
Form inputs are sized appropriately for touch interaction with adequate spacing
Input fields utilize appropriate mobile keyboard types (numeric for numbers, etc.)
Form layouts adapt to mobile screen sizes with proper spacing and alignment
Submit buttons are sized for easy touch interaction
Form validation messages display properly on mobile screens
Multi-step forms or complex forms break down appropriately for mobile viewing
Mobile Responsive Layout System
The overall application layout adapts seamlessly between desktop and mobile viewports
Content areas resize fluidly to accommodate different screen sizes
Main content areas stack appropriately on mobile devices
Sidebar navigation transforms into mobile-friendly navigation patterns
Page headers and titles scale appropriately for mobile screens
Loading states and transitions work smoothly across all device sizes
The application maintains full functionality across all responsive breakpoints
Homepage layout is fully responsive and adapts to all screen sizes
Application Language
All application content, interface text, labels, and messages are displayed in English
User interface maintains consistent English language throughout all components and features
Error messages, notifications, and help text are provided in English
Form labels, buttons, and navigation items use clear English terminology
Homepage content and instructions are written in clear, user-friendly English
